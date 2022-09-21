import { config, ethers } from "hardhat";

const NFT_BRIDGE_ADDRESS = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
async function main() {
  const nftBridge = await ethers.getContractAt("NFTBridge", NFT_BRIDGE_ADDRESS);

  const tx = await nftBridge.addChainSupport(
    NFT_BRIDGE_ADDRESS,
    // config.networks.avalanche.chainId!
    config.networks.arbitrum.chainId!
  );
  const result = await tx.wait();
  // console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
