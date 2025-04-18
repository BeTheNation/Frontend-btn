"use client";

import { PositionWithPnL } from "@/types/position";
import { formatCurrency } from "@/lib/utils";
import { ClosePositionButton } from "./ClosePositionButton";

interface CountryPositionItemProps {
  position: PositionWithPnL;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function CountryPositionItem({
  position,
  onClose,
  showCloseButton = false,
}: CountryPositionItemProps) {
  const {
    id,
    country,
    direction,
    size,
    leverage,
    entryPrice,
    markPrice,
    unrealizedPnL,
    liquidationPrice,
  } = position;

  // Format P&L values
  const formattedPnL = formatCurrency(unrealizedPnL);
  const pnlPercentage = ((unrealizedPnL / size) * 100).toFixed(1);
  const isPnlPositive = unrealizedPnL >= 0;

  // Calculate fees (assuming 0.05% fee per position)
  const fee = size * 0.0005;
  const formattedFee = formatCurrency(fee);

  return (
    <div>
      <div className="flex items-center gap-2 pb-3">
        <div
          className={`w-2 h-2 rounded-full ${
            direction === "long" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div className="text-white">{country.name}</div>
        <div
          className={`ml-auto ${
            isPnlPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {formattedPnL} ({pnlPercentage}%)
        </div>
      </div>

      <div className="border-t border-[#222222] py-3">
        <div className="flex justify-between text-sm py-1">
          <div className="text-gray-400">Position Size</div>
          <div className="text-white">{formatCurrency(size)}</div>
        </div>

        <div className="flex justify-between text-sm py-1">
          <div className="text-gray-400">Entry Price</div>
          <div className="text-white">{entryPrice.toFixed(2)}</div>
        </div>

        <div className="flex justify-between text-sm py-1">
          <div className="text-gray-400">Liquidation Price</div>
          <div className="text-white">{liquidationPrice.toFixed(2)}</div>
        </div>

        <div className="flex justify-between text-sm py-1">
          <div className="text-gray-400">Fees</div>
          <div className="text-white">{formattedFee}</div>
        </div>

        {showCloseButton && (
          <div className="mt-3">
            <ClosePositionButton position={position} onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}
