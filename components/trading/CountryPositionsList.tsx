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
      <div className="self-stretch flex-1 flex justify-center items-center min-h-[200px]">
        <div className="text-[#676767] text-lg font-medium font-['Inter'] leading-7">No active positions</div>
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
    <div className="self-stretch flex-1 flex flex-col justify-start items-start">
      <div className="self-stretch h-px relative">
        <div className="w-[449px] h-px left-0 top-0 absolute bg-[#323232]" />
      </div>
      {openPositions.map((position) => (
        <div key={position.id}>
          <div className="self-stretch py-4 inline-flex justify-between items-center">
            <div className="w-[71px] flex justify-between items-center">
              <div className="w-4 h-[15px] bg-[#155dee] rounded-[100px]" />
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">{position.country.name}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`justify-start text-sm font-normal font-['Inter'] leading-tight ${position.unrealizedPnL >= 0 ? 'text-[#16b264]' : 'text-[#b21616]'}`}>
                {position.unrealizedPnL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedPnL).toFixed(2)} ({((position.unrealizedPnL / position.size) * 100).toFixed(1)}%)
              </div>
              <div 
                className="w-[116px] h-10 px-[10.75px] py-1 rounded-[67.21px] shadow-[0px_0.6720554232597351px_1.3441108465194702px_0px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#155dee] flex justify-center items-center gap-[2.69px] cursor-pointer"
                onClick={() => handleClosePosition(position.id)}
              >
                <div className="text-center justify-center text-[#155dee] text-base font-semibold font-['Inter'] leading-none">Close</div>
              </div>
            </div>
          </div>
          <div className="self-stretch py-3.5 inline-flex justify-between items-center">
            <div className="w-[101px] flex justify-between items-center">
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Position Size</div>
            </div>
            <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">${position.size.toFixed(2)}</div>
          </div>
          <div className="self-stretch py-3.5 inline-flex justify-between items-center">
            <div className="w-[101px] flex justify-between items-center">
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Entry Price</div>
            </div>
            <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">{position.entryPrice.toFixed(2)}M</div>
          </div>
          <div className="self-stretch py-3.5 inline-flex justify-between items-center">
            <div className="w-[101px] flex justify-between items-center">
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Liquidation Price</div>
            </div>
            <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">{position.liquidationPrice.toFixed(2)}M</div>
          </div>
          <div className="self-stretch py-3.5 inline-flex justify-between items-center">
            <div className="w-[101px] flex justify-between items-center">
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Fees</div>
            </div>
            <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">${(position.size * 0.005).toFixed(2)}</div>
          </div>
        </div>
      ))}
      {openPositions.length > 1 && (
        <>
          <div className="self-stretch h-px relative">
            <div className="w-[449px] h-px left-0 top-0 absolute bg-[#323232]" />
          </div>
          <div className="self-stretch py-4 inline-flex justify-between items-center">
            <div className="w-[101px] flex justify-between items-center">
              <div className="w-4 h-[15px] bg-[#155dee] rounded-[100px]" />
              <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Abstract</div>
            </div>
            <div className={`justify-start text-sm font-normal font-['Inter'] leading-tight ${totalPnL >= 0 ? 'text-[#16b264]' : 'text-[#b21616]'}`}>
              {totalPnL >= 0 ? '+' : '-'}${Math.abs(totalPnL).toFixed(2)} ({((totalPnL / activePositionsTotal) * 100).toFixed(1)}%)
            </div>
          </div>
        </>
      )}
    </div>
  );
}
