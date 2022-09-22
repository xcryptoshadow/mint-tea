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

async function main() {
    /*const tokenid = await mint_tea.safeMint( signer.address, "nft", "test nft table","image url","external url","icon","15h30","duration","15" );
    console.log(`tokenid is: ${tokenid.value}`);*/
    //tokenid.wait();
    //await mint_tea.update_trait_type(1,2,"update new attribute");
    
    const tokenidstring = await mint_tea.tokenURI(1);
    console.log(`tokenidstring is: ${tokenidstring}`);

    /*const trait_id = await mint_tea.add_new_attribute(1,"new attribute3","18");
    console.log(`trait_id is: ${trait_id.value}`);*/
    
}

main();