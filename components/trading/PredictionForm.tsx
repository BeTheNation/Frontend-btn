"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LeverageSelector from "./LeverageSelector";
import ModalConfirmTrade from "./ModalConfirmTrade";
import { usePositionStore } from "@/store/positionStore";
import { useContract } from "@/hooks/useContract";
import { formatEther } from "viem";
import { useToast } from "@/components/ui/use-toast";
import type { Country } from "@/hooks/useCountries";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useFundingRate } from "@/hooks/useFundingRate";
import { useAccount, useNetwork, useBalance } from "wagmi";

interface PredictionFormProps {
  country: Country;
}

export default function PredictionForm({ country }: PredictionFormProps) {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [amount, setAmount] = useState<string>("");
  const [leverage, setLeverage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { handleOpenPosition } = useContract();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({
    address,
  });

  const {
    isDemoMode,
    toggleDemoMode,
    demoBalance,
    addDemoPosition,
    resetDemoMode,
    updateDemoBalance,
  } = useDemoMode();

  const addPosition = usePositionStore((state) => state.addPosition);
  const { fundingRate } = useFundingRate(country.id);

  // Fix the demo mode toggle to allow enabling/disabling properly
  const handleToggleDemoMode = () => {
    toggleDemoMode();
    toast({
      title: isDemoMode ? "Demo Mode Deactivated" : "Demo Mode Activated",
      description: isDemoMode
        ? "Now using real blockchain transactions on Sepolia. Make sure you have Sepolia ETH."
        : "Demo mode activated. All transactions will be simulated without real blockchain interactions.",
      variant: "default",
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal points with basic validation
    const value = e.target.value;

    // Validate input: only allow numbers and one decimal point
    if (/^(\d*\.?\d{0,18})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxAmount = () => {
    if (balance) {
      setAmount(formatEther(balance.value));
    }
  };

  const handleSubmit = async () => {
    if (!isDemoMode && !isConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet or enable Demo Mode",
        variant: "destructive",
      });
      return;
    }

    if (!isDemoMode && !chain) {
      toast({
        title: "Error",
        description: "No network selected",
        variant: "destructive",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setShowConfirmModal(true);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTrade = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let txHash = "";

      // Validate amount
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      // Ensure leverage is a valid integer
      if (!Number.isInteger(leverage) || leverage < 1 || leverage > 5) {
        throw new Error(
          `Leverage must be an integer between 1 and 5, got ${leverage}`
        );
      }

      // Validate if enough balance in demo mode
      if (isDemoMode && Number(amount) * leverage > demoBalance) {
        throw new Error(
          `Insufficient demo balance. Available: ${demoBalance.toFixed(
            2
          )} DEMO, Required: ${(Number(amount) * leverage).toFixed(2)} DEMO`
        );
      }

      // Calculate the position size (margin * leverage)
      const positionSize = Number(amount) * leverage;

      if (!isDemoMode) {
        // Ensure country.id is passed as a string
        const countryIdString = String(country.id);

        // Ensure leverage is an integer
        const leverageInt = Math.round(leverage);

        console.log("Opening position with parameters:", {
          countryId: countryIdString,
          direction,
          leverage: leverageInt,
          amount,
          chainId: chain?.id,
          chainName: chain?.name,
        });

        try {
          const tx = await handleOpenPosition(
            countryIdString,
            direction,
            leverageInt, // Use integer value
            amount
          );

          // Check if we got a transaction or an error object
          if (tx && tx.error) {
            console.error("Transaction failed:", tx);
            throw new Error(tx.message || "Transaction failed");
          }

          if (tx && tx.hash) {
            txHash = tx.hash;
            console.log("Transaction sent successfully:", txHash);

            // Even in testnet mode, we should update the UI immediately
            // This will be synced with the actual blockchain state later,
            // but it provides immediate feedback to the user
            // For testnet mode, temporarily modify UI display only
            if (!isDemoMode && balance) {
              // Calculate the new balance after deducting margin
              const currentBalance = parseFloat(balance.formatted);
              const marginAmount = parseFloat(amount);
              const newUIBalance = Math.max(0, currentBalance - marginAmount);

              // Store this in sessionStorage for temporary UI update
              sessionStorage.setItem("pendingBalanceUpdate", `${newUIBalance}`);

              // Also store the margin amount for potential refunds if transaction fails
              sessionStorage.setItem("lastMarginAmount", `${marginAmount}`);

              console.log("Opening position - Updated UI balance:", {
                originalBalance: currentBalance,
                marginDeducted: marginAmount,
                newBalance: newUIBalance,
              });
            }
          } else {
            console.error("No transaction hash returned:", tx);
            throw new Error("No transaction hash returned");
          }
        } catch (txError) {
          console.error("Transaction error:", txError);
          throw txError;
        }
      }

      // Create position object with unique ID based on timestamp
      const timestamp = Date.now();
      const newPosition = {
        id: isDemoMode ? `demo-${timestamp}` : `tx-${timestamp}`,
        country: country,
        direction: direction,
        size: Number.parseFloat(amount),
        leverage: leverage,
        entryPrice: country.markPrice,
        markPrice: country.markPrice,
        openTime: new Date(),
        fundingRate: fundingRate,
        nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        txHash: txHash,
      };

      // Add position to store
      if (isDemoMode) {
        addDemoPosition(newPosition);
      } else {
        addPosition(newPosition);
      }

      setShowConfirmModal(false);
      setAmount("");
      setLeverage(1);

      toast({
        title: isDemoMode ? "Demo Trade Opened" : "Position Opened",
        description: `Your position has been opened successfully.${
          isDemoMode
            ? ` Demo balance: ${(
                demoBalance -
                Number(amount) * leverage
              ).toFixed(2)} DEMO`
            : " Transaction has been sent to the blockchain."
        }`,
      });

      // Navigate to positions page but with a small delay to ensure stores are updated
      setTimeout(() => {
        window.location.href = "/dashboard?tab=positions";
      }, 1000);
    } catch (error: any) {
      console.error("Trade error:", error);
      setShowConfirmModal(false);
      toast({
        title: "Error",
        description: error.message || "Failed to open position",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>New Position</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleDemoMode}
                className={
                  isDemoMode ? "bg-blue-600" : "bg-green-600 text-white"
                }
              >
                {isDemoMode ? "Demo Mode" : "Testnet Mode"}
              </Button>
              {isDemoMode && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    resetDemoMode();
                    toast({
                      title: "Demo Mode Reset",
                      description:
                        "Demo balance and positions have been reset to defaults (5000 DEMO).",
                      variant: "default",
                    });
                    // Force reload the page to clear any stale state
                    window.location.href = "/dashboard?tab=positions";
                  }}
                >
                  Reset Demo Balance
                </Button>
              )}
              <div className="text-sm font-normal text-gray-400">
                Balance:{" "}
                {isDemoMode
                  ? `${demoBalance.toFixed(2)} DEMO`
                  : balance
                  ? `${Number(formatEther(balance.value)).toFixed(4)} ${
                      balance.symbol
                    }`
                  : "0.00"}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={direction === "long" ? "default" : "outline"}
              className={`h-16 ${
                direction === "long" ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              onClick={() => setDirection("long")}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">Long</span>
                <span className="text-xs text-gray-400">Buy</span>
              </div>
            </Button>
            <Button
              type="button"
              variant={direction === "short" ? "default" : "outline"}
              className={`h-16 ${
                direction === "short" ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              onClick={() => setDirection("short")}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">Short</span>
                <span className="text-xs text-gray-400">Sell</span>
              </div>
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Amount</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleMaxAmount}>
                Max
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-normal text-gray-400">
              Leverage
            </label>
            <LeverageSelector value={leverage} onChange={setLeverage} />
          </div>

          <div className="space-y-1 mt-2">
            <label className="text-sm font-normal text-gray-400 flex items-center justify-between">
              <span>Funding Rate</span>
              <span
                className={fundingRate >= 0 ? "text-green-500" : "text-red-500"}
              >
                {fundingRate >= 0 ? "+" : ""}
                {fundingRate}% / 8h
              </span>
            </label>
            <div className="text-xs text-gray-500">
              {fundingRate !== 0 ? (
                <span>
                  {direction === "long" &&
                    fundingRate > 0 &&
                    "You will pay funding"}
                  {direction === "short" &&
                    fundingRate < 0 &&
                    "You will pay funding"}
                  {direction === "long" &&
                    fundingRate < 0 &&
                    "You will receive funding"}
                  {direction === "short" &&
                    fundingRate > 0 &&
                    "You will receive funding"}
                  {fundingRate === 0 && "No funding payments required"}
                </span>
              ) : (
                "No funding payments required"
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Position Size</span>
              <span>
                ${(Number.parseFloat(amount || "0") * leverage).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Price</span>
              <span>${country.markPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Liquidation Price</span>
              <span className="text-red-500">
                $
                {direction === "long"
                  ? (country.markPrice * (1 - 0.8 / leverage)).toFixed(2)
                  : (country.markPrice * (1 + 0.8 / leverage)).toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={
              !isConnected ||
              !direction ||
              !amount ||
              Number.parseFloat(amount) <= 0 ||
              isSubmitting
            }
            onClick={handleSubmit}
          >
            {!isConnected
              ? "Connect Wallet"
              : isSubmitting
              ? "Confirming..."
              : `Place ${direction === "long" ? "Long" : "Short"} Order`}
          </Button>
        </CardContent>
      </Card>

      {showConfirmModal && (
        <ModalConfirmTrade
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmTrade}
          tradeDetails={{
            country,
            direction,
            amount: Number(amount),
            leverage,
            entryPrice: country.markPrice,
            positionSize: Number(amount) * leverage,
            liquidationPrice: calculateLiquidationPrice(
              direction,
              country.markPrice,
              leverage
            ),
          }}
          userBalance={
            isDemoMode
              ? demoBalance
              : balance
              ? parseFloat(balance.formatted)
              : 0
          }
          balanceSymbol={
            isDemoMode ? "DEMO" : balance ? balance.symbol : "USDC"
          }
        />
      )}
    </>
  );
}

function calculateLiquidationPrice(
  direction: "long" | "short",
  entryPrice: number,
  leverage: number
): string {
  const liquidationThreshold = 1 / leverage;
  if (direction === "long") {
    return (entryPrice * (1 - liquidationThreshold)).toFixed(2);
  } else {
    return (entryPrice * (1 + liquidationThreshold)).toFixed(2);
  }
}
