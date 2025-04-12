// Type definition for demo position
export interface DemoPosition {
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
}

// Interface for demo trade history item
export interface DemoTradeHistoryItem {
  id: string;
  positionId: string;
  type: "open" | "close" | "liquidation";
  date: Date;
  country: {
    id: string;
    name: string;
    flagUrl?: string;
  };
  direction: "long" | "short";
  size: number;
  leverage: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  fundingFee?: number;
}

// Interface for demo mode store
export interface DemoModeStore {
  isDemoMode: boolean;
  demoBalance: number;
  demoPositions: DemoPosition[];
  demoTradeHistory: DemoTradeHistoryItem[];
  toggleDemoMode: () => void;
  updateDemoBalance: (amount: number) => void;
  addDemoPosition: (position: DemoPosition) => void;
  closeDemoPosition: (
    id: string,
    exitPrice?: number,
    pnl?: number,
    fundingFee?: number
  ) => void;
  clearAllDemoPositions: () => void;
  resetDemoMode: () => void;
}
