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
  const { positions: realPositions, loading: realPositionsLoading } =
    usePositionStore();

  // Track loading state for position closing
  const [isClosingPosition, setIsClosingPosition] = useState<string | null>(
    null
  );
  const [isDemoLoading, setIsDemoLoading] = useState(false);

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
              description:
                "The position may have already been closed or doesn't exist",
              variant: "destructive",
            });
            return {
              success: false,
              error: "Position not found in demo store",
              code: "POSITION_NOT_FOUND",
            };
          }

          try {
            // Pass the currentPrice to the closeDemoPosition function if available
            if (currentPrice) {
              closeDemoPosition(positionId, currentPrice);
            } else {
              closeDemoPosition(positionId);
            }

            toast({
              title: "Position Closed",
              description: "Your position has been successfully closed",
            });
            return { success: true };
          } catch (error) {
            console.error("Error closing demo position:", error);
            toast({
              title: "Error",
              description:
                "Failed to close position. The position may have already been closed.",
              variant: "destructive",
            });
            return {
              success: false,
              error: "Failed to close demo position",
              code: "DEMO_POSITION_ERROR",
            };
          } finally {
            setIsDemoLoading(false);
          }
        } else {
          // For real positions, use the contract
          // Pass the position ID to the contract function
          const result = await closeContractPosition(positionId);

          if (!result.success) {
            // Special handling for demo positions detected by the contract function
            if (result.code === "DEMO_POSITION") {
              // Switch to demo mode handling
              console.log(
                "Contract detected demo position, switching to demo handler"
              );
              setIsDemoLoading(true);
              // Pass the currentPrice to the closeDemoPosition function if available
              if (currentPrice) {
                closeDemoPosition(positionId, currentPrice);
              } else {
                closeDemoPosition(positionId);
              }
              setIsDemoLoading(false);

              toast({
                title: "Position closed",
                description: "Demo position has been closed successfully",
              });

              return { success: true };
            }

            // Handle specific error cases based on error codes
            switch (result.code) {
              case "POSITION_NOT_FOUND":
                toast({
                  title: "Position not found",
                  description:
                    "This position does not exist or has already been closed",
                  variant: "destructive",
                });
                break;

              case "NOT_OWNER":
                toast({
                  title: "Not authorized",
                  description:
                    "You don't have permission to close this position",
                  variant: "destructive",
                });
                break;

              case "LIQUIDATED":
                toast({
                  title: "Position liquidated",
                  description: "This position has been liquidated",
                  variant: "destructive",
                });
                break;

              case "USER_REJECTED":
                toast({
                  title: "Transaction rejected",
                  description: "You rejected the transaction",
                  variant: "default",
                });
                break;

              case "GAS_ESTIMATION_FAILED":
                toast({
                  title: "Transaction issue",
                  description:
                    "Gas estimation failed. The transaction may fail if submitted.",
                  variant: "destructive",
                });
                break;

              case "NETWORK_ERROR":
                toast({
                  title: "Network error",
                  description: "Please check your connection and try again",
                  variant: "destructive",
                });
                break;

              case "APPROVAL_REQUIRED":
                toast({
                  title: "Approval required",
                  description:
                    "You need to approve USDC spending before proceeding",
                  variant: "destructive",
                });
                break;

              default:
                // Generic error
                toast({
                  title: "Failed to close position",
                  description: result.error || "Unknown error occurred",
                  variant: "destructive",
                });
            }
            return result; // Return the error result
          }

          toast({
            title: "Position closed",
            description: "Your position has been closed successfully",
          });

          return result; // Return the success result
        }
      } catch (error: any) {
        // Handle unexpected errors
        console.error("Error closing position:", error);

        toast({
          title: "Error closing position",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });

        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      } finally {
        setIsClosingPosition(null);
      }
    },
    [
      isClosingPosition,
      isLoading,
      positions,
      isDemoMode,
      closeDemoPosition,
      closeContractPosition,
      clearError,
      toast,
      demoTradeHistory,
    ]
  );

  return {
    positions,
    isLoading,
    isClosingPosition,
    addPosition,
    closePosition,
  };
}
