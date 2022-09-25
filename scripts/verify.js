// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { ethers, network } = require("hardhat")
require("@nomiclabs/hardhat-etherscan")
const dotenv = require("dotenv")
dotenv.config()

async function main() {
	// Optionally, do the vefication as a separate script

	await hre.run("verify:verify", {
		address: "0xa4055C7A1f6e898BFA24fCdFac804598388C1f26", // Deployed contract address -- potentially, use `hre` to help here
		constructorArguments: ['0x5c4e6A9e5C1e1BF445A062006faF19EA6c49aFeA'], // Tableland address on Polygon mainnet
	})
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
