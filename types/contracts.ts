// Using a generic interface instead of importing from ethers
interface BaseContract {
  address: string;
  [key: string]: any;
}

import type { Address } from "./abitype";

// Interface for the PredictionMarket contract
export interface PredictionMarketAbi extends BaseContract {
  openPosition: (
    countryId: string,
    direction: number, // 0 for LONG, 1 for SHORT
    leverage: number,
    size: bigint
  ) => Promise<any>;
  closePosition: (sender: Address) => Promise<any>;
  setTPSL: (takeProfit: bigint, stopLoss: bigint) => Promise<any>;
  getPosition: () => Promise<any>;
  getPositionsByTrader: (trader: Address) => Promise<any[]>;
}

// Factory class to create contract instance
export class PredictionMarketAbi__factory {
  static connect(address: string, signer: any): PredictionMarketAbi {
    return {
      address,
      ...signer,
    } as PredictionMarketAbi;
  }
}
