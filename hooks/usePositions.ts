"use client";

import { usePositionStore } from "@/store/positionStore";
import { useDemoModeContext } from "@/contexts/DemoModeContext";
import { useCallback, useMemo } from "react";

/**
 * Enhanced hook for accessing position data
 * Works with both demo and real positions based on current mode
 */
export function usePositions() {
  const {
    positions: realPositions,
    closePosition: closeRealPosition,
    addPosition: addRealPosition,
    addTradeToHistory,
  } = usePositionStore();

  const { isDemoMode, demoPositions, addDemoPosition, closeDemoPosition } =
    useDemoModeContext();

  // Get the active positions based on the current mode
  const positions = useMemo(() => {
    return isDemoMode ? demoPositions : realPositions;
  }, [isDemoMode, demoPositions, realPositions]);

  // Add a new position (either demo or real)
  const addPosition = useCallback(
    (position: any) => {
      if (isDemoMode) {
        addDemoPosition(position);
      } else {
        addRealPosition(position);
      }
    },
    [isDemoMode, addDemoPosition, addRealPosition]
  );

  // Close a position (either demo or real)
  const closePosition = useCallback(
    (id: string, exitPrice?: number, pnl?: number, fundingFee?: number) => {
      console.log("Closing position:", { id, isDemoMode });

      try {
        // Determine if this is a demo position by ID prefix
        const isDemo = typeof id === "string" && id.startsWith("demo-");
        // All other IDs (pos-, tx-, etc.) are considered transaction positions

        // Check if we're closing a demo position
        if (isDemoMode || isDemo) {
          console.log("Closing as demo position");

          // Verify position exists before attempting to close it
          const demoPosition = demoPositions.find((p) => p.id === id);
          if (!demoPosition) {
            console.error(
              `Demo position with ID ${id} not found in:`,
              demoPositions.map((p) => p.id)
            );
            throw new Error(`Position with ID ${id} not found`);
          }

          // Close the demo position
          closeDemoPosition(id, exitPrice, pnl, fundingFee);
        } else {
          console.log("Closing as real position");

          // Verify position exists before attempting to close it
          const realPosition = realPositions.find((p) => p.id === id);
          if (!realPosition) {
            console.error(
              `Real position with ID ${id} not found in:`,
              realPositions.map((p) => p.id)
            );
            throw new Error(`Position with ID ${id} not found`);
          }

          // Close the real position
          closeRealPosition(id, exitPrice, pnl, fundingFee);
        }
      } catch (error) {
        console.error("Error in closePosition:", error);
        throw error; // Re-throw to let caller handle
      }
    },
    [
      isDemoMode,
      demoPositions,
      realPositions,
      closeDemoPosition,
      closeRealPosition,
    ]
  );

  return {
    positions,
    isLoading: false,
    addPosition,
    closePosition,
    addTradeToHistory,
  };
}
