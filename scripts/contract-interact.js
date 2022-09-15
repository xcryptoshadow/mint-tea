require('dotenv').config();
// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers, network } = require("hardhat")

const API_KEY = process.env.ALCHEMY_POLYGON_MUMBAI_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

/*const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL)*/

const contract = require("../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json");

// provider - Alchemy
//const NETWORK = "polygon-mumbai";
const alchemyProvider = new ethers.providers.AlchemyProvider("maticmum");

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const mint_tea = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
//const mint_tea = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

async function main() {
    const tokenidstring = await mint_tea.tokenURI(1);
    console.log(`tokenidstring is: ${tokenidstring}`);
}

main();