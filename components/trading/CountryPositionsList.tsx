"use client";

import {
  useCountryPositions,
  PositionStatus,
} from "@/hooks/useCountryPositions";
import { CountryPositionItem } from "./CountryPositionItem";
import { usePositions } from "@/hooks/usePositions";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface CountryPositionsListProps {
  countryId: string;
  currentPrice: number;
}

export function CountryPositionsList({
  countryId,
  currentPrice,
}: CountryPositionsListProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    positions,
    hasPositions,
    isLoading: countryPositionsLoading,
    totalPnL,
    markPositionClosing,
    markPositionClosed,
  } = useCountryPositions(countryId, currentPrice);
  const { closePosition, isLoading: positionsLoading } = usePositions();

  // Refresh the positions list whenever the refreshTrigger changes
  useEffect(() => {
    // This effect will run whenever refreshTrigger changes
    // The useCountryPositions hook should use this to re-fetch positions
  }, [refreshTrigger]);

  // Handle position closing with improved error handling
  const handleClosePosition = async (positionId: string) => {
    // Check if positions are still loading
    if (positionsLoading) {
      console.log("Cannot close position - positions are still loading");
      toast({
        title: "Positions Still Loading",
        description: "Please wait a moment and try again",
        variant: "default",
      });
      return;
    }

    // First, mark the position as "CLOSING" for visual feedback
    markPositionClosing(positionId);

    try {
      // Use the improved closePosition function from usePositions
      // Pass the current price to calculate final PnL
      const result = await closePosition(positionId, currentPrice);

      if (result && result.success) {
        // Mark the position as closed but keep it in the UI
        markPositionClosed(positionId);

        // Trigger refresh to update other data
        setRefreshTrigger((prev) => prev + 1);
      } else if (result) {
        // Handle position already closed specially
        if (result.code === "POSITION_NOT_FOUND") {
          // Still mark it as closed in our UI for consistent UX
          markPositionClosed(positionId);

          // Trigger refresh to update other data
          setRefreshTrigger((prev) => prev + 1);
        } else {
          // For other errors, keep the UI consistent
          // Remove the "closing" visual since the operation failed
          // but don't mark it as closed since it didn't actually close
          markPositionClosing(positionId); // Toggle off closing state by calling it again
        }
      } else {
        // No result returned, something went wrong
        markPositionClosing(positionId); // Toggle off closing state

        toast({
          title: "Failed to close position",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      // This should only catch truly unexpected errors
      console.error("Unexpected error closing position:", error);
      toast({
        title: "Failed to close position",
        description:
          (error as Error)?.message || "Position could not be closed",
        variant: "destructive",
      });

      // Remove from closing state since the operation failed
      markPositionClosing(positionId); // Toggle off closing state by calling it again
    }
  };

  // Check if overall loading is happening
  const isLoading = countryPositionsLoading || positionsLoading;

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin h-6 w-6 border-2 border-gray-500 border-t-white rounded-full"></div>
        <p className="mt-2 text-gray-400 text-sm">Loading positions...</p>
      </div>
    );
  }

  if (!hasPositions) {
    return (
      <div className="h-full flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">No active positions</p>
      </div>
    );
  }

  // Group positions by status
  const openPositions = positions.filter(
    (p) => p.status === PositionStatus.OPEN
  );
  const closingPositions = positions.filter(
    (p) => p.status === PositionStatus.CLOSING
  );
  const closedPositions = positions.filter(
    (p) => p.status === PositionStatus.CLOSED
  );

  // Format net P&L
  const isPnlPositive = totalPnL >= 0;
  const formattedTotalPnL = `$${Math.abs(totalPnL).toFixed(2)}`;
  const activePositionsTotal = openPositions.reduce(
    (sum, pos) => sum + pos.size,
    0
  );
  const formattedPnlPercentage =
    activePositionsTotal > 0
      ? `(${((Math.abs(totalPnL) / activePositionsTotal) * 100).toFixed(1)}%)`
      : "";

  return (
    <div>
      {/* Abstract Summary (only shown if there are multiple positions) */}
      {openPositions.length > 1 && (
        <div className="border-t border-[#222222] pt-3 flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="text-gray-400">Abstract</div>
          <div
            className={`ml-auto ${
              isPnlPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPnlPositive ? "+" : "-"}
            {formattedTotalPnL} {formattedPnlPercentage}
          </div>
        </div>
      )}

      {/* List of open positions */}
      {openPositions.length > 0 && (
        <div className="space-y-4 mb-4">
          {openPositions.map((position) => (
            <CountryPositionItem
              key={position.id}
              position={position}
              onClose={() => handleClosePosition(position.id)}
              showCloseButton={!positionsLoading}
            />
          ))}
        </div>
      )}

      {/* List of closing positions */}
      {closingPositions.length > 0 && (
        <div className="space-y-4 mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Positions Being Closed
          </h3>
          {closingPositions.map((position) => (
            <CountryPositionItem
              key={position.id}
              position={position}
              showCloseButton={false}
            />
          ))}
        </div>
      )}

      {/* List of closed positions */}
      {closedPositions.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Recently Closed
          </h3>
          {closedPositions.map((position) => (
            <CountryPositionItem
              key={position.id}
              position={position}
              showCloseButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
