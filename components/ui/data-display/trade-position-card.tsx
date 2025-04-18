import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/inputs/button";
import Image from "next/image";

export interface TradePositionProps {
  id: string;
  countryName: string;
  countryFlag: string;
  positionType: "long" | "short";
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: string;
  onClose?: (id: string) => void;
  className?: string;
}

export function TradePositionCard({
  id,
  countryName,
  countryFlag,
  positionType,
  leverage,
  entryPrice,
  currentPrice,
  pnl,
  pnlPercentage,
  timestamp,
  onClose,
  className,
}: TradePositionProps) {
  const isProfitable = pnl >= 0;
  const formattedPnl = Math.abs(pnl).toFixed(4);
  const direction = positionType === "long" ? "Long" : "Short";

  return (
    <Card
      className={cn(
        "border-[#222] bg-gradient-to-b from-[#111] to-[#0A0A0A] overflow-hidden",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src={countryFlag || "/placeholder.svg"}
                alt={countryName}
                fill
                className="object-cover rounded-full border border-gray-700"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm text-white">{countryName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge
                  className={cn(
                    "text-xs px-1.5 py-0",
                    positionType === "long"
                      ? "bg-green-900/30 text-green-400 border-green-800/40"
                      : "bg-red-900/30 text-red-400 border-red-800/40"
                  )}
                >
                  {direction}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-900/20 text-blue-400 border-blue-800/40 px-1.5 py-0"
                >
                  {leverage}x
                </Badge>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "text-right",
              isProfitable ? "text-green-400" : "text-red-400"
            )}
          >
            <div className="font-semibold">
              {isProfitable ? "+" : "-"}${formattedPnl}
            </div>
            <div className="text-xs opacity-80">
              {isProfitable ? "+" : "-"}
              {Math.abs(pnlPercentage).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="bg-[#161616] rounded p-2">
            <div className="text-gray-400 mb-1">Entry Price</div>
            <div className="font-medium">${entryPrice.toFixed(4)}</div>
          </div>
          <div className="bg-[#161616] rounded p-2">
            <div className="text-gray-400 mb-1">Current Price</div>
            <div className="font-medium">${currentPrice.toFixed(4)}</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 flex justify-between">
          <span>Opened {timestamp}</span>
          <span>ID: {id.substring(0, 8)}</span>
        </div>
      </CardContent>

      {onClose && (
        <CardFooter className="px-4 py-3 border-t border-[#222] bg-[#0D0D0D]">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-[#1A1A1A] hover:bg-[#222] border-[#333] text-white"
            onClick={() => onClose(id)}
          >
            Close Position
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
