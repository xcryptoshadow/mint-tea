import { config, ethers } from "hardhat";
import { evm } from "@debridge-finance/desdk";
import { HttpNetworkConfig } from "hardhat/types";
import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";

// for nodejs older versions.
// inject node-fetch's fetch() to global context
// const _importDynamic = new Function("modulePath", "return import(modulePath)");
// global.fetch = async (...args: any) => {
//   const { default: fetch } = await _importDynamic("node-fetch");
//   return fetch(...args);
// };

const TX_HASH =
  "0x8c38070fbbaa22a3166a3785cd6be41b90658e61a4442040ca0ed2363f6068ef";

async function main() {
  const evmOriginContext: evm.Context = {
    // provide a URL to the RPC node of the 🛫origin chain
    provider: (config.networks.polygon as HttpNetworkConfig).url,
  };
  // find all submissions submitted in your transaction by its hash
  // Obviously, a single transaction may contain multiple submissions:
  // a contract may call deBridgeGate.send() multiple times, e.g. to submit data
  // to different chains simultaneously - that's why Submission.findAll()
  // returns an array of Submission objects
  const submissions = await evm.Submission.findAll(TX_HASH, evmOriginContext);

  // take the first submission.
  // DO YOUR OWN SANITY CHECKS TO ENSURE IT CONTAINS THE EXPECTED NUMBER OF SUBMISSIONS
  const [submission] = submissions;

  // check if submission if confirmed: validator nodes wait a specific block
  // confirmations before sign the message. Currently, 12 blocks is expected
  // for most supported EVM chains (256 for Polygon).
  const isConfirmed = await submission.hasRequiredBlockConfirmations();

  // there is also a bunch of useful properties that describe the submission, e.g.
  console.log("cross-chain asset ID transferred: ", submission.debridgeId);
  console.log("amount transferred to", submission.amount, submission.receiver);

  const evmDestinationContext: evm.Context = {
    // provide a URL to the RPC node of the 🛬destination chain
    provider: (config.networks.arbitrum as HttpNetworkConfig).url,
  };

  if (isConfirmed) {
    const claim = await submission.toEVMClaim(evmDestinationContext);

    // check if claim has been signed by enough validators
    const isSigned = await claim.isSigned();

    // check if this claim has been already executed
    const isExecuted = await claim.isExecuted();

    // get claim args
    if (isSigned && !isExecuted) {
      // the resulting tuple of args to be then passed to the deBridgeGate.claim() method
      const claimArgs = await claim.getEncodedArgs();

      const [owner] = await ethers.getSigners();
      const deBridgeGate = await new ethers.Contract(
        DEFAULT_DEBRIDGE_GATE_ADDRESS,
        [
          "function claim(bytes32 _debridgeId,uint256 _amount,uint256 _chainIdFrom,address _receiver,uint256 _nonce,bytes calldata _signatures,bytes calldata _autoParams) external",
        ],
        owner
      );

      // e.g. using ethers.js:
      const tx = await deBridgeGate.claim(...claimArgs);
      const result = await tx.wait();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
