"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { useDemoMode } from "@/hooks/useDemoMode";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/utils/use-toast";
import { Button } from "./button";
import { useEffect } from "react";

export default function BalanceDisplay() {
  const { isDemoMode, demoBalance } = useDemoMode();
  const { isConnected, balance } = useWeb3();
  const { toast } = useToast();

  // Format balance for display
  const getDisplayBalance = () => {
    // Demo mode - use the simple demo balance
    if (isDemoMode) {
      return `${demoBalance.toFixed(2)} DEMO`;
    }

    // Testnet mode with connected wallet
    if (isConnected && balance) {
      // Check if we have a pending balance update in sessionStorage
      const pendingUpdate = sessionStorage.getItem("pendingBalanceUpdate");

      if (pendingUpdate && !isNaN(parseFloat(pendingUpdate))) {
        // Use the pending update for immediate UI feedback
        return `${parseFloat(pendingUpdate).toFixed(4)} ${balance.symbol}`;
      }

      // Otherwise use the real balance
      const value = parseFloat(balance.formatted);
      return `${value.toFixed(4)} ${balance.symbol}`;
    }

    return "0.00 USDC";
  };

  // Set up a timer to refresh the balance display
  useEffect(() => {
    // Check for balance updates every 2 seconds
    const timer = setInterval(() => {
      const displayElement = document.getElementById("balance-display");
      if (displayElement) {
        displayElement.innerText = getDisplayBalance();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [isDemoMode, demoBalance, isConnected, balance]);

  const clearAllStorage = () => {
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage
    sessionStorage.clear();

    toast({
      title: "All data cleared",
      description: "All stored data has been cleared. Please refresh the page.",
      variant: "destructive",
    });
    // Force page reload
    setTimeout(() => {
      window.location.href = "/dashboard?reset=true";
    }, 1000);
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2 flex items-center">
      <span className="text-gray-400 mr-2">Balance:</span>
      <span id="balance-display" className="font-semibold">
        {getDisplayBalance()}
      </span>
      {isDemoMode && (
        <span className="ml-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
          Demo
        </span>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={clearAllStorage}
        className="ml-3 h-7 text-xs"
      >
        Reset Data
      </Button>
    </div>
  );
}
