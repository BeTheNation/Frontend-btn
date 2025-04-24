"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Position, PositionDirection } from "@/types/position";
import { ContractService } from "@/services/contract";

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
  direction: PositionDirection;
  size: number;
  leverage: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  fundingFee?: number;
  txHash?: string;
}

// Real implementation to fetch positions from blockchain
const fetchPositionsFromApi = async (): Promise<Position[]> => {
  try {
    // Gunakan client publik langsung atau service tanpa hook
    const contractService = new ContractService();
    // Assume you create a static method in ContractService
    const positions = await contractService.fetchPositions();
    return positions;
  } catch (e) {
    console.error("Error retrieving positions from contract:", e);

    // Fallback to localStorage
    try {
      const storedPositions = localStorage.getItem("realPositions");
      if (storedPositions) {
        return JSON.parse(storedPositions);
      }
    } catch (e) {
      console.error("Error retrieving positions from localStorage:", e);
    }
  }
  return [];
};

interface PositionStore {
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
  loading: boolean;
  error: string | null;
  addPosition: (position: Position) => void;
  closePosition: (
    id: string,
    exitPrice?: number,
    pnl?: number,
    fundingFee?: number
  ) => void;
  addTradeToHistory: (trade: TradeHistoryItem) => void;
  updatePosition: (positionId: string, updates: Partial<Position>) => void;
  removePosition: (positionId: string) => void;
  fetchPositions: () => Promise<void>;
}

export const usePositionStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      positions: [],
      tradeHistory: [],
      loading: false,
      error: null,
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

        // Persist to localStorage
        try {
          localStorage.setItem(
            "realPositions",
            JSON.stringify([...get().positions, position])
          );
        } catch (e) {
          console.error("Error saving positions to localStorage:", e);
        }
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

        // Persist to localStorage
        try {
          const updatedPositions = get().positions.filter((p) => p.id !== id);
          localStorage.setItem(
            "realPositions",
            JSON.stringify(updatedPositions)
          );
        } catch (e) {
          console.error("Error saving positions to localStorage:", e);
        }
      },

      addTradeToHistory: (trade: TradeHistoryItem) => {
        set((state) => ({
          tradeHistory: [...state.tradeHistory, trade],
        }));
      },

      updatePosition: (positionId, updates) => {
        set((state) => {
          const updatedPositions = state.positions.map((p) =>
            p.id === positionId ? { ...p, ...updates } : p
          );

          // Persist changes
          try {
            localStorage.setItem(
              "realPositions",
              JSON.stringify(updatedPositions)
            );
          } catch (e) {
            console.error("Error saving positions to localStorage:", e);
          }

          return { positions: updatedPositions };
        });
      },

      removePosition: (positionId) => {
        set((state) => {
          const filteredPositions = state.positions.filter(
            (p) => p.id !== positionId
          );

          // Persist changes
          try {
            localStorage.setItem(
              "realPositions",
              JSON.stringify(filteredPositions)
            );
          } catch (e) {
            console.error("Error saving positions to localStorage:", e);
          }

          return { positions: filteredPositions };
        });
      },

      fetchPositions: async () => {
        set({ loading: true, error: null });

        try {
          const positions = await fetchPositionsFromApi();
          set({ positions, loading: false });
        } catch (error) {
          console.error("Error fetching positions:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch positions",
            loading: false,
          });
        }
      },
    }),
    {
      name: "position-store",
    }
  )
);
