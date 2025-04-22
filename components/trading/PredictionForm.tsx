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
import { USDCApproval } from "@/components/ui/usdc-approval";
import { handleContractFunctionExecutionError } from "@/lib/viem-error-decoder";
import { getContractAddress } from "@/lib/contracts/PredictionMarket";

interface PredictionFormProps {
  country: Country;
}

export default function PredictionForm({ country }: PredictionFormProps) {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [amount, setAmount] = useState<string>("");
  const [leverage, setLeverage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [needsUSDCApproval, setNeedsUSDCApproval] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const {
    openPosition,
    closePosition,
    error: contractError,
    isLoading: isContractLoading,
    clearError,
  } = useContract();
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

  const contractAddress = chain ? getContractAddress(chain.id) : undefined;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Show confirm modal instead of direct submission
    setShowConfirmModal(true);
    return;
  };

  const handleConfirmTrade = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Clear any previous errors
      setTradeError(null);
      clearError?.();

      // Convert to string with correct decimal places
      const marginAmount = amount.toString();

      // Check if we're in demo mode
      if (isDemoMode) {
        // Demo mode logic for opening position
        console.log("Opening demo position with params:", {
          countryId: country.id,
          direction,
          leverage,
          marginAmount,
        });

        // Simulated position opening for demo mode
        const positionResult = await openPosition(
          country.id,
          direction,
          leverage,
          marginAmount
        );

        if (positionResult.success) {
          toast({
            title: "Position Opened (Demo)",
            description: `You opened a ${direction} position on ${country.name} with ${leverage}x leverage`,
            variant: "default",
          });

          // Reset form after successful submission
          setDirection("long");
          setAmount("");
          setLeverage(1);
        } else {
          setTradeError(positionResult.error || "Failed to open demo position");
          toast({
            title: "Error Opening Position",
            description: positionResult.error || "Failed to open demo position",
            variant: "destructive",
          });
        }
      } else {
        // Add this debug logging
        console.log("Starting contract call with params:", {
          countryId: country.id,
          direction,
          leverage,
          marginAmount,
        });

        // Check if approval is needed first
        if (needsUSDCApproval) {
          setTradeError("Please approve USDC spending first");
          toast({
            title: "Approval Required",
            description:
              "You need to approve USDC spending before making this trade",
            variant: "warning",
          });
          setIsSubmitting(false);
          return;
        }

        // Open position via the contract with improved error handling
        const result = await openPosition(
          country.id,
          direction,
          leverage,
          marginAmount
        );

        // Add this debug logging
        console.log("OpenPosition result:", result);

        // Handle errors with improved handling
        if (!result.success) {
          console.error("Failed to open position:", result.error, result.code);
          setTradeError(result.error || "Failed to open position");

          // Enhanced check for approval errors - look for various error signatures and codes
          if (
            (result.code &&
              (result.code === "INSUFFICIENT_ALLOWANCE" ||
                result.code === "APPROVAL_REQUIRED")) ||
            (result.error &&
              (result.error.includes("allowance") ||
                result.error.includes("ERC20InsufficientAllowance") ||
                result.error.includes("0xfb8f41b2")))
          ) {
            // Set the flag to show approval component
            setNeedsUSDCApproval(true);
            setTradeError(
              "You need to approve USDC spending before making this trade"
            );
            toast({
              title: "USDC Approval Required",
              description:
                "Please approve USDC spending to continue with your trade",
              variant: "warning",
            });
          } else {
            toast({
              title: "Error Opening Position",
              description: result.error || "Failed to open position",
              variant: "destructive",
            });
          }

          setIsSubmitting(false);
          return;
        }

        // Success case - show position confirmation
        toast({
          title: "Position Opened Successfully",
          description: `You opened a ${direction} position on ${country.name} with ${leverage}x leverage`,
          variant: "default",
        });

        // Reset form after successful submission
        setDirection("long");
        setAmount("");
        setLeverage(1);
      }
    } catch (error: any) {
      console.error("Error opening position:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details || null,
      });

      // Format the error message for display
      let errorMessage = error.message || "Transaction failed";

      // Enhanced detection for approval errors
      if (
        errorMessage.includes("allowance") ||
        errorMessage.includes("ERC20InsufficientAllowance") ||
        errorMessage.includes("0xfb8f41b2") ||
        error.code === "INSUFFICIENT_ALLOWANCE" ||
        (error.details && error.details.includes("ERC20InsufficientAllowance"))
      ) {
        setNeedsUSDCApproval(true);
        errorMessage =
          "You need to approve USDC spending before making this trade";
        toast({
          title: "USDC Approval Required",
          description: "Please approve USDC spending first",
          variant: "warning",
        });
      } else {
        toast({
          title: "Error Opening Position",
          description: errorMessage,
          variant: "destructive",
        });
      }

      setTradeError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovalSuccess = () => {
    setNeedsUSDCApproval(false);
    toast({
      title: "USDC Approved",
      description: "You can now proceed with opening your position",
    });
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

          {!isDemoMode && (
            <USDCApproval
              amount={amount}
              onSuccess={handleApprovalSuccess}
              contractAddress={contractAddress}
            />
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={
              !isConnected ||
              !direction ||
              !amount ||
              Number.parseFloat(amount) <= 0 ||
              isSubmitting ||
              needsUSDCApproval
            }
            onClick={() => setShowConfirmModal(true)}
          >
            {!isConnected
              ? "Connect Wallet"
              : isSubmitting
              ? "Confirming..."
              : needsUSDCApproval
              ? "Approve USDC First"
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
