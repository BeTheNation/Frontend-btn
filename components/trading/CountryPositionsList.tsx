"use client";

import { useCountryPositions } from "@/hooks/useCountryPositions";
import { CountryPositionItem } from "./CountryPositionItem";
import { usePositions } from "@/hooks/usePositions";
import { useState } from "react";

interface CountryPositionsListProps {
  countryId: string;
  currentPrice: number;
}

export function CountryPositionsList({
  countryId,
  currentPrice,
}: CountryPositionsListProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { positions, hasPositions, isLoading, totalPnL } = useCountryPositions(
    countryId,
    currentPrice
  );
  const { closePosition } = usePositions();

  // Handle position closing
  const handleClosePosition = async (positionId: string) => {
    await closePosition(positionId, currentPrice);
    // Trigger refresh
    setRefreshTrigger((prev) => prev + 1);
  };

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

  // Format net P&L
  const isPnlPositive = totalPnL >= 0;
  const formattedTotalPnL = `$${Math.abs(totalPnL).toFixed(2)}`;
  const formattedPnlPercentage = `(${(
    (Math.abs(totalPnL) / positions.reduce((sum, pos) => sum + pos.size, 0)) *
    100
  ).toFixed(1)}%)`;

  return (
    <div>
      {/* Abstract Summary (only shown if there are multiple positions) */}
      {positions.length > 1 && (
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

      {/* List of positions */}
      <div className="space-y-4">
        {positions.map((position) => (
          <CountryPositionItem
            key={position.id}
            position={position}
            onClose={() => handleClosePosition(position.id)}
            showCloseButton={true}
          />
        ))}
      </div>
    </div>
  );
}
