"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DemoPosition,
  DemoTradeHistoryItem,
  DemoModeStore,
} from "@/types/demo";

// Sample demo positions data
const initialDemoPositions: DemoPosition[] = [
  {
    id: "demo-1",
    country: {
      id: "1",
      name: "United States",
      flagUrl: "https://flagcdn.com/w40/us.png",
    },
    direction: "long",
    size: 200,
    leverage: 2,
    entryPrice: 7500,
    markPrice: 7650,
    openTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fundingRate: 0.01,
    nextFundingTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
  },
  {
    id: "demo-2",
    country: {
      id: "2",
      name: "China",
      flagUrl: "https://flagcdn.com/w40/cn.png",
    },
    direction: "short",
    size: 100,
    leverage: 3,
    entryPrice: 6300,
    markPrice: 6200,
    openTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fundingRate: -0.005,
    nextFundingTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
];

// Create demo mode store with better structure and logging
export const useDemoModeStore = create<DemoModeStore>()(
  persist(
    (set, get) => ({
      isDemoMode: true, // Default to demo mode for new users
      demoBalance: 5000, // Default demo balance
      demoPositions: initialDemoPositions, // Default demo positions
      demoTradeHistory: [], // Default empty trade history

      // Toggle demo mode
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),

      // Update demo balance with improved logging
      updateDemoBalance: (amount: number) => {
        console.log("Updating demo balance:", {
          currentBalance: get().demoBalance,
          amountToAdd: amount,
          newBalance: get().demoBalance + amount,
        });

        set((state) => ({
          demoBalance: state.demoBalance + amount,
        }));
      },

      // Add new demo position with better structure
      addDemoPosition: (position: DemoPosition) => {
        const originalBalance = get().demoBalance;
        const leveragedAmount = position.size * position.leverage;

        // Log transaction details
        console.log("Adding demo position:", {
          originalBalance,
          position,
          leveragedAmount,
          newBalance: originalBalance - leveragedAmount,
        });

        // Update balance first
        set((state) => ({
          demoBalance: state.demoBalance - leveragedAmount,
        }));

        // Add position to state
        set((state) => ({
          demoPositions: [...state.demoPositions, position],
        }));

        // Create trade history entry
        const openTrade: DemoTradeHistoryItem = {
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

        // Add to trade history
        set((state) => ({
          demoTradeHistory: [...state.demoTradeHistory, openTrade],
        }));

        console.log("Demo position added successfully", {
          finalBalance: get().demoBalance,
        });
      },

      // Close demo position with improved structure
      closeDemoPosition: (id, exitPrice, pnl, fundingFee) => {
        // Find position
        const position = get().demoPositions.find((p) => p.id === id);
        if (!position) {
          console.error(`Position with ID ${id} not found`);
          return;
        }

        // Log closing details
        console.log("Closing demo position:", {
          id,
          position,
          currentBalance: get().demoBalance,
        });

        // Remove from active positions
        set((state) => ({
          demoPositions: state.demoPositions.filter((p) => p.id !== id),
        }));

        // Calculate PnL if not provided
        if (!pnl) {
          const isLong = position.direction === "long";
          const priceDiff = isLong
            ? position.markPrice - position.entryPrice
            : position.entryPrice - position.markPrice;

          const pnlPercent = priceDiff / position.entryPrice;
          pnl = position.size * position.leverage * pnlPercent;
        }

        // Ensure fundingFee is a number
        fundingFee = fundingFee || 0;

        // Calculate total PnL and return amount
        const totalPnl = pnl + fundingFee;
        const leveragedAmount = position.size * position.leverage;
        const returnAmount = leveragedAmount + totalPnl;

        console.log("Position close calculation:", {
          leveragedAmount,
          pnl,
          fundingFee,
          totalPnl,
          returnAmount,
        });

        // Return funds to balance
        set((state) => ({
          demoBalance: state.demoBalance + returnAmount,
        }));

        // Create trade history entry
        const closeTrade: DemoTradeHistoryItem = {
          id: `trade-${Date.now()}-close`,
          positionId: id,
          type: "close",
          date: new Date(),
          country: position.country,
          direction: position.direction,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: exitPrice || position.markPrice,
          pnl,
          fundingFee,
        };

        // Add to trade history
        set((state) => ({
          demoTradeHistory: [...state.demoTradeHistory, closeTrade],
        }));

        console.log("Position closed successfully", {
          newBalance: get().demoBalance,
        });
      },

      // Clear all demo positions
      clearAllDemoPositions: () => set({ demoPositions: [] }),

      // Reset demo mode to defaults
      resetDemoMode: () => {
        console.log("Resetting demo mode to defaults");
        set({
          isDemoMode: true,
          demoBalance: 5000,
          demoPositions: initialDemoPositions,
          demoTradeHistory: [],
        });
      },
    }),
    {
      name: "demo-mode-store",
    }
  )
);

// Simplified hook for using demo mode
export function useDemoMode() {
  const demoModeStore = useDemoModeStore();

  // Calculate total PnL for all demo positions
  const calculateTotalPnL = () => {
    return demoModeStore.demoPositions.reduce((total, position) => {
      const isLong = position.direction === "long";
      const priceDiff = isLong
        ? position.markPrice - position.entryPrice
        : position.entryPrice - position.markPrice;

      const pnlPercent = priceDiff / position.entryPrice;
      const pnl = position.size * position.leverage * pnlPercent;

      return total + pnl;
    }, 0);
  };

  return {
    isDemoMode: demoModeStore.isDemoMode,
    toggleDemoMode: demoModeStore.toggleDemoMode,
    demoPositions: demoModeStore.demoPositions,
    demoBalance: demoModeStore.demoBalance,
    demoTradeHistory: demoModeStore.demoTradeHistory,
    addDemoPosition: demoModeStore.addDemoPosition,
    closeDemoPosition: demoModeStore.closeDemoPosition,
    updateDemoBalance: demoModeStore.updateDemoBalance,
    resetDemoMode: demoModeStore.resetDemoMode,
    totalPnL: calculateTotalPnL(),
  };
}
