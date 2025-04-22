import {
  PredictionMarketAbi,
  PredictionMarketAbi__factory,
} from "@/types/contracts";
import { formatEther, parseEther } from "viem";
import { Address } from "@/types/abitype";
import { ContractPosition, Position, TPSLConfig } from "./types";
import { handleContractFunctionExecutionError } from "@/lib/viem-error-decoder";
import { toast } from "@/components/ui/use-toast";

// Use the actual contract ABI from PredictionMarket.json
export const PREDICTION_MARKET_ABI = [
  {
    inputs: [
      { internalType: "string", name: "countryId", type: "string" },
      {
        internalType: "enum PredictionMarket.PositionDirection",
        name: "direction",
        type: "uint8",
      },
      { internalType: "uint8", name: "leverage", type: "uint8" },
      { internalType: "uint256", name: "size", type: "uint256" },
    ],
    name: "openPosition",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "takeProfit", type: "uint256" },
      { internalType: "uint256", name: "stopLoss", type: "uint256" },
    ],
    name: "setTPSL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPosition",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "positionId", type: "uint256" },
          { internalType: "string", name: "countryId", type: "string" },
          { internalType: "address", name: "trader", type: "address" },
          {
            internalType: "enum PredictionMarket.PositionDirection",
            name: "direction",
            type: "uint8",
          },
          { internalType: "uint256", name: "size", type: "uint256" },
          { internalType: "uint8", name: "leverage", type: "uint8" },
          { internalType: "uint256", name: "entryPrice", type: "uint256" },
          { internalType: "uint256", name: "openTime", type: "uint256" },
          { internalType: "uint256", name: "takeProfit", type: "uint256" },
          { internalType: "uint256", name: "stopLoss", type: "uint256" },
          { internalType: "bool", name: "isOpen", type: "bool" },
          {
            internalType: "uint256",
            name: "liquidationPrice",
            type: "uint256",
          },
        ],
        internalType: "struct PredictionMarket.Position",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    // ERC20InsufficientAllowance error definition from OpenZeppelin
    type: "error",
    name: "ERC20InsufficientAllowance",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "allowance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" },
    ],
  },
] as const;

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<number, Address> = {
  // New contract addresses from our Sepolia deployment
  11155111: "0x3Bc2f3BD1E74F669C24fF6d4D53A5DFfb6d5B08F", // Sepolia testnet - PredictionMarket
  31337: "0x3Bc2f3BD1E74F669C24fF6d4D53A5DFfb6d5B08F", // Use Sepolia for local testing too
  // Add more networks as needed
};

