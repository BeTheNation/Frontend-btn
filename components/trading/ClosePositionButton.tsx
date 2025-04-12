"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContract } from "@/hooks/useContract";
import { useDemoMode } from "@/hooks/useDemoMode";
import { toast } from "@/components/ui/use-toast";

interface ClosePositionButtonProps {
  position: any;
  onClose: () => void;
}

export default function ClosePositionButton({
  position,
  onClose,
}: ClosePositionButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { handleClosePosition } = useContract();
  const { isDemoMode } = useDemoMode();

  const handleConfirmClose = async () => {
    console.log("Closing position:", {
      id: position?.id,
      countryName: position?.country?.name,
      direction: position?.direction,
    });

    setIsClosing(true);

    try {
      if (!position || !position.id) {
        throw new Error("Invalid position data");
      }

      // Handle position closure through onClose callback from ActivePositions
      const result = await onClose();

      // Check if we got an error object back
      if (result && result.error) {
        console.log("Received error result in ClosePositionButton:", result);
        // Error has already been handled by the contract service with toasts
        setIsConfirmOpen(false);
        return;
      }

      // Check if position was already closed
      if (result && result.alreadyClosed) {
        console.log("Position was already closed:", result);
        // This has already been handled properly
        setIsConfirmOpen(false);
        return;
      }

      setIsConfirmOpen(false);
      // No need for success toast as it's already shown by contract service
    } catch (error) {
      console.error("Unexpected error in ClosePositionButton:", error);
      // This should never happen with our new error handling approach
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsConfirmOpen(true)}
      >
        Close
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Position</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this position?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <img
                src={position.country.flagUrl || "/placeholder.svg"}
                alt={`${position.country.name} flag`}
                className="w-6 h-6 rounded-full"
              />
              <h3 className="font-medium">{position.country.name} GDP</h3>
              <span
                className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                  position.direction === "long"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {position.direction === "long" ? "Long" : "Short"}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#333333]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Position Size</span>
                <span>${position.size * position.leverage} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Price</span>
                <span>${position.entryPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Price</span>
                <span>${position.markPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated PnL</span>
                <span className="text-green-500">+$24.50 (2.45%)</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isClosing}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmClose} disabled={isClosing}>
                {isClosing ? "Closing..." : "Close Position"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
