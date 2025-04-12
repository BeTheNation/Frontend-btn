"use client";

import { useState, useEffect, useCallback } from "react";
import { useDemoMode } from "./useDemoMode";
import { usePositionStore } from "@/store/positionStore";
import { usePredictionMarketContext } from "@/contexts/PredictionMarketContext";
import { PositionDirection } from "@/types/position";

/**
 * Hook for managing funding rate based on long vs short position balance
 *
 * Funding rate is a mechanism that incentivizes market equilibrium between
 * long and short positions by periodically transferring funds between them.
 *
 * Formula: FR = clamp(longRatio - shortRatio, -0.05%, 0.05%) * multiplier
 *
 * If there are more longs than shorts:
 * - Positive funding rate (long pays short)
 * - Incentivizes more shorts to enter or longs to close
 *
 * If there are more shorts than longs:
 * - Negative funding rate (short pays long)
 * - Incentivizes more longs to enter or shorts to close
 */

// Configuration values
const FUNDING_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const MAX_FUNDING_RATE = 0.0005; // 0.05% max
const FUNDING_RATE_MULTIPLIER = 2.5; // Multiplier to scale the funding rate

export function useFundingRate(countryId?: string) {
  // Using the context but just for access to contract/demo state
  const { isDemo } = usePredictionMarketContext();

  // State for funding-related values
  const [fundingRate, setFundingRate] = useState<number>(0);
  const [longValue, setLongValue] = useState<number>(0);
  const [shortValue, setShortValue] = useState<number>(0);
  const [nextFundingTime, setNextFundingTime] = useState<Date>(
    new Date(Date.now() + FUNDING_INTERVAL)
  );
  const [timeUntilFunding, setTimeUntilFunding] = useState<string>("");

  const { isDemoMode, demoPositions } = useDemoMode();
  const positionsStore = usePositionStore((state) => state.positions);

  // Calculate the funding rate based on long vs short imbalance
  const calculateFundingRate = useCallback(() => {
    // Skip calculation if there are no positions
    // or both long and short values are 0
    if (longValue === 0 && shortValue === 0) {
      setFundingRate(0);
      return;
    }

    const totalValue = longValue + shortValue;

    // Calculate the ratio of long and short positions
    const longRatio = longValue / totalValue;
    const shortRatio = shortValue / totalValue;

    // Calculate the funding rate: clamp(longRatio - shortRatio) * multiplier
    // If more longs than shorts, funding rate is positive (long pays short)
    // If more shorts than longs, funding rate is negative (short pays long)
    let rate = (longRatio - shortRatio) * FUNDING_RATE_MULTIPLIER;

    // Clamp the funding rate to the maximum value
    rate = Math.max(Math.min(rate, MAX_FUNDING_RATE), -MAX_FUNDING_RATE);

    setFundingRate(rate);
  }, [longValue, shortValue]);

  // Calculate the funding fee a position must pay/receive
  const calculateFundingFee = useCallback(
    (
      positionSize: number,
      direction: PositionDirection,
      leverage: number
    ): number => {
      // Calculate the full position size with leverage
      const fullPositionSize = positionSize * leverage;

      // Determine if position pays or receives funding
      // Long positions pay when funding rate is positive
      // Short positions pay when funding rate is negative
      let multiplier = 0;
      if (direction === "long") {
        multiplier = fundingRate > 0 ? -1 : 1; // Long pays when positive, receives when negative
      } else {
        multiplier = fundingRate < 0 ? -1 : 1; // Short pays when negative, receives when positive
      }

      return fullPositionSize * Math.abs(fundingRate) * multiplier;
    },
    [fundingRate]
  );

  // Calculate accumulated funding fees for a position since it was opened
  const calculateAccumulatedFees = useCallback(
    (
      positionSize: number,
      direction: PositionDirection,
      leverage: number,
      openTime: Date
    ): number => {
      // Calculate the number of funding intervals since position was opened
      const now = new Date();
      const hoursOpen = (now.getTime() - openTime.getTime()) / (60 * 60 * 1000);
      const intervals = Math.floor(hoursOpen / 8); // 8-hour intervals

      // If less than one interval, no funding has been charged
      if (intervals < 1) return 0;

      // Calculate the fee for one interval and multiply by intervals count
      const feePerInterval = calculateFundingFee(
        positionSize,
        direction,
        leverage
      );
      return feePerInterval * intervals;
    },
    [calculateFundingFee]
  );

  // Calculate total long and short position values
  useEffect(() => {
    let totalLong = 0;
    let totalShort = 0;

    // Sum up the values of all positions
    positionsStore.forEach((position) => {
      // Skip positions for other countries if countryId is specified
      if (
        countryId &&
        (!position.country || position.country.id !== countryId)
      ) {
        return;
      }

      const positionValue = position.size * position.leverage;

      if (position.direction === "long") {
        totalLong += positionValue;
      } else {
        totalShort += positionValue;
      }
    });

    setLongValue(totalLong);
    setShortValue(totalShort);
  }, [positionsStore, countryId]);

  // Update funding rate when long/short values change
  useEffect(() => {
    calculateFundingRate();
  }, [longValue, shortValue, calculateFundingRate]);

  // Update time until next funding event
  useEffect(() => {
    const updateTimeUntilFunding = () => {
      const now = new Date();
      const diff = nextFundingTime.getTime() - now.getTime();

      if (diff <= 0) {
        // If past the funding time, calculate next funding time
        const nextTime = new Date(nextFundingTime.getTime() + FUNDING_INTERVAL);
        setNextFundingTime(nextTime);
        return;
      }

      // Format the countdown timer (hours:minutes)
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilFunding(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );
    };

    // Update immediately and then every minute
    updateTimeUntilFunding();
    const interval = setInterval(updateTimeUntilFunding, 60 * 1000);

    return () => clearInterval(interval);
  }, [nextFundingTime]);

  return {
    fundingRate,
    longValue,
    shortValue,
    nextFundingTime,
    timeUntilFunding,
    calculateFundingFee,
    calculateAccumulatedFees,
    // Alias properties to maintain backward compatibility
    countryFundingRate: fundingRate,
    timeToNextFunding: timeUntilFunding,
    calculateAccumulatedFee: calculateAccumulatedFees,
  };
}
