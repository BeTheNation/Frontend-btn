"use client";

import { useAccount, useBalance, useNetwork, useDisconnect } from "wagmi";
import { useEffect } from "react";

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  // Clear pending balance updates when actual balance changes
  // and store the latest balance in localStorage
  useEffect(() => {
    if (balance && isConnected) {
      // If we have a real balance update from the blockchain, clear any pending UI updates
      // This ensures we revert to using the actual blockchain state
      sessionStorage.removeItem("pendingBalanceUpdate");

      // Store the current balance in localStorage for use across components
      window.localStorage.setItem("lastKnownBalance", balance.formatted);

      console.log(
        "Real balance updated, cleared pending updates, stored last known balance:",
        balance.formatted
      );
    }
  }, [balance, isConnected]);

  return {
    address,
    isConnected,
    chain,
    balance,
    disconnect,
  };
}
