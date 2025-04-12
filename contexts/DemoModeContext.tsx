"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useDemoMode } from "@/hooks/useDemoMode";
import type { DemoPosition } from "@/types/demo";

// Create context with the shape of what the useDemoMode hook returns
interface DemoModeContextType {
  isDemoMode: boolean;
  demoBalance: number;
  demoPositions: DemoPosition[];
  demoTradeHistory: any[];
  totalPnL: number;
  toggleDemoMode: () => void;
  addDemoPosition: (position: DemoPosition) => void;
  closeDemoPosition: (
    id: string,
    exitPrice?: number,
    pnl?: number,
    fundingFee?: number
  ) => void;
  updateDemoBalance: (amount: number) => void;
  resetDemoMode: () => void;
}

// Create context with default values
const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined
);

// Provider component
export function DemoModeProvider({ children }: { children: ReactNode }) {
  // Use the hook to get the demo mode state and functions
  const demoMode = useDemoMode();

  return (
    <DemoModeContext.Provider value={demoMode}>
      {children}
    </DemoModeContext.Provider>
  );
}

// Custom hook to use the demo mode context
export function useDemoModeContext() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error(
      "useDemoModeContext must be used within a DemoModeProvider"
    );
  }
  return context;
}
