# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Deployments Note

Deployed to network Polygon Mumbai testnet

Mint Tea NFT contract deployed on polygon-mumbai at: 0x8d57FfB931426aAa612591F846BD00d6c580A59c

Tableland address 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

mainTable name is: Mint_TEA_80001_1706
attributestable name is: Mint_TEA_80001_1707
tokenid is: 0

```shell
npx hardhat run scripts/deploy.js --network polygon-mumbai
```

## Verify Contracts Note

You will need to verify your contracts as below, replace the first address with your new contract address

```shell
npx hardhat verify --network polygon-mumbai "0x8d57FfB931426aAa612591F846BD00d6c580A59c"
```