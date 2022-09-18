import { ethers, upgrades } from "hardhat";

const nftBridgeProxyAddress = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";

async function main() {
  const NFTBridgeFactory = await ethers.getContractFactory("NFTBridge");
  const nftBridge = await upgrades.upgradeProxy(
    nftBridgeProxyAddress,
    NFTBridgeFactory
  );

  console.log(nftBridge.address, " nftBridge address(should be the same)");

  console.log(
    await upgrades.erc1967.getImplementationAddress(nftBridge.address),
    " getImplementationAddress"
  );
  console.log(
    await upgrades.erc1967.getAdminAddress(nftBridge.address),
    " getAdminAddress"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
