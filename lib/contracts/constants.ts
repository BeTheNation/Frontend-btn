import { Address, Abi } from "viem";
import POSITIONS_ABI from "./POSITIONS_ABI.json";
import ORDERS_ABI from "./ORDERS_ABI.json";
import POOLS_ABI from "./POOLS_ABI.json";
import RESOLVES_ABI from "./RESOLVES_ABI.json";

export const RPC_URL = `https://backendd.betheback.my.id`;

export const POSITION_ABI = POSITIONS_ABI as Abi;
export const ORDER_ABI = ORDERS_ABI as Abi;
export const POOL_ABI = POOLS_ABI as Abi;
export const RESOLVE_ABI = RESOLVES_ABI as Abi;

export const POSITION_ADDRESS: Record<number, Address> = {
  84532: "0x9fead44f799927BaBc81598fF6134543A2240173", // Base Sepolia
} as const;

export const ORDER_ADDRESS: Record<number, Address> = {
  84532: "0x369327Cb1f9E164A20215Bb12024108BdbE1c8E1", // Base Sepolia
} as const;

export const POOL_ADDRESS: Record<number, Address> = {
  84532: "0x58Ef175Ee3c1CEF2603130F89cDcD09d6406230C", // Base Sepolia
} as const;

export const RESOLVE_ADDRESS: Record<number, Address> = {
  84532: "0x579364ACB169d953e26561073F5A95F490A4bE06", // Base Sepolia
} as const;
