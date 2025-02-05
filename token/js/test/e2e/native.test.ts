import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import type { Connection, PublicKey, Signer } from '@bbachain/web3.js';
import { Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@bbachain/web3.js';
import {
    NATIVE_MINT,
    NATIVE_MINT_2022,
    TOKEN_PROGRAM_ID,
    closeAccount,
    getAccount,
    createNativeMint,
    createWrappedNativeAccount,
    syncNative,
} from '../../src';
import { TEST_PROGRAM_ID, newAccountWithDaltons, getConnection } from '../common';

describe('native', () => {
    let connection: Connection;
    let payer: Signer;
    let owner: Keypair;
    let account: PublicKey;
    let amount: number;
    let nativeMint: PublicKey;
    before(async () => {
        amount = 1_000_000_000;
        connection = await getConnection();
        payer = await newAccountWithDaltons(connection, 100_000_000_000);
        if (TEST_PROGRAM_ID == TOKEN_PROGRAM_ID) {
            nativeMint = NATIVE_MINT;
        } else {
            nativeMint = NATIVE_MINT_2022;
            await createNativeMint(connection, payer, undefined, nativeMint, TEST_PROGRAM_ID);
        }
    });
    beforeEach(async () => {
        owner = Keypair.generate();
        account = await createWrappedNativeAccount(
            connection,
            payer,
            owner.publicKey,
            amount,
            undefined,
            undefined,
            TEST_PROGRAM_ID,
            nativeMint
        );
    });
    it('works', async () => {
        const accountInfo = await getAccount(connection, account, undefined, TEST_PROGRAM_ID);
        expect(accountInfo.isNative).to.be.true;
        expect(accountInfo.amount).to.eql(BigInt(amount));
    });
    it('syncNative', async () => {
        let balance = 0;
        const preInfo = await connection.getAccountInfo(account);
        expect(preInfo).to.not.be.null;
        if (preInfo != null) {
            balance = preInfo.daltons;
        }

        // transfer daltons into the native account
        const additionalDaltons = 100;
        await sendAndConfirmTransaction(
            connection,
            new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: payer.publicKey,
                    toPubkey: account,
                    daltons: additionalDaltons,
                })
            ),
            [payer]
        );

        // no change in the amount
        const preAccountInfo = await getAccount(connection, account, undefined, TEST_PROGRAM_ID);
        expect(preAccountInfo.isNative).to.be.true;
        expect(preAccountInfo.amount).to.eql(BigInt(amount));

        // but change in daltons
        const postInfo = await connection.getAccountInfo(account);
        expect(postInfo).to.not.be.null;
        if (postInfo !== null) {
            expect(postInfo.daltons).to.eql(balance + additionalDaltons);
        }

        // sync, amount changes
        await syncNative(connection, payer, account, undefined, TEST_PROGRAM_ID);
        const postAccountInfo = await getAccount(connection, account, undefined, TEST_PROGRAM_ID);
        expect(postAccountInfo.isNative).to.be.true;
        expect(postAccountInfo.amount).to.eql(BigInt(amount + additionalDaltons));
    });
    it('closeAccount', async () => {
        let balance = 0;
        const preInfo = await connection.getAccountInfo(account);
        expect(preInfo).to.not.be.null;
        if (preInfo != null) {
            balance = preInfo.daltons;
        }
        const destination = Keypair.generate().publicKey;
        await closeAccount(connection, payer, account, destination, owner, [], undefined, TEST_PROGRAM_ID);
        const nullInfo = await connection.getAccountInfo(account);
        expect(nullInfo).to.be.null;
        const destinationInfo = await connection.getAccountInfo(destination);
        expect(destinationInfo).to.not.be.null;
        if (destinationInfo != null) {
            expect(destinationInfo.daltons).to.eql(balance);
        }
    });
});
