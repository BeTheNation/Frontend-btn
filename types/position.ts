export type PositionDirection = "long" | "short";

export interface Position {
  id: string;
  country: {
    id: string;
    name: string;
    flagUrl?: string;
  };
  direction: PositionDirection;
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  openTime: Date;
  fundingRate: number;
  nextFundingTime: Date;
  txHash?: string;
}

export interface PositionWithPnL extends Position {
  unrealizedPnL: number;
  liquidationPrice: number;
}
