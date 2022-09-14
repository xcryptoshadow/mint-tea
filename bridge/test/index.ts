import { DeBridgeGate } from "@debridge-finance/hardhat-debridge/dist/typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish, Contract } from "ethers";
import { deBridge, ethers, upgrades } from "hardhat";
import { DeBridgeNFTDeployer, NFTBridge, SimpleNFT } from "../typechain-types";

const TOKEN_ID = 0;

interface TestSuiteState {
  owner: SignerWithAddress;
  user1: SignerWithAddress;
  gate: DeBridgeGate;
  gateProtocolFee: BigNumber;
  nftBridge: NFTBridge;
  deBridgeNFTDeployer: DeBridgeNFTDeployer;
  simpleNFT: SimpleNFT;
}

async function sign(
  name: string,
  nftAddress: string,
  spender: string,
  tokenId: number,
  nonce: BigNumberish,
  deadline: BigNumberish,
  chainId: number,
  signer: SignerWithAddress
) {
  const typedData = {
    types: {
      Permit: [
        { name: "spender", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: nftAddress,
    },
    message: {
      spender,
      tokenId,
      nonce,
      deadline,
    },
  };

  const signature = await signer._signTypedData(
    typedData.domain,
    { Permit: typedData.types.Permit },
    typedData.message
  );

  return signature;
}

async function deployContracts(): Promise<TestSuiteState> {
  const [owner, user1] = await ethers.getSigners();
  const gate = await deBridge.emulator.deployGate();

  const NFTBridgeFactory = await ethers.getContractFactory("NFTBridge");
  const nftBridge = (await upgrades.deployProxy(NFTBridgeFactory, [
    gate.address,
  ])) as NFTBridge;

  // There is only 1 chain in emulated environment...
  await nftBridge.addChainSupport(
    nftBridge.address,
    ethers.provider.network.chainId
  );

  const DeNFTFactory = await ethers.getContractFactory("DeNFT");
  const beacon = await upgrades.deployBeacon(DeNFTFactory);

  const DeBridgeNFTDeployerFactory = await ethers.getContractFactory(
    "DeBridgeNFTDeployer"
  );
  const deBridgeNFTDeployer = (await upgrades.deployProxy(
    DeBridgeNFTDeployerFactory,
    [beacon.address, nftBridge.address]
  )) as DeBridgeNFTDeployer;

  await nftBridge.setNFTDeployer(deBridgeNFTDeployer.address);

  const SimpleNFTFactory = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = (await SimpleNFTFactory.deploy()) as SimpleNFT;
  await simpleNFT.mintNFT(user1.address, TOKEN_ID, "");
  await simpleNFT.connect(user1).approve(nftBridge.address, TOKEN_ID);

  return {
    owner,
    user1,
    gate,
    gateProtocolFee: await gate.globalFixedNativeFee(),
    nftBridge,
    deBridgeNFTDeployer,
    simpleNFT,
  };
}

describe("deNFT", function () {
  let states: TestSuiteState;
  before(async () => {
    states = await deployContracts();
  });

  it("deNFT", async function () {
    const {
      // owner,
      user1,
      nftBridge,
      // deBridgeNFTDeployer,
      gateProtocolFee,
      simpleNFT,
    } = states;

    // createNFT
    // const tx = await nftBridge.createNFT(
    //   owner.address,
    //   "Original NFT",
    //   "ORGNL",
    //   ""
    // );
    // const receipt = await tx.wait();
    // const deNFTAddress = receipt
    //   .logs!.flatMap((log) =>
    //     log.address === deBridgeNFTDeployer.address
    //       ? deBridgeNFTDeployer.interface.parseLog(log)
    //       : []
    //   )
    //   .find((event) => {
    //     return event.name === "NFTDeployed";
    //   })!.args.asset as string;

    // const DeNFTFactory = await ethers.getContractFactory("DeNFT");
    // const deNFT = DeNFTFactory.attach(deNFTAddress);

    // // mint
    // const tokenId = 0;
    // await deNFT.connect(owner).mint(user1.address, tokenId, "");
    // expect(await (await deNFT.balanceOf(user1.address)).toNumber()).equal(1);

    // send
    // await deNFT.connect(owner).giveawayToDeNFTBridge();
    // const deadline = ethers.constants.MaxUint256;
    // const signature = await sign(
    //   await deNFT.name(),
    //   deNFTAddress,
    //   nftBridge.address,
    //   tokenId,
    //   await deNFT.nonces(tokenId),
    //   deadline,
    //   ethers.provider.network.chainId,
    //   user1
    // );

    const chainIdTo = ethers.provider.network.chainId;
    const tx2 = await nftBridge.connect(user1).send(
      simpleNFT.address,
      TOKEN_ID,
      // deadline,
      // signature,
      chainIdTo,
      user1.address,
      0,
      0,
      {
        value: gateProtocolFee,
      }
    );

    expect(await (await simpleNFT.balanceOf(user1.address)).toNumber()).equal(
      0
    );
    await deBridge.emulator.autoClaim();
  });
});
