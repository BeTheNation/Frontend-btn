"use client";

import { useEffect, useState, useMemo } from "react";
import { usePositions } from "./usePositions";
import { Position, PositionWithPnL } from "@/types/position";
import { useWeb3 } from "./useWeb3";
import { useDemoMode } from "./useDemoMode";

/**
 * Custom hook to get positions for a specific country with real-time P&L calculations
 */
export function useCountryPositions(countryId: string, currentPrice: number) {
  const { positions } = usePositions();
  const { isDemoMode } = useDemoMode();
  const { isConnected } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);

  // Filter positions for the specific country
  const countryPositions = useMemo(() => {
    if (!positions || !countryId) return [];

    return positions.filter((position) => position.country.id === countryId);
  }, [positions, countryId]);

  // Calculate P&L and additional data for each position
  const positionsWithPnL: PositionWithPnL[] = useMemo(() => {
    return countryPositions.map((position) => {
      // Calculate unrealized P&L based on position direction and price change
      const priceChange = currentPrice - position.entryPrice;
      let unrealizedPnL = 0;

      if (position.direction === "long") {
        // For long positions, profit when price goes up
        unrealizedPnL =
          (priceChange / position.entryPrice) *
          position.size *
          position.leverage;
      } else {
        // For short positions, profit when price goes down
        unrealizedPnL =
          (-priceChange / position.entryPrice) *
          position.size *
          position.leverage;
      }

      // Calculate liquidation price based on direction and leverage
      let liquidationPrice = 0;
      if (position.direction === "long") {
        // Long positions get liquidated when price drops
        // Liquidation occurs at: entry - (entry / leverage)
        liquidationPrice =
          position.entryPrice - position.entryPrice / position.leverage;
      } else {
        // Short positions get liquidated when price rises
        // Liquidation occurs at: entry + (entry / leverage)
        liquidationPrice =
          position.entryPrice + position.entryPrice / position.leverage;
      }

      // Calculate P&L percentage
      const pnlPercentage = (unrealizedPnL / position.size) * 100;

      return {
        ...position,
        unrealizedPnL,
        liquidationPrice,
        pnlPercentage,
      };
    });
  }, [countryPositions, currentPrice]);

  // Set loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    positions: positionsWithPnL,
    isLoading,
    hasPositions: positionsWithPnL.length > 0,
    totalPnL: positionsWithPnL.reduce((sum, pos) => sum + pos.unrealizedPnL, 0),
    totalPositionsSize: positionsWithPnL.reduce(
      (sum, pos) => sum + pos.size,
      0
    ),
  };
}
