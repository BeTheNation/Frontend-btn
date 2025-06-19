import { Address, Abi } from "viem";
import POSITIONS_ABI from "./POSITIONS_ABI.json";
import ORDERS_ABI from "./ORDERS_ABI.json";

export const RPC_URL = `https://backendd.betheback.my.id`;

export const POSITION_ABI = POSITIONS_ABI as Abi;
export const ORDER_ABI = ORDERS_ABI as Abi;

export const POSITION_ADDRESS: Record<number, Address> = {
  84532: "0xA62F56b0BE223e60457f652f08DdEd7E173c1022", // Base Sepolia
} as const;

export const ORDER_ADDRESS: Record<number, Address> = {
  84532: "0x30B9Ff7eC9Ca3d3f85044ae23A8E61cB1FFA32cB", // Base Sepolia
} as const;
