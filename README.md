# Decentralized Voting using Blockchain

## Prerequisite

- [Ganache](https://www.npmjs.com/package/ganache-cli)
- [Truffle](https://www.npmjs.com/package/truffle)
- [Metamask](https://metamask.io/)

**Note** : truffle and ganache should be installed globally

## Installation

```bash
# Install dependencies
./install.sh <package-manager>
# or
npm i
cd ./frontend
npm i
```

## Running

**Note**: Ensure `ganache-cli` is running at port 8545

```bash
# Run every time you start the app
./setup.sh
# or
truffle compile
truffle migrate
```

Start app by running `npm run dev`

App should be running on [http://localhost:3000/](http://localhost:3000/)

## Test

```bash
npm test
```
