"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
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

import { RPC_URL, POOL_ADDRESS, POOL_ABI } from "@/lib/contracts/constants";
import { usePositionsStore } from "@/components/trading/PositionsContext";
import { fetcher } from "@/src/services/fetcher";
import BackButton from "./BackButton";
import Header from "./Header";
import Chart from "./Chart";
import TradingPanel from "./TradingPanel";
import About from "./About";
import Leaderboard from "./Leaderboard";
import TradingPositionsDashboard from "./Position2";
import { Bounce, ToastContainer } from "react-toastify";
import { buySuccess } from "@/lib/react-notify/notify";

const OpenPositionContext = createContext<{
  openPosition: any[] | null;
  setOpenPosition: React.Dispatch<React.SetStateAction<any[] | null>>;
} | null>(null);

export function OpenPositionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openPosition, setOpenPosition] = useState<any[] | null>(null);

  return (
    <OpenPositionContext.Provider value={{ openPosition, setOpenPosition }}>
      {children}
    </OpenPositionContext.Provider>
  );
}

export function useOpenPosition() {
  const context = useContext(OpenPositionContext);
  if (!context) {
    throw new Error(
      "useOpenPosition must be used within an OpenPositionProvider"
    );
  }
  return context;
}

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
  // const [openPosition, setOpenPosition] = useState<any[] | null>(null);
  const { openPosition, setOpenPosition } = useOpenPosition();
  const [closeStep, setCloseStep] = useState<1 | 2 | 3 | 4 | 99 | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const { address } = useAccount();
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address,
  });

  const { triggerRefresh } = usePositionsStore();

  const { refetch: refetchPositionFromHook } = useReadContract({
    address: POOL_ADDRESS[97],
    abi: POOL_ABI,
    functionName: "getTraderPositions",
    args: [address] as const,
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
      getPosition();

      // document
      //   .querySelector("#positions-panel")
      //   ?.scrollIntoView({ behavior: "smooth" });

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
        alert("Position size must be greater than 0");
      }

      if (Number(position.leverage) < 1 || Number(position.leverage) > 5) {
        alert("Leverage must be between 1 and 5");
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
      // try {
      //   const existingPosition = await refetchPositionFromHook();
      //   console.log("Existing position:", existingPosition.data);

      //   if (existingPosition.data && existingPosition.data.isOpen) {
      //     throw new Error(
      //       "Position already exists. Close your current position before opening a new one."
      //     );
      //   }
      // } catch (positionCheckError) {
      //   console.log("Position check result:", positionCheckError);
      // }

      // Check balance
      // if (walletBalance && walletBalance.formatted) {
      //   const balance = Number(walletBalance.formatted);
      //   if (balance < Number(position.size)) {
      //     throw new Error(
      //       `Insufficient ETH balance. Required: ${position.size} ETH, Available: ${balance} ETH`
      //     );
      //   }
      // }

      // Open Position with ETH
      const tradeTx = await writeContract({
        address: POOL_ADDRESS[97],
        abi: POOL_ABI,
        functionName: "createMarketOrder",
        args: [
          address,
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
      buySuccess();
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

  const handleClosePosition = async (
    positionId: any,
    amount: number,
    size: number
  ) => {
    try {
      if (address) {
        if (size <= 0 || size > 100) {
          alert("Invalid position size");
          return;
        }
        const paddedPositionId = positionId.toString(16).padStart(64, "0");
        const bytes32PositionId = `0x${paddedPositionId}`;
        if (size === 100) {
          await writeContract({
            address: POOL_ADDRESS[97],
            abi: POOL_ABI,
            functionName: "closePositionId",
            args: [bytes32PositionId],
          });
        } else {
          await writeContract({
            address: POOL_ADDRESS[97],
            abi: POOL_ABI,
            functionName: "closePositionPartial",
            args: [bytes32PositionId, amount],
          });
        }
      } else {
        alert("Wallet address not available");
      }
    } catch (error) {
      console.error("Error closing position:", error);
      // Handle error appropriately
    }
  };

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
            address: POOL_ADDRESS[84532],
            abi: POOL_ABI,
            functionName: "closePositionById",
            args: [openPosition, 100],
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
      // localStorage.removeItem(`BeTheNation-${id}-${address}`);
      setCloseStep(null); // Close the entire flow
    }
  };

  const [mounted, setMounted] = useState(false);
  const getPosition = async () => {
    const existingPosition: any = await refetchPositionFromHook();
    console.log("Existing position:", existingPosition.data);
    const positionCountry = existingPosition.data[1].filter(
      (position: any) =>
        position.countryId.toUpperCase() === id &&
        // position.isOpen &&
        position.size > 0 &&
        position.trader === address
    );
    console.log("Position country:", positionCountry);
    setOpenPosition(positionCountry);
    // setShowPosition(true);
  };
  useEffect(() => {
    setMounted(true);
    getPosition();
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
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
            {openPosition === null ? (
              <div>Loading positions...</div>
            ) : (
              <TradingPositionsDashboard
                myPositions={openPosition}
                closePosition={handleClosePosition}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
