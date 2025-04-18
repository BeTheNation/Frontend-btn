"use client";

import { useFundingRate } from "@/hooks/useFundingRate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/data-display/tooltip";
import { Info } from "lucide-react";

interface FundingFeeTimerProps {
  position: any;
}

export default function FundingFeeTimer({ position }: FundingFeeTimerProps) {
  const {
    countryFundingRate,
    timeToNextFunding,
    calculateFundingFee,
    calculateAccumulatedFee,
  } = useFundingRate(position.country.id);

  // Calculate how many hours the position has been open
  const hoursOpen =
    (new Date().getTime() - new Date(position.openTime).getTime()) /
    (1000 * 60 * 60);

  // Calculate accumulated fee while position is open
  const accumulatedFee = calculateAccumulatedFee(
    position.size,
    position.direction,
    position.leverage,
    new Date(position.openTime)
  );

  // Calculate fee for the next period
  const nextFee = calculateFundingFee(
    position.size,
    position.direction,
    position.leverage
  );

  // Format for display
  const displayRate = `${
    countryFundingRate >= 0 ? "+" : ""
  }${countryFundingRate}%`;
  const rateColor = countryFundingRate >= 0 ? "text-green-500" : "text-red-500";

  // Determine if this position pays or receives funding fee
  const isLong = position.direction === "long";
  const longPayShort = countryFundingRate > 0;
  const isPayingFee = (isLong && longPayShort) || (!isLong && !longPayShort);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            <div className={rateColor}>{displayRate}</div>
            <Info size={12} className="text-gray-400" />
            <div className="text-xs text-gray-400">{timeToNextFunding}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="w-64 p-2">
            <div className="text-sm font-semibold mb-2">
              Funding Information
            </div>

            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Current Rate:</span>
                <span className={rateColor}>{displayRate} / 8h</span>
              </div>

              <div className="flex justify-between">
                <span>Next Payment In:</span>
                <span>{timeToNextFunding}</span>
              </div>

              <div className="flex justify-between">
                <span>Next Fee:</span>
                <span
                  className={nextFee >= 0 ? "text-green-500" : "text-red-500"}
                >
                  {nextFee >= 0 ? "+" : ""}
                  {nextFee.toFixed(4)} USDC
                </span>
              </div>

              <div className="flex justify-between">
                <span>Accumulated:</span>
                <span
                  className={
                    accumulatedFee >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {accumulatedFee >= 0 ? "+" : ""}
                  {accumulatedFee.toFixed(4)} USDC
                </span>
              </div>

              <div className="mt-2 text-gray-400">
                {isPayingFee ? (
                  <span>
                    Your {position.direction} position pays funding to{" "}
                    {isLong ? "short" : "long"} positions.
                  </span>
                ) : (
                  <span>
                    Your {position.direction} position receives funding from{" "}
                    {!isLong ? "short" : "long"} positions.
                  </span>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
