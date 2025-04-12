"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalConfirmTradeProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tradeDetails: {
    country: any;
    direction: "long" | "short";
    amount: number;
    leverage: number;
    entryPrice: number;
    positionSize: number;
    liquidationPrice: string;
  };
  userBalance: number;
  balanceSymbol?: string;
}

export default function ModalConfirmTrade({
  isOpen,
  onClose,
  onConfirm,
  tradeDetails,
  userBalance = 0,
  balanceSymbol = "USDC",
}: ModalConfirmTradeProps) {
  // Calculate remaining balance after the trade
  const remainingBalance = Math.max(
    0,
    userBalance - tradeDetails.amount
  ).toFixed(4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Prediction</DialogTitle>
          <DialogDescription>
            Please review your prediction details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src={tradeDetails.country.flagUrl || "/placeholder.svg"}
              alt={`${tradeDetails.country.name} flag`}
              className="w-6 h-6 rounded-full"
            />
            <h3 className="font-medium">{tradeDetails.country.name}</h3>
            <span
              className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                tradeDetails.direction === "long"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {tradeDetails.direction === "long" ? "Long" : "Short"}
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#333333]">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Margin Amount</span>
              <span>
                ${tradeDetails.amount} {balanceSymbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Leverage</span>
              <span>{tradeDetails.leverage}x</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Position Size</span>
              <span>
                ${tradeDetails.positionSize} {balanceSymbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Entry Price</span>
              <span>${tradeDetails.entryPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Liquidation Price</span>
              <span className="text-red-500">
                ${tradeDetails.liquidationPrice}
              </span>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-500">
            <p>
              By confirming this trade, you acknowledge the risks involved in
              leveraged trading. Your position may be liquidated if the market
              moves against you.
            </p>
          </div>

          <div className="mt-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-md">
            <p className="text-amber-400 font-semibold">🧠 Note:</p>
            <ul className="text-sm text-amber-200 list-disc pl-5 space-y-1">
              <li>
                ${tradeDetails.amount} will be deducted from your balance and
                locked as margin.
              </li>
              <li>
                Your leveraged position size of ${tradeDetails.positionSize}{" "}
                will be used for calculating PnL.
              </li>
              <li>
                Remaining Balance: ${remainingBalance} {balanceSymbol}
              </li>
              <li>
                Your margin will be unlocked and returned to your balance when
                you close the position (plus any profit or minus any loss).
              </li>
            </ul>
            <p className="text-sm text-amber-200 mt-2">
              By confirming this trade, you accept the risks of leveraged
              trading.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
