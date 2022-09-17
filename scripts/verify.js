// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { ethers, network } = require("hardhat")
require("@nomiclabs/hardhat-etherscan")
const dotenv = require("dotenv")
dotenv.config()

async function main() {
	// Optionally, do the vefication as a separate script

	await hre.run("verify:verify", {
		address: "0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68", // Deployed contract address -- potentially, use `hre` to help here
		constructorArguments: [
			"https://testnet.tableland.network/query?mode=list&s=",
			"Mint_TEA_80001_1913", // Name of the main table in the format {prefix}_{chainId}_{tableId}
			"Mint_TEA_80001_1914", // Name of the attributes table in the format {prefix}_{chainId}_{tableId}
		],
	})
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
