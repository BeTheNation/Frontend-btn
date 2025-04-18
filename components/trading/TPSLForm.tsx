"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/inputs/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/feedback/dialog";
import { useContract } from "@/hooks/useContract";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useToast } from "@/components/ui/utils/use-toast";

interface TPSLFormProps {
  position: any;
}

export default function TPSLForm({ position }: TPSLFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSetTPSL } = useContract();
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!takeProfit || !stopLoss || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (
        isDemoMode ||
        (typeof position.id === "string" &&
          (position.id.startsWith("demo-") || position.id.startsWith("pos-")))
      ) {
        // Handle demo mode TP/SL
        console.log("Setting TP/SL for demo position:", position.id);
        toast({
          title: "Demo Mode",
          description: "TP/SL set in demo mode",
        });
      } else {
        // Handle real position
        console.log("Setting TP/SL for real position:", position.id);
        await handleSetTPSL(
          BigInt(position.id),
          Number(takeProfit),
          Number(stopLoss)
        );
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error setting TP/SL:", error);
      toast({
        title: "Error",
        description: "Failed to set TP/SL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPrice = position.markPrice;
  const direction = position.direction;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Set TP/SL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Take Profit & Stop Loss</DialogTitle>
          <DialogDescription>
            Set your take profit and stop loss levels for automatic position
            closure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Take Profit Price</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={takeProfit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTakeProfit(e.target.value)
                }
                placeholder={
                  direction === "long" ? "> Entry Price" : "< Entry Price"
                }
                className="flex-1"
              />
              <span className="text-sm text-gray-400">USD</span>
            </div>
            {takeProfit && (
              <div className="text-xs text-gray-400">
                Profit:{" "}
                {(
                  (Math.abs(Number(takeProfit) - position.entryPrice) /
                    position.entryPrice) *
                  100
                ).toFixed(2)}
                %
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Stop Loss Price</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={stopLoss}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStopLoss(e.target.value)
                }
                placeholder={
                  direction === "long" ? "< Entry Price" : "> Entry Price"
                }
                className="flex-1"
              />
              <span className="text-sm text-gray-400">USD</span>
            </div>
            {stopLoss && (
              <div className="text-xs text-gray-400">
                Loss:{" "}
                {(
                  (Math.abs(Number(stopLoss) - position.entryPrice) /
                    position.entryPrice) *
                  100
                ).toFixed(2)}
                %
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-[#333333]">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Entry Price</span>
              <span>${position.entryPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Price</span>
              <span>${currentPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Position Size</span>
              <span>${position.size * position.leverage}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!takeProfit || !stopLoss || isSubmitting}
          >
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
