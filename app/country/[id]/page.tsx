"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";

import {
  RPC_URL,
  POSITION_ADDRESS,
  POSITION_ABI,
} from "@/lib/contracts/constants";
import { usePositionsStore } from "@/components/trading/PositionsContext";
import HistoryTable from "@/components/dashboard/HistoryTable";
import { fetcher } from "@/src/services/fetcher";
import BackButton from "./BackButton";
import Header from "./Header";
import Chart from "./Chart";
import TradingPanel from "./TradingPanel";
import About from "./About";
import Leaderboard from "./Leaderboard";

export default function CountryPage() {
  const { id } = useParams();
  const countryId = typeof id === "string" ? id.toUpperCase() : "";

  // Define interface for Position data returned from smart contract
  interface PositionData {
    positionId: bigint;
    countryId: string;
    trader: `0x${string}`;
    direction: number;
    size: bigint;
    leverage: number;
    entryPrice: bigint;
    openTime: bigint;
    takeProfit: bigint;
    stopLoss: bigint;
    isOpen: boolean;
    liquidationPrice: bigint;
  }

  const [previousBalance, setPreviousBalance] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number | null>(null);
  const { data, error, isLoading } = useSWR(
    countryId ? `${RPC_URL}/api/v1/country/${countryId}/trade` : null,
    fetcher
  );

  const country = React.useMemo(() => {
    if (!data?.data) return null;
    const d = data.data;
    return {
      name: d.name,
      flagCode: d.code?.toLowerCase() || "",
      countryScore: d.tradingMetrics?.countryScore ?? 0,
      volume24h: d.tradingMetrics?.volume24h ?? "-",
      indexPrice: d.marketInfo?.indexPrice ?? "-",
      sentiment: d.marketInfo?.sentiment ?? "-",
      trend: d.marketInfo?.trend ?? "-",
      markPrice: d.marketInfo?.markPrice ?? "-",
      fundingRate: d.marketInfo?.fundingRate ?? "-",
      openInterest: d.marketInfo?.openInterest ?? "-",
      openTrades: d.tradingMetrics?.openTrades ?? "-",
      volumes: d.tradingMetrics?.volume24h ?? "-",
      fundingCooldown: d.tradingMetrics?.fundingCooldown ?? "-",
      fundingPercent: d.marketInfo?.fundingRate ?? "-",
      description: d.about ?? "-",
      liquidationPrice: d.marketInfo?.liquidationPrice ?? "-",
    };
  }, [data]);

  const [transactionStep, setTransactionStep] = useState<
    "idle" | "approving" | "trading" | "success" | "error"
  >("idle");

  interface TradePosition {
    size: string;
    leverage: string;
    isLong: boolean;
    entryPrice: number;
    isOpen?: boolean;
  }

  const [position, setPosition] = useState<TradePosition>({
    size: "",
    leverage: "1",
    isLong: true,
    entryPrice: 0,
  });

  const [showPosition, setShowPosition] = useState(false);
  const [closeStep, setCloseStep] = useState<1 | 2 | 3 | 4 | 99 | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const { address } = useAccount();
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address,
  });

  const { triggerRefresh } = usePositionsStore();

  const { refetch: refetchPositionFromHook } = useReadContract({
    address: POSITION_ADDRESS[84532],
    abi: POSITION_ABI,
    functionName: "getPosition",
    args: [countryId, address] as const,
    account: address,
  }) as { refetch: () => Promise<{ data: PositionData | undefined }> };

  const refetchPosition = () => {
    if (address) {
      return refetchPositionFromHook();
    }
    return Promise.resolve();
  };

  // Helper to calculate PnL, percentage, and fees
  const getPnLInfo = () => {
    const entry = parseFloat(country?.markPrice || "0");
    const mark = parseFloat(country?.markPrice || "0"); // Replace with actual mark price if available
    const size = parseFloat(position?.size || "0");
    const isLong = position?.isLong;

    if (!entry || !mark || !size) {
      return {
        pnl: 0,
        percentage: 0,
        fees: 0,
        isProfit: true,
      };
    }

    // Example calculation (replace with your actual logic)
    const priceDiff = isLong ? mark - entry : entry - mark;
    const pnl = priceDiff * size;
    const percentage = entry ? (priceDiff / entry) * 100 : 0;
    const fees = size * 0.0025; // Example: 0.25% fee

    return {
      pnl,
      percentage,
      fees,
      isProfit: pnl >= 0,
    };
  };

  useEffect(() => {
    if (hash && !isConfirming) {
      const savedSize = position.size;
      setPosition({
        size: savedSize,
        leverage: "1",
        isLong: true,
        entryPrice: 120,
      });
      setShowPosition(true);

      document
        .querySelector("#positions-panel")
        ?.scrollIntoView({ behavior: "smooth" });

      const timer = setTimeout(() => {
        refetchBalance().catch((err) =>
          console.error("Failed to refresh balance:", err)
        );
        triggerRefresh();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [hash, isConfirming, refetchBalance, triggerRefresh, position.size]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        refetchBalance();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [address, refetchBalance]);

  const handlePlaceTrade = async () => {
    try {
      setTransactionStep("trading");

      if (!id || typeof id !== "string") {
        throw new Error("Country ID is required");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Check ETH balance
      if (
        !walletBalance ||
        Number(formatUnits(walletBalance.value, walletBalance.decimals)) <
          Number(position.size)
      ) {
        throw new Error(
          `Insufficient ETH balance. Required: ${
            position.size
          } ETH, Available: ${
            walletBalance
              ? formatUnits(walletBalance.value, walletBalance.decimals)
              : "0"
          } ETH`
        );
      }

      // Validate position parameters
      if (!position.size || Number(position.size) <= 0) {
        throw new Error("Position size must be greater than 0");
      }

      if (Number(position.leverage) < 1 || Number(position.leverage) > 5) {
        throw new Error("Leverage must be between 1 and 5");
      }

      // Convert ETH amount to wei
      const sizeInWei = parseUnits(position.size, 18);

      console.log("Opening position with parameters:", {
        country: id,
        direction: position.isLong ? 0 : 1,
        leverage: Number(position.leverage),
        value: sizeInWei.toString(),
        address: address,
      });

      // Check if position already exists
      try {
        const existingPosition = await refetchPositionFromHook();
        console.log("Existing position:", existingPosition.data);

        if (existingPosition.data && existingPosition.data.isOpen) {
          throw new Error(
            "Position already exists. Close your current position before opening a new one."
          );
        }
      } catch (positionCheckError) {
        console.log("Position check result:", positionCheckError);
        // Continue if position doesn't exist or check fails
      }

      // Open Position with ETH
      const tradeTx = await writeContract({
        address: POSITION_ADDRESS[84532],
        abi: POSITION_ABI,
        functionName: "openPosition",
        args: [
          id,
          position.isLong ? 0 : 1,
          parseInt(position.leverage), // Ensure it's an integer
        ],
        value: sizeInWei, // Send ETH with the transaction
      });
      console.log("Trade TX:", tradeTx);

      setTransactionStep("success");

      setPosition({
        ...position,
        entryPrice: country?.markPrice,
      });

      // Refresh position data explicitly
      refetchPosition().catch((err) =>
        console.error("Failed to refresh position:", err)
      );
      refetchBalance().catch((err: Error) =>
        console.error("Failed to refresh balance:", err)
      );
      triggerRefresh();
    } catch (error) {
      setTransactionStep("error");
      console.error("Error placing trade:", error);

      // Enhanced error handling to capture revert reasons
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        if (error.message.includes("revert")) {
          // Try to extract the revert reason
          const revertMatch = error.message.match(/revert (.+)/);
          if (revertMatch) {
            alert("Transaction failed: " + revertMatch[1]);
          } else {
            alert("Transaction reverted: " + error.message);
          }
        } else {
          alert("Failed to trade: " + error.message);
        }
      } else {
        console.error("Unknown error:", error);
        alert("Failed to trade: " + JSON.stringify(error));
      }
    } finally {
      // Reset transaction step after a delay
      setTimeout(() => setTransactionStep("idle"), 3000);
    }
  };

  const isProcessing = isPending || isConfirming;

  const handleCloseStepContinue = async () => {
    if (closeStep === 1) {
      setCloseStep(2); // Go to step 2
    } else if (closeStep === 2) {
      setCloseStep(3);
      if (walletBalance) {
        setPreviousBalance(Number(walletBalance.formatted));
        const { pnl, fees } = getPnLInfo();
        setNewBalance(Number(walletBalance.formatted) + pnl - fees);
      }
    } else if (closeStep === 3) {
      setCloseStep(4); // Go to step 4
    } else if (closeStep === 4) {
      // Close position using user's address
      try {
        if (address) {
          await writeContract({
            address: POSITION_ADDRESS[84532],
            abi: POSITION_ABI,
            functionName: "closePosition",
            args: [address],
          });
        } else {
          throw new Error("Wallet address not available");
        }
      } catch (error) {
        console.error("Error closing position:", error);
        // Handle error appropriately
      }
      setCloseStep(99); // Go to history table
    } else if (closeStep === 99) {
      setShowPosition(false);
      setCloseStep(null); // Close the entire flow
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading country data...
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Country not found or failed to load.
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-2 sm:p-6 bg-[#111214] min-h-screen">
        <BackButton />

        <div className="space-y-4 sm:space-y-6">
          <Header
            flagCode={country.flagCode}
            name={country.name}
            countryScore={country.countryScore}
            openTrades={country.openTrades}
            volumes={country.volumes}
            fundingPercent={country.fundingPercent}
            fundingCooldown={country.fundingCooldown}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Chart countryScore={country.countryScore} />
            <TradingPanel
              setPosition={setPosition}
              position={position}
              mounted={mounted}
              address={address}
              walletBalance={walletBalance}
              country={country}
              isProcessing={isProcessing}
              transactionStep={transactionStep}
              handlePlaceTrade={handlePlaceTrade}
            />
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <About description={country.description} />
            <Leaderboard />

            {/* Positions Panel */}
            <div
              id="positions-panel"
              className="self-stretch p-4 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] flex flex-col justify-start items-start gap-4 sm:gap-5 min-h-[300px] sm:min-h-[400px]"
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="text-white text-lg font-medium font-['Inter'] leading-7">
                  Positions
                </div>
                {showPosition && closeStep === null && (
                  <button
                    className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#155dee] hover:bg-[#0d4bc4] transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => setCloseStep(1)}
                  >
                    <span className="text-white text-sm sm:text-base font-semibold">
                      Close Position
                    </span>
                  </button>
                )}
              </div>

              <div className="w-full flex-1">
                {showPosition && closeStep === null ? (
                  <div className="w-full flex flex-col justify-start items-start space-y-3">
                    <div className="w-full h-px bg-[#323232]" />

                    {/* Position Header */}
                    <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#155dee] rounded-full" />
                        <span className="text-[#697485] text-sm font-medium">
                          {country.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            position.isLong
                              ? "bg-[#16b264] bg-opacity-20 text-[#16b264]"
                              : "bg-[#ff4545] bg-opacity-20 text-[#ff4545]"
                          }`}
                        >
                          {position.isLong ? "LONG" : "SHORT"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#b21616] text-sm font-normal">
                          -$0.24 (-0.0%)
                        </div>
                      </div>
                    </div>

                    {/* Position Details */}
                    <div className="w-full space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Position Size
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          ${position.size}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Entry Price
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          {country.markPrice}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Liquidation Price
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          {country.liquidationPrice}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Fees
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          $2.50
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-[#323232] my-4" />

                    {/* Additional Position */}
                    <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#155dee] rounded-full" />
                        <span className="text-[#697485] text-sm font-medium">
                          Abstract
                        </span>
                      </div>
                      <div className="text-[#16b264] text-sm font-normal">
                        $0.24 (+0.5%)
                      </div>
                    </div>
                  </div>
                ) : closeStep ? (
                  <div className="w-full flex-1 px-2 sm:px-4">
                    {/* Progress Steps */}
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                      {[1, 2, 3, 4].map((number) => (
                        <div key={number} className="flex items-center flex-1">
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                              closeStep === number
                                ? "bg-[#155dee] text-white"
                                : closeStep > number
                                ? "bg-[#155dee] text-white"
                                : "bg-[#2d2d2e] text-gray-400"
                            }`}
                          >
                            {number}
                          </div>
                          {number < 4 && (
                            <div
                              className={`h-0.5 flex-1 mx-1 sm:mx-2 ${
                                closeStep > number
                                  ? "bg-[#155dee]"
                                  : "bg-[#2d2d2e]"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Step Content */}
                    <div className="mb-6 space-y-4">
                      {closeStep === 1 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
                              Close Position
                            </h2>
                            <p className="text-gray-400 text-sm">
                              Are you sure you want to close this position?
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                              <span className="text-gray-400 text-sm">
                                Position
                              </span>
                              <span className="text-white text-sm font-medium">
                                {country.name}{" "}
                                {position.isLong ? "LONG" : "SHORT"}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                              <span className="text-gray-400 text-sm">
                                Size
                              </span>
                              <span className="text-white text-sm font-medium">
                                ${position.size}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                              <span className="text-gray-400 text-sm">
                                Entry Price
                              </span>
                              <span className="text-white text-sm font-medium">
                                {country.markPrice}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                              <span className="text-gray-400 text-sm">
                                Mark Price
                              </span>
                              <span className="text-white text-sm font-medium">
                                {country.markPrice}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {closeStep === 2 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
                              Confirm PnL
                            </h2>
                            <p className="text-gray-400 text-sm">
                              Review your position&apos;s performance
                            </p>
                          </div>
                          {(() => {
                            const { pnl, percentage, fees, isProfit } =
                              getPnLInfo();
                            return (
                              <>
                                <div className="text-center mb-6">
                                  <div
                                    className={`text-xl sm:text-2xl font-bold ${
                                      isProfit
                                        ? "text-[#16b264]"
                                        : "text-[#ff4545]"
                                    }`}
                                  >
                                    {pnl >= 0 ? "+" : "-"}$
                                    {Math.abs(pnl).toFixed(2)}
                                  </div>
                                  <div
                                    className={
                                      isProfit
                                        ? "text-[#16b264]"
                                        : "text-[#ff4545]"
                                    }
                                  >
                                    ({percentage >= 0 ? "+" : "-"}
                                    {Math.abs(percentage).toFixed(2)}%)
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                                    <span className="text-gray-400 text-sm">
                                      Trading Fees
                                    </span>
                                    <span className="text-white text-sm">
                                      -${fees.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                                    <span className="text-gray-400 text-sm">
                                      Net PnL
                                    </span>
                                    <span
                                      className={
                                        isProfit
                                          ? "text-[#16b264] text-sm"
                                          : "text-[#ff4545] text-sm"
                                      }
                                    >
                                      {pnl - fees >= 0 ? "+" : "-"}$
                                      {Math.abs(pnl - fees).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </>
                      )}

                      {closeStep === 3 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
                              Updated Balance
                            </h2>
                            <p className="text-gray-400 text-sm">
                              Your new balance after closing position
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-white text-2xl sm:text-3xl font-bold mb-2">
                              {newBalance !== null
                                ? `$${newBalance.toFixed(2)}`
                                : "Loading..."}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Previous:{" "}
                              {previousBalance !== null
                                ? `$${previousBalance.toFixed(2)}`
                                : "Loading..."}
                            </div>
                          </div>
                        </>
                      )}

                      {closeStep === 4 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
                              Trade History
                            </h2>
                            <p className="text-gray-400 text-sm">
                              Position successfully closed
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <div className="text-white text-sm font-medium">
                                {country.name}{" "}
                                {position.isLong ? "LONG" : "SHORT"}
                              </div>
                              <div className="text-gray-400 text-xs">
                                Closed at {new Date().toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#16b264] text-sm font-medium">
                                +$0.00
                              </div>
                              <div className="text-gray-400 text-xs">0.0%</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                      {closeStep === 1 && (
                        <>
                          <button
                            onClick={() => setCloseStep(null)}
                            className="w-full py-3 rounded-full bg-[#2d2d2e] text-white hover:bg-[#3d3d3e] transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCloseStepContinue}
                            className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                          >
                            Close Position
                          </button>
                        </>
                      )}
                      {closeStep === 2 && (
                        <button
                          onClick={handleCloseStepContinue}
                          className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                        >
                          Continue
                        </button>
                      )}
                      {closeStep === 3 && (
                        <button
                          onClick={handleCloseStepContinue}
                          className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                        >
                          View History
                        </button>
                      )}
                      {closeStep === 4 && (
                        <button
                          onClick={handleCloseStepContinue}
                          className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                        >
                          View History
                        </button>
                      )}
                      {closeStep === 99 && (
                        <button
                          onClick={handleCloseStepContinue}
                          className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ) : closeStep === 99 ? (
                  <div className="w-full overflow-x-auto">
                    <div className="w-full flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-white text-lg font-medium">
                          Trade History
                        </h3>
                        <button
                          onClick={() => setCloseStep(null)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* History Table */}
                      <HistoryTable />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-14a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No open positions
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Place a trade to see your positions here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
