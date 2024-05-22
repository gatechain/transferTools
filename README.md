# Hardhat Boilerplate

This repository contains a sample project that you can use as the starting point
for your Ethereum project. It's also a great fit for learning the basics of
smart contract development.

This project is intended to be used with the
[Hardhat Beginners Tutorial](https://hardhat.org/tutorial), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, `scripts` and `frontend` directories.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone git@github.com:gatechain/transferTools.git
cd transferTools
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat test test/DeployTransfersTools.ts --network sepolia
npx hardhat test test/ETHTransfers.ts --network sepolia
npx hardhat test test/ERC20Transfers.ts --network sepolia
```

