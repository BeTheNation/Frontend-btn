"use client";

import { PositionWithPnL } from "@/types/position";
import { formatCurrency } from "@/lib/utils";
import { ClosePositionButton } from "./ClosePositionButton";
import { PositionStatus, ExtendedPosition } from "@/hooks/useCountryPositions";

interface CountryPositionItemProps {
  position: ExtendedPosition;
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
    status,
    closedAt,
  } = position;

  // Format P&L values
  const formattedPnL = formatCurrency(unrealizedPnL);
  const pnlPercentage = ((unrealizedPnL / size) * 100).toFixed(1);
  const isPnlPositive = unrealizedPnL >= 0;

  // Calculate fees (assuming 0.05% fee per position)
  const fee = size * 0.0005;
  const formattedFee = formatCurrency(fee);

  return (
    <div
      className={`${
        status === PositionStatus.CLOSED
          ? "opacity-70 bg-gray-800/30 rounded p-2"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 pb-3">
        <div
          className={`w-2 h-2 rounded-full ${
            direction === "long" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div className="text-white">{country.name}</div>

        {/* Show status badge if not OPEN */}
        {status !== PositionStatus.OPEN && (
          <div
            className={`text-xs px-2 py-1 rounded ${
              status === PositionStatus.CLOSING
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {status === PositionStatus.CLOSING ? "Closing..." : "Closed"}
          </div>
        )}

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

        {status === PositionStatus.CLOSED && closedAt && (
          <div className="flex justify-between text-sm py-1">
            <div className="text-gray-400">Closed At</div>
            <div className="text-white">{closedAt.toLocaleTimeString()}</div>
          </div>
        )}

        {showCloseButton && status === PositionStatus.OPEN && (
          <div className="mt-3">
            <ClosePositionButton positionId={position.id} />
          </div>
        )}
      </div>
    </div>
  );
}
