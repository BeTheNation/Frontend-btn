import { create } from 'zustand';

export interface TradeHistoryItem {
  country: string;
  countryCode: string;
  time: string;
  entryPrice: string;
  marketPrice: string;
  pnl: {
    amount: string;
    percentage: string;
    isProfit: boolean;
  };
  status: string;
}

interface TradeHistoryState {
  history: TradeHistoryItem[];
  addTrade: (trade: TradeHistoryItem) => void;
}

export const useTradeHistoryStore = create<TradeHistoryState>((set) => ({
  history: [],
  addTrade: (trade) => set((state) => ({ history: [trade, ...state.history] })),
})); 