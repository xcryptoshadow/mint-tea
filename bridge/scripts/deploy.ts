import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";
import { config, deBridge, ethers, upgrades } from "hardhat";
import { DeBridgeNFTDeployer, NFTBridge } from "../typechain-types";

// NFTBridge deployed to address: 0x320Af97E6E8C580D6850890C81fd7161a3332C71
// DeNFT deployed to address: 0x195a17f9e714a79A9D4E1757Fe59a01a7B59Ea23
// deBridgeNFTDeployer deployed to address: 0xb2C3a5d2296b4d6BCb272E60f4Ce10d17Afcf32a

async function main() {
  const NFTBridgeFactory = await ethers.getContractFactory("NFTBridge");
  const nftBridge = (await upgrades.deployProxy(NFTBridgeFactory, [
    DEFAULT_DEBRIDGE_GATE_ADDRESS,
  ])) as NFTBridge;
  await nftBridge.deployed();
  console.log("NFTBridge deployed to address:", nftBridge.address);
  const DeNFTFactory = await ethers.getContractFactory("DeNFT");
  const beacon = await upgrades.deployBeacon(DeNFTFactory);
  await beacon.deployed();
  console.log("DeNFT deployed to address:", beacon.address);
  const DeBridgeNFTDeployerFactory = await ethers.getContractFactory(
    "DeBridgeNFTDeployer"
  );
  const deBridgeNFTDeployer = (await upgrades.deployProxy(
    DeBridgeNFTDeployerFactory,
    [beacon.address, nftBridge.address]
  )) as DeBridgeNFTDeployer;
  await deBridgeNFTDeployer.deployed();
  console.log(
    "deBridgeNFTDeployer deployed to address:",
    deBridgeNFTDeployer.address
  );

  await nftBridge.setNFTDeployer(deBridgeNFTDeployer.address);

  // await nftBridge.addChainSupport(
  //   nftBridge.address,
  //   config.networks.polygon.chainId!
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
