"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/hooks/useWeb3";
import { useDemoMode } from "@/hooks/useDemoMode";

interface PredictionMarketContextType {
  isLoading: boolean;
  isDemo: boolean;
  contractHandler: any;
  error: string | null;
}

const PredictionMarketContext = createContext<PredictionMarketContextType>({
  isLoading: true,
  isDemo: true,
  contractHandler: null,
  error: null,
});

export function PredictionMarketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const contractHandler = useContract();
  const { isConnected } = useWeb3();
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading state based on contract handler availability
    setIsLoading(!contractHandler && !isDemoMode);

    // Set error state if not connected and not in demo mode
    if (!isConnected && !isDemoMode) {
      setError("Please connect your wallet or use demo mode");
    } else {
      setError(null);
    }
  }, [contractHandler, isDemoMode, isConnected]);

  return (
    <PredictionMarketContext.Provider
      value={{
        isLoading,
        isDemo: isDemoMode,
        contractHandler,
        error,
      }}
    >
      {children}
    </PredictionMarketContext.Provider>
  );
}

export function usePredictionMarketContext() {
  return useContext(PredictionMarketContext);
}
