import {
  PredictionMarketAbi,
  PredictionMarketAbi__factory,
} from "@/types/contracts";
import { formatEther, parseEther } from "viem";
import { Address } from "@/types/abitype";
import { ContractPosition, Position, TPSLConfig } from "./types";

// Contract ABI - this would be replaced with the actual ABI once deployed
export const PREDICTION_MARKET_ABI = [
  {
    inputs: [
      { name: "countryId", type: "string" },
      { name: "direction", type: "bool" }, // true for long, false for short
      { name: "leverage", type: "uint8" },
    ],
    name: "openPosition",
    outputs: [{ name: "positionId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "positionId", type: "uint256" }],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "takeProfit", type: "uint256" },
      { name: "stopLoss", type: "uint256" },
    ],
    name: "setTPSL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "positionId", type: "uint256" }],
    name: "getPosition",
    outputs: [
      {
        components: [
          { name: "positionId", type: "uint256" },
          { name: "countryId", type: "string" },
          { name: "trader", type: "address" },
          { name: "direction", type: "bool" },
          { name: "size", type: "uint256" },
          { name: "leverage", type: "uint8" },
          { name: "entryPrice", type: "uint256" },
          { name: "openTime", type: "uint256" },
          { name: "takeProfit", type: "uint256" },
          { name: "stopLoss", type: "uint256" },
          { name: "isOpen", type: "bool" },
        ],
        name: "position",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<number, Address> = {
  11155111: "0x0000000000000000000000000000000000000000", // No contract deployed on Sepolia yet - will force demo mode
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Local Hardhat network
  // Add more networks as needed
};

/**
 * Gets prediction market contract instance for the connected chain
 * Uses ethers.js Contract
 */
export function getPredictionMarketContract(
  provider: any,
  chainId?: number
): PredictionMarketAbi | null {
  try {
    if (!provider) {
      console.error("Provider is required to get contract instance");
      return null;
    }

    const signer = provider.getSigner();
    if (!signer) {
      console.error("Signer not available from provider");
      return null;
    }

    // Get contract address for current chain
    const contractAddress = getContractAddress(chainId || 11155111);
    console.log(
      `Using contract address: ${contractAddress} for chain ID: ${
        chainId || 11155111
      }`
    );

    // Create and return contract instance
    const contract = PredictionMarketAbi__factory.connect(
      contractAddress,
      signer
    );
    return contract;
  } catch (error) {
    console.error("Error getting contract instance:", error);
    return null;
  }
}

/**
 * Validates if a contract address exists for the given chain ID
 */
export const validateContractAddress = (
  address: string | undefined
): boolean => {
  if (!address) return false;

  // For non-local networks, check if it's the zero address (which would trigger demo mode)
  if (address === "0x0000000000000000000000000000000000000000") {
    console.warn(
      "%c⚠️ DEMO MODE ACTIVE - NO CONTRACT DEPLOYED ⚠️\n" +
        "This app is running in demo mode because there is no contract deployed on Sepolia yet.\n" +
        "All transactions will be simulated. Deploy the contract to Sepolia and update the address in PredictionMarket.ts to enable live transactions.",
      "background: #FFC107; color: #000; font-size: 14px; padding: 5px; border-radius: 3px;"
    );
    return false;
  }

  // Check if address is valid Ethereum address
  return address.startsWith("0x") && address.length === 42;
};

/**
 * Gets contract address for the specified chain
 * If no chainId is provided (not connected to wallet), use Sepolia for demo
 * If address is not valid for current chainId, use Sepolia address
 */
export const getContractAddress = (chainId: number): Address => {
  const address = CONTRACT_ADDRESSES[chainId];
  // Default to Sepolia if no address for chainId
  return validateContractAddress(address)
    ? address
    : CONTRACT_ADDRESSES[11155111];
};

/**
 * Open a new position on the contract
 */
export const openPosition = async (
  contract: PredictionMarketAbi,
  countryId: string,
  direction: boolean, // true = long, false = short
  leverage: number,
  marginAmount: string
): Promise<any> => {
  try {
    // Convert margin amount to Wei
    const value = parseEther(marginAmount);

    // Validate parameters
    const errorMsg = validateOpenPositionParams(
      countryId,
      direction,
      leverage,
      value
    );
    if (errorMsg) {
      throw new Error(errorMsg);
    }

    console.log(
      `Opening position: countryId=${countryId}, direction=${direction}, leverage=${leverage}, value=${value}`
    );

    // Call contract function
    const tx = await contract.openPosition(countryId, direction, leverage);
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error opening position:", error);
    throw error;
  }
};

/**
 * Close an existing position
 */
export const closePosition = async (
  contract: PredictionMarketAbi,
  positionId: bigint
): Promise<any> => {
  try {
    console.log(`Closing position: ${positionId}`);

    // Call contract function
    const tx = await contract.closePosition(positionId);
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error closing position:", error);
    throw error;
  }
};

/**
 * Set Take Profit and Stop Loss for a position
 */
export const setTPSL = async (
  contract: PredictionMarketAbi,
  positionId: bigint,
  takeProfit: number,
  stopLoss: number
): Promise<any> => {
  try {
    const tpslConfig = formatTPSL(takeProfit, stopLoss);
    console.log(
      `Setting TP/SL for position ${positionId}: TP=${tpslConfig.takeProfit}, SL=${tpslConfig.stopLoss}`
    );

    // Call contract function
    const tx = await contract.setTPSL(
      positionId,
      tpslConfig.takeProfit,
      tpslConfig.stopLoss
    );
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error setting TP/SL:", error);
    throw error;
  }
};

/**
 * Format margin amount from string to bigint
 */
export const formatMarginAmount = (amount: string): bigint => {
  try {
    // Remove commas and non-numeric characters except decimal point
    const cleanedAmount = amount.replace(/[^\d.]/g, "");

    // Guard against invalid inputs
    if (!cleanedAmount || parseFloat(cleanedAmount) <= 0) {
      console.warn(
        "Invalid or zero margin amount, defaulting to minimum value"
      );
      return BigInt(1); // Return minimal value to avoid errors
    }

    // Check if the value has more than 18 decimal places (which would cause a RangeError)
    const parts = cleanedAmount.split(".");
    if (parts.length > 1 && parts[1].length > 18) {
      console.warn(
        "Value has too many decimal places, truncating to 18 decimals"
      );
      const truncated = parts[0] + "." + parts[1].substring(0, 18);
      return parseEther(truncated);
    }

    return parseEther(cleanedAmount);
  } catch (error) {
    console.error("Error formatting margin amount:", error);
    // Return a safe minimum value to avoid contract failures
    return BigInt(1);
  }
};

/**
 * Format contract position data to frontend format
 */
export const formatPosition = (data: any): ContractPosition => {
  return {
    positionId: data.positionId,
    countryId: data.countryId,
    trader: data.trader,
    direction: data.direction,
    size: data.size,
    leverage: data.leverage,
    entryPrice: data.entryPrice,
    openTime: data.openTime,
    takeProfit: data.takeProfit,
    stopLoss: data.stopLoss,
    isOpen: data.isOpen,
  };
};

/**
 * Format Take Profit and Stop Loss values to contract format
 */
export const formatTPSL = (
  takeProfit: number,
  stopLoss: number
): TPSLConfig => {
  return {
    takeProfit: BigInt(Math.floor(takeProfit * 1e6)),
    stopLoss: BigInt(Math.floor(stopLoss * 1e6)),
  };
};

/**
 * Convert contract position to frontend position model
 */
export const contractPositionToPosition = (
  contractPosition: ContractPosition,
  countryData: any
): Position => {
  return {
    id: contractPosition.positionId.toString(),
    country: {
      id: contractPosition.countryId,
      name: countryData?.name || "Unknown Country",
      flagUrl: countryData?.flagUrl || "",
    },
    direction: contractPosition.direction ? "long" : "short",
    size: parseFloat(formatEther(contractPosition.size)),
    leverage: contractPosition.leverage,
    entryPrice: Number(contractPosition.entryPrice) / 1e6,
    markPrice: countryData?.markPrice || 0,
    openTime: new Date(Number(contractPosition.openTime) * 1000),
    fundingRate: countryData?.fundingRate || 0.01,
    nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
  };
};

/**
 * Validate parameters for opening a position
 */
export const validateOpenPositionParams = (
  countryId: string,
  direction: boolean,
  leverage: number,
  value: bigint
): string | null => {
  if (!countryId) {
    return "Country ID is required";
  }

  if (!Number.isInteger(leverage)) {
    return `Leverage must be an integer (received: ${leverage})`;
  }

  if (leverage < 1 || leverage > 5) {
    return "Leverage must be between 1 and 5";
  }

  if (value <= BigInt(0)) {
    return "Margin amount must be greater than 0";
  }

  return null;
};
