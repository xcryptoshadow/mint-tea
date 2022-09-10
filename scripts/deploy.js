// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers, network } = require("hardhat")
// Import Tableland
const { connect } = require("@tableland/sdk")

// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))
globalThis.fetch = fetch

async function main() {

  const [signer] = await ethers.getSigners();
  //console.log("Deploying contracts with the account:", deployer.address);
  console.log(`\nDeploying to network '${network.name}' with account ${signer.address}`)
  const Mint_tea = await ethers.getContractFactory("MTEA");
  // Connect to Tableland
	const tableland = await connect({ signer, chain: "polygon-mumbai" })
  console.log("tableland address", tableland.options.contract);
  const mint_tea = await Mint_tea.deploy(tableland.options.contract);

  await mint_tea.deployed();

  
  // Log the deployed address and call the getter on `baseURIString` (for demonstration purposes)
	console.log(`\nTwoTablesNFT contract deployed on ${network.name} at: ${mint_tea.address}`);

  const mainTable = await mint_tea.mainTable();
	console.log(`mainTable name is: ${mainTable}`);
  const attributesTable = await mint_tea.attributesTable();
	console.log(`attributestable name is: ${attributesTable}`);


  const tokenid = await mint_tea.safeMint( signer.address, "nft", "test nft table","null","type",15 );
  console.log(`tokenid is: ${tokenid.value}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
