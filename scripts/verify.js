// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { ethers, network } = require("hardhat")
require("@nomiclabs/hardhat-etherscan")
const dotenv = require("dotenv")
dotenv.config()

async function main() {
	// Optionally, do the vefication as a separate script

	await hre.run("verify:verify", {
		address: "0x92Df98CbcA8d2cEe0cfb8713220a385Ac88D7C68", // Deployed contract address -- potentially, use `hre` to help here
		constructorArguments: ['0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68'],//tableland address on polygon-mumbai
	})
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
