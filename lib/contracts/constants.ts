import { Address } from "viem";
import MockUSDC_ABI_Imported from "./MockUSDC.json";


// Address of Trading Contract
/*
export const CONTRACT_ADDRESSES: Record<number, Address> = {
  // Pharos deployment
  50002: "0xb8e29BB907E0cb9aBfbAa9233EfE44dF07364a2A", // 
};
*/
// Address of Trading Contract
export const USDC_ADDRESSES: Record<number, Address> = {
  // Base  deployment
  50002: "0xb8e29BB907E0cb9aBfbAa9233EfE44dF07364a2A", 
};


// Use the actual contract ABI
export const MockUSDC_ABI = [
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
    //   inputs: [
    //     { internalType: "uint256", name: "takeProfit", type: "uint256" },
    //     { internalType: "uint256", name: "stopLoss", type: "uint256" },
    //   ],
    //   name: "setTPSL",
    //   outputs: [],
    //   stateMutability: "nonpayable",
    //   type: "function",
    // },
    // {
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

// Export imported JSON if needed
export const USDC_ABI = MockUSDC_ABI_Imported;
