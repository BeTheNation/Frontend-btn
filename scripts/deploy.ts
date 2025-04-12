const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the contract factory
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  console.log("📦 Deploying PredictionMarket...");

  // Deploy the contract
  const predictionMarket = await PredictionMarket.deploy();
  await predictionMarket.waitForDeployment();

  // Get the deployed contract address
  const predictionMarketAddress = await predictionMarket.getAddress();

  console.log("🎉 PredictionMarket deployed to:", predictionMarketAddress);
  console.log("\nPlease update the following files with the new address:");
  console.log("1. lib/contracts/PredictionMarket.ts");
  console.log(`   11155111: "${predictionMarketAddress}",`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
