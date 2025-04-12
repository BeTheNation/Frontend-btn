"use client";

import { useState, useEffect, useMemo } from "react";
import { usePositionStore } from "@/store/positionStore";
import { useDemoMode } from "@/hooks/useDemoMode";

export function useTradeHistory() {
  // Get trade history from stores
  const { demoTradeHistory } = useDemoMode();
  const positionStore = usePositionStore();
  const { isDemoMode } = useDemoMode();

  const [isLoading, setIsLoading] = useState(true);
  const [displayTrades, setDisplayTrades] = useState([]);

  // Mock trades for empty state - memoize to prevent infinite rerenders
  const mockTrades = useMemo(
    () => [
      {
        id: "trade-1",
        positionId: "pos-123456",
        type: "open",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        country: {
          id: "1",
          name: "United States",
          flagUrl: "https://flagcdn.com/w40/us.png",
        },
        direction: "long",
        size: 500,
        leverage: 2,
        entryPrice: 25320,
        pnl: 0,
        fundingFee: 0,
      },
      {
        id: "trade-2",
        positionId: "pos-234567",
        type: "close",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        country: {
          id: "2",
          name: "China",
          flagUrl: "https://flagcdn.com/w40/cn.png",
        },
        direction: "short",
        size: 300,
        leverage: 3,
        entryPrice: 18250,
        exitPrice: 18050,
        pnl: 42.5,
        fundingFee: -3.2,
      },
      {
        id: "trade-3",
        positionId: "pos-345678",
        type: "liquidation",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        country: {
          id: "3",
          name: "Japan",
          flagUrl: "https://flagcdn.com/w40/jp.png",
        },
        direction: "long",
        size: 200,
        leverage: 5,
        entryPrice: 4850,
        exitPrice: 4600,
        pnl: -200,
        fundingFee: 1.5,
      },
    ],
    []
  );

  useEffect(() => {
    try {
      // Determine which trade history to use based on mode
      const historySource = isDemoMode
        ? demoTradeHistory || []
        : positionStore.tradeHistory || [];

      // Ensure historySource is an array
      if (!Array.isArray(historySource)) {
        console.error("History source is not an array:", historySource);
        setDisplayTrades([]);
        setIsLoading(false);
        return;
      }

      if (historySource.length > 0) {
        // Safely filter trades based on the mode
        const filteredHistory = isDemoMode
          ? historySource.filter(
              (trade) =>
                trade &&
                typeof trade === "object" &&
                trade.positionId &&
                typeof trade.positionId === "string" &&
                (trade.positionId.startsWith("demo-") ||
                  trade.positionId.startsWith("pos-"))
            )
          : historySource.filter(
              (trade) =>
                trade &&
                typeof trade === "object" &&
                trade.positionId &&
                typeof trade.positionId === "string" &&
                !trade.positionId.startsWith("demo-") &&
                !trade.positionId.startsWith("pos-")
            );

        setDisplayTrades(filteredHistory);
        setIsLoading(false);
      } else {
        // Use mock data if no real data is available
        setTimeout(() => {
          setDisplayTrades(mockTrades);
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error processing trade history:", error);
      setDisplayTrades([]);
      setIsLoading(false);
    }
  }, [isDemoMode, demoTradeHistory, positionStore.tradeHistory, mockTrades]);

  return { trades: displayTrades, isLoading };
}