// USDC token addresses
export const USDC_ADDRESSES: Record<number, Address> = {
  11155111: "0x4114d4AEae92Bad30E4cFaE6a85c6db0c3c5dA12", // Sepolia testnet - MockUSDC
  31337: "0x4114d4AEae92Bad30E4cFaE6a85c6db0c3c5dA12", // Use Sepolia for local testing too
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
 * Gets USDC token address for the specified chain
 */
export const getUSDCAddress = (chainId: number): Address => {
  const address = USDC_ADDRESSES[chainId];
  return address || USDC_ADDRESSES[11155111]; // Default to Sepolia
};

/**
 * Creates a minimal ERC20 contract interface for USDC
 */
export const getUSDCContract = (provider: any, chainId?: number): any => {
  try {
    if (!provider) {
      console.error("Provider is required to get USDC contract");
      return null;
    }

    const signer = provider.getSigner();
    if (!signer) {
      console.error("Signer not available from provider");
      return null;
    }

    // Get USDC address for current chain
    const usdcAddress = getUSDCAddress(chainId || 11155111);

    // Basic ERC20 interface with just the approve function
    const abi = [
      {
        constant: false,
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    // Create and return contract instance
    return new provider.Contract(usdcAddress, abi, signer);
  } catch (error) {
    console.error("Error getting USDC contract:", error);
    return null;
  }
};

/**
 * Approve USDC spending for the PredictionMarket contract
 */
export const approveUSDC = async (
  usdcContract: any,
  spender: Address,
  amount: bigint
): Promise<any> => {
  try {
    console.log(`Approving USDC: spender=${spender}, amount=${amount}`);

    // Call approve function
    const tx = await usdcContract.approve(spender, amount);
    console.log("Approval transaction sent:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error approving USDC:", error);
    throw error;
  }
};

/**
 * Open a new position on the contract
 */
export const openPosition = async (
  contract: PredictionMarketAbi,
  countryId: string,
  direction: "long" | "short", // maps to 0 for long, 1 for short
  leverage: number,
  marginAmount: string
): Promise<any> => {
  try {
    // Convert margin amount to Wei
    const size = parseEther(marginAmount);

    // Convert direction string to numeric enum value (0 for long, 1 for short)
    const directionValue = direction === "long" ? 0 : 1;

    console.log(
      `Opening position: countryId=${countryId}, direction=${directionValue} (${direction}), leverage=${leverage}, size=${size}`
    );

    // Validate parameters before sending
    if (!countryId) {
      throw new Error("Country ID is required");
    }
    if (leverage < 1 || leverage > 5) {
      throw new Error("Leverage must be between 1 and 5");
    }
    if (size <= 0n) {
      throw new Error("Position size must be greater than 0");
    }

    // Call contract function with the parameters and include zero value for payable function
    const tx = await contract.openPosition(
      countryId,
      directionValue,
      leverage,
      size
    );

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
  sender: Address
): Promise<any> => {
  try {
    console.log(`Closing position for address: ${sender}`);

    // The contract expects an address, not a position ID
    // Call contract function with the sender's address
    const tx = await contract.closePosition(sender);
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
  takeProfit: number,
  stopLoss: number
): Promise<any> => {
  try {
    // Format the takeProfit and stopLoss values
    const tpsl = formatTPSL(takeProfit, stopLoss);

    console.log(`Setting TP/SL: TP=${tpsl.takeProfit}, SL=${tpsl.stopLoss}`);

    // Call contract function
    const tx = await contract.setTPSL(tpsl.takeProfit, tpsl.stopLoss);
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
 * Convert a number to a BigInt with proper scaling for blockchain
 */
export const formatMarginAmount = (amount: string): bigint => {
  try {
    return parseEther(amount);
  } catch (error) {
    console.error("Error formatting margin amount:", error);
    throw error;
  }
};

/**
 * Format take profit and stop loss values
 */
export const formatTPSL = (
  takeProfit: number,
  stopLoss: number
): TPSLConfig => {
  // Convert to BigInt values
  // Here we assume the values are provided as whole numbers and we convert them to wei
  return {
    takeProfit: BigInt(takeProfit),
    stopLoss: BigInt(stopLoss),
  };
};

/**
 * Convert contract position to frontend position
 */
export const contractPositionToPosition = (
  contractPosition: ContractPosition,
  countryData: any
): Position => {
  // Convert direction from enum (0 or 1) to string ('long' or 'short')
  const directionStr = contractPosition.direction === 0 ? "long" : "short";

  return {
    id: contractPosition.positionId.toString(),
    country: {
      id: contractPosition.countryId,
      name: countryData?.name || "Unknown",
      flagUrl: countryData?.flagUrl,
    },
    direction: directionStr,
    size: Number(formatEther(contractPosition.size)),
    leverage: contractPosition.leverage,
    entryPrice: Number(contractPosition.entryPrice),
    markPrice: 0, // This should be fetched from an oracle or API
    openTime: new Date(Number(contractPosition.openTime) * 1000),
    fundingRate: 0.0001, // This should be calculated based on contract data
    nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
  };
};

/**
 * Validate parameters for opening a position
 */
export const validateOpenPositionParams = (
  countryId: string,
  direction: number,
  leverage: number,
  value: bigint
): string | null => {
  if (!countryId) {
    return "Country ID is required";
  }
  if (direction !== 0 && direction !== 1) {
    return "Direction must be either 0 (long) or 1 (short)";
  }
  if (leverage < 1 || leverage > 5) {
    return "Leverage must be between 1 and 5";
  }
  if (value <= 0n) {
    return "Position size must be greater than 0";
  }
  return null;
};
