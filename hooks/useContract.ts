"use client";

import { useContractWrite, useContractRead, useNetwork } from "wagmi";
import {
  PREDICTION_MARKET_ABI,
  getContractAddress,
  formatPosition,
  contractPositionToPosition,
  validateContractAddress,
} from "@/lib/contracts/PredictionMarket";
import type { Position } from "@/lib/contracts/types";
import { useToast } from "@/components/ui/use-toast";
import { useCountries, type Country } from "@/hooks/useCountries";
import { useDemoModeContext } from "@/contexts/DemoModeContext";
import { ContractService } from "@/services/contract";

/**
 * Hook for interacting with the smart contract
 * Uses the ContractService for standardized operations
 */
export function useContract() {
  const { chain } = useNetwork();
  const { toast } = useToast();
  const { countries } = useCountries();
  const { isDemoMode } = useDemoModeContext();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;

  // Add debug logging
  console.debug("Contract initialization:", {
    chainId: chain?.id,
    chainName: chain?.name,
    contractAddress,
    isContractValid: validateContractAddress(contractAddress),
    isDemoMode,
  });

  // Display contract status in console
  if (validateContractAddress(contractAddress) && chain?.id === 11155111) {
    console.log(
      "%c✅ SEPOLIA CONTRACT CONNECTED",
      "color: green; font-weight: bold"
    );
    console.log(`Using contract at: ${contractAddress}`);
  }

  // Contract write hooks
  const { writeAsync: openPositionWrite } = useContractWrite({
    address: contractAddress,
    abi: PREDICTION_MARKET_ABI,
    functionName: "openPosition",
  });

  const { writeAsync: closePositionWrite } = useContractWrite({
    address: contractAddress,
    abi: PREDICTION_MARKET_ABI,
    functionName: "closePosition",
  });

  const { writeAsync: setTPSLWrite } = useContractWrite({
    address: contractAddress,
    abi: PREDICTION_MARKET_ABI,
    functionName: "setTPSL",
  });

  // Contract read hooks
  const { data: position, refetch: refetchPosition } = useContractRead({
    address: contractAddress,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getPosition",
    enabled: false,
  });

  // Debug contract interaction errors
  const debugContractError = (error: any, functionName: string) => {
    console.error(`Contract Error in ${functionName}:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      data: error.data,
    });

    // Check if the error is from contract reversion and extract the reason
    if (
      error.message &&
      error.message.includes("ContractFunctionExecutionError")
    ) {
      const reasonMatch = error.message.match(/reason="([^"]+)"/);
      if (reasonMatch && reasonMatch[1]) {
        console.error(`Contract reverted with reason: ${reasonMatch[1]}`);
        return `Contract Error: ${reasonMatch[1]}`;
      }
    }

    return error.message || "Unknown contract error";
  };

  // Simplified wrapper methods using the service
  const handleOpenPosition = async (
    countryId: string,
    direction: "long" | "short",
    leverage: number,
    marginAmount: string
  ) => {
    try {
      console.log("Opening position with params:", {
        countryId,
        direction,
        leverage,
        marginAmount,
        isDemoMode,
      });

      // Make sure we have the right parameter types - contract expects specific types
      if (typeof countryId !== "string") {
        throw new Error(`countryId must be a string, got ${typeof countryId}`);
      }

      if (typeof leverage !== "number" || !Number.isInteger(leverage)) {
        console.warn(
          `leverage must be an integer, got ${leverage}. Rounding to ${Math.round(
            leverage
          )}`
        );
        leverage = Math.round(leverage);
      }

      if (leverage < 1 || leverage > 5) {
        throw new Error(`leverage must be between 1 and 5, got ${leverage}`);
      }

      return await ContractService.openPosition(
        openPositionWrite,
        chain,
        countryId,
        direction,
        leverage,
        marginAmount,
        isDemoMode
      );
    } catch (error: any) {
      const errorMessage = debugContractError(error, "handleOpenPosition");
      console.error("Open position failed:", errorMessage);

      // Create a more structured error object that can be handled by callers
      const errorObj = {
        error: true,
        message: errorMessage,
        details: error,
      };

      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return errorObj;
    }
  };

  const handleClosePosition = async (positionId: bigint) => {
    // Don't use try/catch here to avoid console errors
    // Instead, rely on ContractService to return proper result/error objects
    console.log(
      "Starting closePosition for position ID:",
      positionId.toString()
    );

    const result = await ContractService.closePosition(
      closePositionWrite,
      positionId,
      isDemoMode
    );

    console.log("closePosition result:", result);

    // Return the result directly - ContractService will handle all error cases
    // and return appropriate objects instead of throwing
    return result;
  };

  const handleSetTPSL = async (
    positionId: bigint,
    takeProfit: number,
    stopLoss: number
  ) => {
    return await ContractService.setTPSL(
      setTPSLWrite,
      chain,
      positionId,
      takeProfit,
      stopLoss,
      isDemoMode
    );
  };

  // Get position details
  const getPosition = async (positionId: bigint): Promise<Position | null> => {
    try {
      const data = await refetchPosition();
      if (!data.data) return null;

      const contractPos = formatPosition(data.data);
      const countryData = countries.find(
        (c: Country) => c.id === contractPos.countryId
      );
      if (!countryData) return null;

      return contractPositionToPosition(contractPos, countryData);
    } catch (error) {
      console.error("Error fetching position:", error);
      return null;
    }
  };

  return {
    handleOpenPosition,
    handleClosePosition,
    handleSetTPSL,
    getPosition,
  };
}
