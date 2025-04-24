"use client";

import { useState, useMemo, useCallback } from "react";
import { Position } from "@/types/position";
import { useContract } from "@/hooks/useContract";
import { generateId } from "@/lib/utils";
import { useDemoModeContext } from "@/contexts/DemoModeContext";
import { useToast } from "@/components/ui/use-toast";
import { usePositionStore } from "@/store/positionStore";

/**
 * Hook for working with positions across both demo and real modes
 */
export function usePositions() {
  const { toast } = useToast();
  const { closePosition: closeContractPosition, clearError } = useContract();
  const { isDemoMode, demoPositions, closeDemoPosition, demoTradeHistory } =
    useDemoModeContext();

  // Get real positions from the store
  const {
    positions: realPositions,
    loading: realPositionsLoading,
    fetchPositions,
  } = usePositionStore();

  // Track loading state for position closing
  const [isClosingPosition, setIsClosingPosition] = useState<string | null>(
    null
  );
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Function to refresh positions with better timeout and error handling
  const refreshPositions = useCallback(() => {
    if (!isDemoMode) {
      // Log timestamp for debugging
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Refreshing real positions from blockchain`);

      // Trigger fetch from contract
      fetchPositions();

      // Return a promise with improved timeout and error handling
      return new Promise<void>((resolve, reject) => {
        let resolved = false;

        // Set a longer timeout (5 seconds) to ensure data is updated
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.log(
              `[${new Date().toISOString()}] Position refresh complete`
            );
            resolve();
          }
        }, 5000);

        // Add a longer timeout as a failsafe
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.warn(
              `[${new Date().toISOString()}] Position refresh timeout - resolving anyway`
            );
            resolve(); // Resolve anyway to prevent hanging promises
          }
        }, 15000);
      });
    } else {
      console.log("Demo mode - positions are already in memory and reactive");
      // For demo mode, positions are already in memory and reactive
      return Promise.resolve();
    }
  }, [isDemoMode, fetchPositions]);

  // Determine active positions based on current mode
  const positions = useMemo(() => {
    return isDemoMode ? demoPositions : realPositions;
  }, [isDemoMode, demoPositions, realPositions]);

  // Loading state depends on the active mode
  const isLoading = useMemo(() => {
    return isDemoMode ? isDemoLoading : realPositionsLoading;
  }, [isDemoMode, isDemoLoading, realPositionsLoading]);

  // Add a new position - for testing/demo only
  const addPosition = useCallback(
    (position: Omit<Position, "id">) => {
      // This is a testing/demo helper - not for production
      if (!isDemoMode) {
        console.warn(
          "Adding positions directly is only supported in demo mode"
        );
        return null;
      }

      // Create position with ID
      const newPosition: Position = {
        ...position,
        id: generateId(),
      };

      return newPosition;
    },
    [isDemoMode]
  );

  // Close position function with enhanced error handling
  const closePosition = useCallback(
    async (positionId: string, currentPrice?: number) => {
      // Check if already processing a different position
      if (isClosingPosition && isClosingPosition !== positionId) {
        toast({
          title: "Already closing position",
          description: "Please wait for the current operation to complete",
          variant: "destructive",
        });
        return { success: false, error: "Already processing a position close" };
      }

      // Validate the position ID
      if (!positionId || typeof positionId !== "string") {
        toast({
          title: "Invalid position",
          description: "Position ID is required",
          variant: "destructive",
        });
        return { success: false, error: "Invalid position ID" };
      }

      // Check for loading state
      if (isLoading) {
        toast({
          title: "Loading positions",
          description: "Please wait until positions are loaded",
          variant: "destructive",
        });
        return { success: false, error: "Positions are still loading" };
      }

      // Find the position in the active list
      const position = positions.find((p) => p.id === positionId);

      // Position not found error
      if (!position) {
        toast({
          title: "Position not found",
          description: `Cannot find position with ID ${positionId}`,
          variant: "destructive",
        });
        return {
          success: false,
          error: `Position ${positionId} not found`,
          code: "POSITION_NOT_FOUND",
        };
      }

      try {
        setIsClosingPosition(positionId);
        clearError(); // Clear any previous errors

        // Check if this is a demo position (ID starts with "demo-" or we're in demo mode)
        if (isDemoMode || positionId.startsWith("demo-")) {
          // For demo positions, use the demo context
          setIsDemoLoading(true);

          // Check if the position exists in demo positions before trying to close it
          const demoPositionExists = demoPositions.some(
            (p) => p.id === positionId
          );

          // Check if the position was already closed in the trade history
          const alreadyClosed =
            demoPositionExists === false && // Position doesn't exist in active positions
            demoTradeHistory &&
            demoTradeHistory.some(
              (trade) =>
                trade.positionId === positionId && trade.type === "close"
            );

          if (!demoPositionExists && alreadyClosed) {
            console.log(
              `Position ${positionId} was already closed in a previous session`
            );
            setIsDemoLoading(false);
            toast({
              title: "Position already closed",
              description: "This position has already been closed",
            });
            return { success: true, alreadyClosed: true };
          }

          if (!demoPositionExists) {
            console.warn(
              `Demo position ${positionId} not found in active positions`
            );
            setIsDemoLoading(false);
            toast({
              title: "Position not found",
              description: `Cannot find position with ID ${positionId}`,
              variant: "destructive",
            });
            return {
              success: false,
              error: `Position ${positionId} not found`,
              code: "POSITION_NOT_FOUND",
            };
          }

          // Close the demo position
          closeDemoPosition(positionId);
          setIsDemoLoading(false);
          toast({
            title: "Position closed",
            description: `Position ${positionId} has been closed`,
          });
          return { success: true };
        }

        // Close the real position
        await closeContractPosition(positionId, currentPrice);
        setIsClosingPosition(null);
        toast({
          title: "Position closed",
          description: `Position ${positionId} has been closed`,
        });
        return { success: true };
      } catch (error) {
        console.error("Error closing position:", error);
        setIsClosingPosition(null);
        setIsDemoLoading(false);
        toast({
          title: "Error closing position",
          description: "An error occurred while closing the position",
          variant: "destructive",
        });
        return { success: false, error: "Error closing position" };
      }
    },
    [
      isClosingPosition,
      isLoading,
      positions,
      closeContractPosition,
      clearError,
      isDemoMode,
      demoPositions,
      closeDemoPosition,
      demoTradeHistory,
      toast,
    ]
  );

  return {
    positions,
    isLoading,
    refreshPositions,
    addPosition,
    closePosition,
  };
}
