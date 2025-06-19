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
  PREDICTION_ADDRESS,
  PREDICTION_ABI,
} from "@/lib/contracts/constants";
import { fetcher } from "@/src/services/fetcher";
import BackButton from "@/app/event/[id]/BackButton";
import EventHeader from "@/app/event/[id]/EventHeader";
import PriceChart from "@/app/event/[id]/PriceChart";
import BettingPanel from "@/app/event/[id]/BettingPanel";
import EventDetails from "@/app/event/[id]/EventDetails";
import ActivityFeed from "@/app/event/[id]/ActivityFeed";

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = typeof id === "string" ? id : "";

  // Event bet position interface
  interface BetPosition {
    positionId: bigint;
    eventId: string;
    bettor: `0x${string}`;
    outcome: number; // 0 = YES, 1 = NO
    amount: bigint;
    odds: bigint;
    timestamp: bigint;
    isActive: boolean;
    payout: bigint;
  }

  const [previousBalance, setPreviousBalance] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  // Fetch event data
  const { data, error, isLoading } = useSWR(
    eventId ? `${RPC_URL}/api/v1/event/${eventId}` : null,
    fetcher
  );

  const event = React.useMemo(() => {
    if (!data?.data) return null;
    const d = data.data;
    return {
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      endDate: d.endDate,
      resolvedDate: d.resolvedDate,
      status: d.status, // "active", "resolved", "cancelled"
      outcomes: d.outcomes || [
        { id: "yes", label: "Yes", probability: 0.65, price: 0.65 },
        { id: "no", label: "No", probability: 0.35, price: 0.35 },
      ],
      volume24h: d.volume24h || 0,
      totalVolume: d.totalVolume || 0,
      liquidity: d.liquidity || 0,
      createdBy: d.createdBy,
      imageUrl: d.imageUrl,
      tags: d.tags || [],
      marketData: {
        yesPrice: d.marketData?.yesPrice || 0.65,
        noPrice: d.marketData?.noPrice || 0.35,
        yesVolume: d.marketData?.yesVolume || 0,
        noVolume: d.marketData?.noVolume || 0,
        spread: d.marketData?.spread || 0.02,
        lastPrice: d.marketData?.lastPrice || 0.65,
        priceChange24h: d.marketData?.priceChange24h || 0.05,
      },
      comments: d.comments || 0,
      shares: d.shares || 0,
      resolution: d.resolution || null, // "yes", "no", "invalid", null
    };
  }, [data]);

  const [transactionStep, setTransactionStep] = useState<
    "idle" | "approving" | "betting" | "success" | "error"
  >("idle");

  interface BetData {
    amount: string;
    outcome: "yes" | "no";
    expectedPayout: number;
    probability: number;
  }

  const [bet, setBet] = useState<BetData>({
    amount: "",
    outcome: "yes",
    expectedPayout: 0,
    probability: 0,
  });

  const [showPosition, setShowPosition] = useState(false);
  const [resolveStep, setResolveStep] = useState<1 | 2 | 3 | 4 | 99 | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<
    "details" | "activity" | "positions"
  >("details");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const { address } = useAccount();
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address,
  });

  const { refetch: refetchPositionFromHook } = useReadContract({
    address: PREDICTION_ADDRESS[84532],
    abi: PREDICTION_ABI,
    functionName: "getUserPosition",
    args: [eventId, address] as const,
    account: address,
  }) as { refetch: () => Promise<{ data: BetPosition | undefined }> };

  const refetchPosition = () => {
    if (address) {
      return refetchPositionFromHook();
    }
    return Promise.resolve();
  };

  // Calculate potential payout
  const calculatePayout = (amount: number, outcome: "yes" | "no") => {
    if (!event || !amount) return 0;
    const price =
      outcome === "yes" ? event.marketData.yesPrice : event.marketData.noPrice;
    return amount / price;
  };

  // Calculate expected probability
  const calculateProbability = (outcome: "yes" | "no") => {
    if (!event) return 0;
    return outcome === "yes"
      ? event.marketData.yesPrice
      : event.marketData.noPrice;
  };

  useEffect(() => {
    if (bet.amount && event) {
      const payout = calculatePayout(parseFloat(bet.amount), bet.outcome);
      const probability = calculateProbability(bet.outcome);
      setBet((prev) => ({
        ...prev,
        expectedPayout: payout,
        probability: probability,
      }));
    }
  }, [bet.amount, bet.outcome, event]);

  useEffect(() => {
    if (hash && !isConfirming) {
      setShowPosition(true);
      const betData = {
        eventId: id,
        userAddress: address,
        hasBet: true,
      };
      localStorage.setItem(
        `BeTheNation-Event-${id}-${address}`,
        JSON.stringify(betData)
      );

      document
        .querySelector("#positions-panel")
        ?.scrollIntoView({ behavior: "smooth" });

      const timer = setTimeout(() => {
        refetchBalance().catch((err) =>
          console.error("Failed to refresh balance:", err)
        );
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [hash, isConfirming, refetchBalance, bet.amount]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        refetchBalance();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [address, refetchBalance]);

  const handlePlaceBet = async () => {
    try {
      setTransactionStep("betting");

      if (!eventId || typeof eventId !== "string") {
        throw new Error("Event ID is required");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Check ETH balance
      if (
        !walletBalance ||
        Number(formatUnits(walletBalance.value, walletBalance.decimals)) <
          Number(bet.amount)
      ) {
        throw new Error(
          `Insufficient ETH balance. Required: ${bet.amount} ETH, Available: ${
            walletBalance
              ? formatUnits(walletBalance.value, walletBalance.decimals)
              : "0"
          } ETH`
        );
      }

      // Validate bet parameters
      if (!bet.amount || Number(bet.amount) <= 0) {
        throw new Error("Bet amount must be greater than 0");
      }

      // Convert ETH amount to wei
      const amountInWei = parseUnits(bet.amount, 18);

      console.log("Placing bet with parameters:", {
        eventId: eventId,
        outcome: bet.outcome === "yes" ? 0 : 1,
        amount: amountInWei.toString(),
        address: address,
      });

      // Check if position already exists
      try {
        const existingPosition = await refetchPositionFromHook();
        console.log("Existing position:", existingPosition.data);

        if (existingPosition.data && existingPosition.data.isActive) {
          throw new Error(
            "Position already exists. Resolve your current position before placing a new bet."
          );
        }
      } catch (positionCheckError) {
        console.log("Position check result:", positionCheckError);
        // Continue if position doesn't exist or check fails
      }

      // Place Bet with ETH
      const betTx = await writeContract({
        address: PREDICTION_ADDRESS[84532],
        abi: PREDICTION_ABI,
        functionName: "placeBet",
        args: [eventId, bet.outcome === "yes" ? 0 : 1],
        value: amountInWei, // Send ETH with the transaction
      });
      console.log("Bet TX:", betTx);

      setTransactionStep("success");

      // Refresh position data explicitly
      refetchPosition().catch((err) =>
        console.error("Failed to refresh position:", err)
      );
      refetchBalance().catch((err: Error) =>
        console.error("Failed to refresh balance:", err)
      );
    } catch (error) {
      setTransactionStep("error");
      console.error("Error placing bet:", error);

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
          alert("Failed to place bet: " + error.message);
        }
      } else {
        console.error("Unknown error:", error);
        alert("Failed to place bet: " + JSON.stringify(error));
      }
    } finally {
      // Reset transaction step after a delay
      setTimeout(() => setTransactionStep("idle"), 3000);
    }
  };

  const isProcessing = isPending || isConfirming;

  const handleResolveStepContinue = async () => {
    if (resolveStep === 1) {
      setResolveStep(2);
    } else if (resolveStep === 2) {
      setResolveStep(3);
      if (walletBalance) {
        setPreviousBalance(Number(walletBalance.formatted));
        // Calculate payout based on bet outcome and event resolution
        const payout = bet.expectedPayout;
        setNewBalance(Number(walletBalance.formatted) + payout);
      }
    } else if (resolveStep === 3) {
      setResolveStep(4);
    } else if (resolveStep === 4) {
      // Resolve position using user's address
      try {
        if (address) {
          await writeContract({
            address: PREDICTION_ADDRESS[84532],
            abi: PREDICTION_ABI,
            functionName: "claimPayout",
            args: [address, eventId],
          });
        } else {
          throw new Error("Wallet address not available");
        }
      } catch (error) {
        console.error("Error claiming payout:", error);
      }
      setResolveStep(99);
    } else if (resolveStep === 99) {
      setShowPosition(false);
      localStorage.removeItem(`BeTheNation-Event-${eventId}-${address}`);
      setResolveStep(null);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const storedValue = localStorage.getItem(
      `BeTheNation-Event-${eventId}-${address}`
    );
    const betData = storedValue ? JSON.parse(storedValue) : false;
    if (betData.eventId === eventId && betData.userAddress === address) {
      setShowPosition(betData.hasBet);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading event data...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Event not found or failed to load.
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-2 sm:p-6 bg-[#111214] min-h-screen">
        <BackButton />

        <div className="space-y-4 sm:space-y-6">
          <EventHeader
            title={event.title}
            category={event.category}
            endDate={event.endDate}
            status={event.status}
            volume24h={event.volume24h}
            totalVolume={event.totalVolume}
            liquidity={event.liquidity}
            tags={event.tags}
            imageUrl={event.imageUrl}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <PriceChart
                marketData={event.marketData}
                outcomes={event.outcomes}
              />
            </div>
            <BettingPanel
              setBet={setBet}
              bet={bet}
              mounted={mounted}
              address={address}
              walletBalance={walletBalance}
              event={event}
              isProcessing={isProcessing}
              transactionStep={transactionStep}
              handlePlaceBet={handlePlaceBet}
            />
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {/* Tab Navigation */}
            <div className="lg:col-span-2">
              <div className="bg-[#1d1f22] rounded-xl p-4 sm:p-6">
                <div className="flex space-x-6 border-b border-[#323232] mb-6">
                  <button
                    onClick={() => setSelectedTab("details")}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === "details"
                        ? "border-[#155dee] text-[#155dee]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSelectedTab("activity")}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === "activity"
                        ? "border-[#155dee] text-[#155dee]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => setSelectedTab("positions")}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === "positions"
                        ? "border-[#155dee] text-[#155dee]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Positions
                  </button>
                </div>

                {selectedTab === "details" && (
                  <EventDetails
                    description={event.description}
                    createdBy={event.createdBy}
                    endDate={event.endDate}
                    resolution={event.resolution}
                  />
                )}
                {selectedTab === "activity" && (
                  <ActivityFeed eventId={event.id} />
                )}
                {selectedTab === "positions" && (
                  <div className="text-gray-400 text-center py-8">
                    <p>Position data will be displayed here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Positions Panel */}
            <div
              id="positions-panel"
              className="self-stretch p-4 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] flex flex-col justify-start items-start gap-4 sm:gap-5 min-h-[300px] sm:min-h-[400px]"
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="text-white text-lg font-medium font-['Inter'] leading-7">
                  Your Positions
                </div>
                {showPosition &&
                  resolveStep === null &&
                  event.status === "resolved" && (
                    <button
                      className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#16b264] hover:bg-[#0f8a4f] transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer"
                      onClick={() => setResolveStep(1)}
                    >
                      <span className="text-white text-sm sm:text-base font-semibold">
                        Claim Payout
                      </span>
                    </button>
                  )}
              </div>

              <div className="w-full flex-1">
                {showPosition && resolveStep === null ? (
                  <div className="w-full flex flex-col justify-start items-start space-y-3">
                    <div className="w-full h-px bg-[#323232]" />

                    {/* Position Header */}
                    <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            bet.outcome === "yes"
                              ? "bg-[#16b264]"
                              : "bg-[#ff4545]"
                          }`}
                        />
                        <span className="text-[#697485] text-sm font-medium">
                          {event.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            bet.outcome === "yes"
                              ? "bg-[#16b264] bg-opacity-20 text-[#16b264]"
                              : "bg-[#ff4545] bg-opacity-20 text-[#ff4545]"
                          }`}
                        >
                          {bet.outcome.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-normal ${
                            event.status === "resolved"
                              ? event.resolution === bet.outcome
                                ? "text-[#16b264]"
                                : "text-[#ff4545]"
                              : "text-[#697485]"
                          }`}
                        >
                          {event.status === "resolved"
                            ? event.resolution === bet.outcome
                              ? `+$${bet.expectedPayout.toFixed(2)}`
                              : `-$${bet.amount}`
                            : `$${bet.expectedPayout.toFixed(2)}`}
                        </div>
                      </div>
                    </div>

                    {/* Position Details */}
                    <div className="w-full space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Bet Amount
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          ${bet.amount}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Potential Payout
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          ${bet.expectedPayout.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Avg Price
                        </span>
                        <span className="text-[#697586] text-sm font-normal">
                          ${bet.probability.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#323232] border-opacity-50">
                        <span className="text-[#697485] text-sm font-medium mb-1 sm:mb-0">
                          Status
                        </span>
                        <span
                          className={`text-sm font-normal ${
                            event.status === "active"
                              ? "text-[#155dee]"
                              : event.status === "resolved"
                              ? "text-[#16b264]"
                              : "text-[#ff4545]"
                          }`}
                        >
                          {event.status === "active"
                            ? "Active"
                            : event.status === "resolved"
                            ? "Resolved"
                            : "Cancelled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : resolveStep ? (
                  <div className="w-full flex-1 px-2 sm:px-4">
                    {/* Similar resolve steps as in the original code */}
                    <div className="text-center">
                      <h2 className="text-white text-lg font-semibold mb-4">
                        Claim Your Payout
                      </h2>
                      <p className="text-gray-400 text-sm mb-6">
                        Your bet on "{bet.outcome.toUpperCase()}"
                        {event.resolution === bet.outcome ? " won!" : " lost."}
                      </p>
                      <button
                        onClick={handleResolveStepContinue}
                        className="w-full py-3 rounded-full bg-[#155dee] text-white hover:bg-[#0d4bc4] transition-colors duration-200"
                      >
                        Continue
                      </button>
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No active positions
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Place a bet to see your positions here
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
