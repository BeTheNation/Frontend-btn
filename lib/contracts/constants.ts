import { Address, Abi } from "viem";
import POSITIONS_ABI from "./POSITIONS_ABI.json";
import ORDERS_ABI from "./ORDERS_ABI.json";
import POOLS_ABI from "./POOLS_ABI.json";
// import RESOLVES_ABI from "./RESOLVES_ABI.json";

export const RPC_URL = `https://backendd.betheback.my.id`;

export const POSITION_ABI = POSITIONS_ABI as Abi;
export const ORDER_ABI = ORDERS_ABI as Abi;
export const POOL_ABI = POOLS_ABI as Abi;
// export const RESOLVE_ABI = RESOLVES_ABI as Abi;

export const POSITION_ADDRESS: Record<number, Address> = {
  84532: "0x9fead44f799927BaBc81598fF6134543A2240173", // Base Sepolia
} as const;

export const ORDER_ADDRESS: Record<number, Address> = {
  84532: "0x369327Cb1f9E164A20215Bb12024108BdbE1c8E1", // Base Sepolia
} as const;

export const POOL_ADDRESS: Record<number, Address> = {
  97: "0x729e9250fDec66dbb09db7757206dB569EF700C5", // BNB Testnet
} as const;

// export const RESOLVE_ADDRESS: Record<number, Address> = {
//   97: "0x27B6018F6a8656e6da0f81eEc41849A529564F41", // BNB Testnet
// } as const;
