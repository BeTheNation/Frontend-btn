"use client";

import { usePositions } from "@/hooks/usePositions";
import { useMemo, useState, useEffect } from "react";
import { Position, PositionWithPnL } from "@/types/position";
import { toast } from "@/components/ui/use-toast";

// Position statuses
export enum PositionStatus {
  OPEN = "OPEN",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
}

// Extended position type with status
export interface ExtendedPosition extends PositionWithPnL {
  status: PositionStatus;
  closedAt?: Date;
}

/**
 * Custom hook to get positions for a specific country with PnL calculations
 */
export function useCountryPositions(countryId: string, currentPrice: number) {
  const { positions: allPositions, isLoading } = usePositions();
  // Track closed positions separately so they can remain visible
  const [closedPositions, setClosedPositions] = useState<ExtendedPosition[]>(
    []
  );

  // Track which positions are in the process of closing
  const [closingPositions, setClosingPositions] = useState<string[]>([]);

  // Filter positions by country ID and add P&L calculations
  const positions = useMemo(() => {
    if (!allPositions || allPositions.length === 0) return [];

    try {
      // First, filter positions for this country
      const filteredPositions = allPositions.filter(
        (pos) => pos.country.id === countryId
      );

      // Then add P&L calculations and convert to extended positions
      return filteredPositions.map((position): ExtendedPosition => {
        // Calculate P&L based on direction and price difference
        let unrealizedPnL = 0;
        const leveragedSize = position.size * position.leverage;
        const priceDiff = currentPrice - position.entryPrice;

        if (position.direction === "long") {
          unrealizedPnL = (priceDiff / position.entryPrice) * leveragedSize;
        } else {
          unrealizedPnL = (-priceDiff / position.entryPrice) * leveragedSize;
        }

        // Calculate liquidation price based on direction and leverage
        const liquidationPrice = calculateLiquidationPrice(
          position,
          position.leverage
        );

        // Add status based on whether position is in closing process
        const status = closingPositions.includes(position.id)
          ? PositionStatus.CLOSING
          : PositionStatus.OPEN;

        return {
          ...position,
          unrealizedPnL,
          liquidationPrice,
          status,
        };
      });
    } catch (error) {
      console.error("Error processing positions:", error);
      toast({
        title: "Error loading positions",
        description: "Failed to load position data",
        variant: "destructive",
      });
      return [];
    }
  }, [allPositions, countryId, currentPrice, closingPositions]);

  // Calculate total P&L for active positions
  const totalPnL = useMemo(() => {
    if (!positions || positions.length === 0) return 0;
    return positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  }, [positions]);

  // Combine active and closed positions for display
  const allDisplayPositions = useMemo(() => {
    return [
      ...positions,
      ...closedPositions.filter((p) => p.country.id === countryId),
    ];
  }, [positions, closedPositions, countryId]);

  // Function to mark a position as closing
  const markPositionClosing = (positionId: string) => {
    // Check if the position is already marked as closing
    if (closingPositions.includes(positionId)) {
      // If called again for the same position, toggle it off (cancel closing state)
      setClosingPositions((prev) => prev.filter((id) => id !== positionId));
      return;
    }

    // Check if the position exists at all
    const positionExists =
      positions.some((p) => p.id === positionId) ||
      closedPositions.some((p) => p.id === positionId);

    if (!positionExists) {
      console.warn(
        `Tried to mark non-existent position ${positionId} as closing`
      );
      return;
    }

    // Add to closing positions
    setClosingPositions((prev) => [...prev, positionId]);
  };

  // Function to mark a position as closed
  const markPositionClosed = (positionId: string) => {
    // Find the position in our active positions
    const position = positions.find((p) => p.id === positionId);

    // Check if position already exists in closed positions
    const alreadyClosed = closedPositions.some((p) => p.id === positionId);

    if (alreadyClosed) {
      console.log(`Position ${positionId} already marked as closed`);
      // Remove from closing positions if it was there
      setClosingPositions((prev) => prev.filter((id) => id !== positionId));
      return;
    }

    if (!position) {
      console.warn(
        `Tried to mark non-existent position ${positionId} as closed`
      );
      // Remove from closing positions if it was there
      setClosingPositions((prev) => prev.filter((id) => id !== positionId));
      return;
    }

    // Create a closed position entry
    const closedPosition: ExtendedPosition = {
      ...position,
      status: PositionStatus.CLOSED,
      closedAt: new Date(),
    };

    // Add to closed positions
    setClosedPositions((prev) => [...prev, closedPosition]);

    // Remove from closing positions
    setClosingPositions((prev) => prev.filter((id) => id !== positionId));
  };

  // Clean up old closed positions after a certain time
  useEffect(() => {
    const CLOSED_POSITION_DISPLAY_TIME = 60 * 1000; // 60 seconds

    const interval = setInterval(() => {
      const now = new Date();
      setClosedPositions((prev) =>
        prev.filter((pos) => {
          if (!pos.closedAt) return true;
          const timeDiff = now.getTime() - pos.closedAt.getTime();
          return timeDiff < CLOSED_POSITION_DISPLAY_TIME;
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    positions: allDisplayPositions,
    hasPositions: allDisplayPositions.length > 0,
    activePositions: positions,
    closedPositions: closedPositions.filter((p) => p.country.id === countryId),
    isLoading,
    totalPnL,
    markPositionClosing,
    markPositionClosed,
  };
}

// Helper function to calculate liquidation price
function calculateLiquidationPrice(
  position: Position,
  leverage: number
): number {
  // Simplified liquidation calculation
  // In a real app, this would be more complex with funding rates, etc.
  const maintenanceMargin = 0.05; // 5% maintenance margin
  const liquidationThreshold = 1 / leverage - maintenanceMargin;

  if (position.direction === "long") {
    return position.entryPrice * (1 - liquidationThreshold);
  } else {
    return position.entryPrice * (1 + liquidationThreshold);
  }
}
