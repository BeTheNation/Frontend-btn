// SPDX-License-Identifier: MIT
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Check required environment variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
  throw new Error(
    "Please set your SEPOLIA_RPC_URL and PRIVATE_KEY in a .env file"
  );
}

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
