# `@bbachain/spl-token`

A TypeScript library for interacting with the SPL Token and Token-2022 programs.

## Links

- [TypeScript Docs](https://bbachain.github.io/program-executor/token/js/)
- [FAQs (Frequently Asked Questions)](#faqs)
- [Install](#install)
- [Build from Source](#build-from-source)

## FAQs

### How can I get support?

Please ask questions in the BBAChain Stack Exchange: https://bbachain.stackexchange.com/

If you've found a bug or you'd like to request a feature, please
[open an issue](https://github.com/bbachain/program-executor/issues/new).

### No export named Token

Please see [upgrading from 0.1.x](#upgrading-from-0.1.x).

## Install

```shell
npm install --save @bbachain/spl-token @bbachain/web3.js
```
_OR_
```shell
yarn add @bbachain/spl-token @bbachain/web3.js
```

## Build from Source

0. Prerequisites

* Node 16+
* NPM 8+

1. Clone the project:
```shell
git clone https://github.com/bbachain/program-executor.git
```

2. Navigate to the library:
```shell
cd program-executor/token/js
```

3. Install the dependencies:
```shell
npm install
```

4. Build the library:
```shell
npm run build
```

5. Build the on-chain programs:
```shell
npm run test:build-programs
```

6. Run the tests:
```shell
npm run test
```

7. Run the example:
```shell
npm run example
```

## Upgrading

### Upgrading from 0.1.0

There are no breaking changes from 0.1.0, only new functionality for Token-2022.
