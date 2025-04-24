import { Address } from "@/types/abitype";

// Contract addresses for different networks
export const CONTRACT_ADDRESSES: Record<number, Address> = {
  // Base Sepolia deployment
  84532: "0x3Bc2f3BD1E74F669C24fF6d4D53A5DFfb6d5B08F",
  31337: "0x3Bc2f3BD1E74F669C24fF6d4D53A5DFfb6d5B08F",
};

// USDC token addresses
export const USDC_ADDRESSES: Record<number, Address> = {
  84532: "0x4114d4AEae92Bad30E4cFaE6a85c6db0c3c5dA12",
  31337: "0x4114d4AEae92Bad30E4cFaE6a85c6db0c3c5dA12",
};

// Use the actual contract ABI
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
