import { Address } from "viem";

export interface Position {
  id: string;
  country: {
    id: string;
    name: string;
    flagUrl?: string;
  };
  direction: "long" | "short";
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  openTime: Date;
  fundingRate: number;
  nextFundingTime: Date;
  txHash?: string;
}

export interface ContractPosition {
  positionId: bigint;
  countryId: string;
  trader: Address;
  direction: boolean;
  size: bigint;
  leverage: number;
  entryPrice: bigint;
  openTime: bigint;
  takeProfit: bigint;
  stopLoss: bigint;
  isOpen: boolean;
}

export interface TPSLConfig {
  takeProfit: bigint;
  stopLoss: bigint;
}
