// Using a generic interface instead of importing from ethers
interface BaseContract {
  address: string;
  [key: string]: any;
}

import { Address } from "abitype";

export interface PredictionMarketAbi extends BaseContract {
  openPosition: (
    countryId: string,
    direction: boolean,
    leverage: number
  ) => Promise<any>;
  closePosition: (positionId: bigint) => Promise<any>;
  setTPSL: (
    positionId: bigint,
    takeProfit: bigint,
    stopLoss: bigint
  ) => Promise<any>;
  getPosition: (positionId: bigint) => Promise<any>;
  getPositionsByTrader: (trader: Address) => Promise<any[]>;
}

// Factory class for creating PredictionMarketAbi instances
export class PredictionMarketAbi__factory {
  static connect(address: string, signer: any): PredictionMarketAbi {
    return {
      address,
      openPosition: async () => ({}),
      closePosition: async () => ({}),
      setTPSL: async () => ({}),
      getPosition: async () => ({}),
      getPositionsByTrader: async () => [],
    } as PredictionMarketAbi;
  }
}
