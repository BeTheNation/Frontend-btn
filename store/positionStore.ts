"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Position {
  id: string;
  country: any;
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

interface TradeHistoryItem {
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
  txHash?: string;
}

interface PositionStore {
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
  loading?: boolean;
  addPosition: (position: Position) => void;
  closePosition: (
    id: string,
    exitPrice?: number,
    pnl?: number,
    fundingFee?: number
  ) => void;
  addTradeToHistory: (trade: TradeHistoryItem) => void;
}

export const usePositionStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      positions: [],
      tradeHistory: [],
      addPosition: (position) => {
        // Add the position to the store
        set((state) => ({
          positions: [...state.positions, position],
        }));

        // Add to history as 'open'
        const openTrade: TradeHistoryItem = {
          id: `trade-${Date.now()}-open`,
          positionId: position.id,
          type: "open",
          date: new Date(),
          country: position.country,
          direction: position.direction,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
        };

        set((state) => ({
          tradeHistory: [...state.tradeHistory, openTrade],
        }));
      },

      closePosition: (id, exitPrice, pnl, fundingFee) => {
        // Find position
        const position = get().positions.find((p) => p.id === id);
        if (!position) return;

        // Remove from active positions
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        }));

        // If position found, add to history as 'close'
        get().addTradeToHistory({
          id: `trade-${Date.now()}`,
          positionId: id,
          type: "close" as "open" | "close" | "liquidation",
          date: new Date(),
          country: position.country,
          direction: position.direction,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: exitPrice || position.markPrice,
          pnl,
          fundingFee,
        });
      },

      addTradeToHistory: (trade: TradeHistoryItem) => {
        set((state) => ({
          tradeHistory: [...state.tradeHistory, trade],
        }));
      },
    }),
    {
      name: "position-store",
    }
  )
);
