"use client";

import {
  useContractWrite,
  useContractRead,
  useNetwork,
  useAccount,
  useWaitForTransaction,
  useContractReads,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  getContractAddress,
  getPredictionMarketContract,
  openPosition as contractOpenPosition,
  closePosition as contractClosePosition,
  setTPSL,
  contractPositionToPosition,
  validateContractAddress,
  getUSDCContract,
  approveUSDC,
  formatMarginAmount,
  // To avoid circular dependency, use direct imports in functions that need them
  // instead of from global imports above
  // CONTRACT_ADDRESSES,
  // USDC_ADDRESSES,
} from "@/lib/contracts/PredictionMarket";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts/constants";
import type { Position } from "@/lib/contracts/types";
import { useToast } from "@/components/ui/use-toast";
import { useCountries, type Country } from "@/hooks/useCountries";
import { useDemoModeContext } from "@/contexts/DemoModeContext";
import { ContractService } from "@/services/contract";
import {
  decodeViemError,
  handleContractFunctionExecutionError,
  debugContractError,
} from "@/lib/viem-error-decoder";
import { useCallback, useEffect, useState } from "react";
import { generateId } from "@/lib/utils";
import {
  formatContractError,
  handleError,
  ErrorType,
} from "@/lib/error-handler";
import PredictionMarket_Abi from "@/lib/abi/PredictionMarket.json";

/**
 * Hook for interacting with the smart contract
 * Uses the ContractService for standardized operations
 */
export function useContract() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const { countries } = useCountries();
  const { isDemoMode, setDemoModeBasedOnNetwork } = useDemoModeContext();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;
  const predictionContract = contractAddress;

  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update demo mode based on network
  useEffect(() => {
    if (chain?.id) {
      // Override demo mode based on network
      setDemoModeBasedOnNetwork(chain.id);
    }
  }, [chain?.id, setDemoModeBasedOnNetwork]);

  // Add enhanced debug logging
  console.log("🧪 isDemoMode:", isDemoMode, "Chain ID:", chain?.id);

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

  // Contract write hooks - using wagmi v1 pattern
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

  // Clear any previous errors
  const clearError = () => setError(null);

  // Enhanced contract call wrapper with better error handling
  const callContractWithErrorHandling = async <T>(
    contractFn: () => Promise<T>,
    errorContext: string
  ): Promise<{
    success: boolean;
    result?: T;
    error?: string | null;
    code?: string;
  }> => {
    try {
      setIsLoading(true);
      clearError();

      const result = await contractFn();

      return { success: true, result };
    } catch (err: any) {
      console.error(`${errorContext} error:`, err);
      console.error(
        "Full error details:",
        JSON.stringify(
          {
            name: err.name,
            message: err.message,
            code: err.code,
            details: err.details || null,
            cause: err.cause
              ? {
                  name: err.cause.name,
                  message: err.cause.message,
                  code: err.cause.code,
                }
              : null,
          },
          null,
          2
        )
      );

      // Format the error for UI display
      const formattedError = formatContractError(err);
      const errorMessage = formattedError.message;

      setError(errorMessage);

      // Check if it's a ContractFunctionExecutionError
      if (
        err.name === "ContractFunctionExecutionError" ||
        (err.message && err.message.includes("ContractFunctionExecutionError"))
      ) {
        // Extract error data from error object
        let errorName: string | null = null;

        // Try to extract custom error name
        if (err.details) {
          const match = err.details.match(/error=([A-Za-z0-9_]+)/);
          errorName = match ? match[1] : null;
        }

        // Try to extract from error.cause
        if (!errorName && err.cause?.error?.data) {
          // Error data often contains the function selector in the first 10 characters
          const errorData = err.cause.error.data;
          console.log("Error data:", errorData);

          // Common error selectors for our contract
          if (errorData.includes("0x10560cbd")) {
            errorName = "PositionDoesNotExist";
          } else if (errorData.includes("0x30cd7471")) {
            errorName = "NotTheOwner";
          } else if (errorData.includes("0xb11864fc")) {
            errorName = "Liquidated";
          }
        }

        // Map error names to user-friendly messages
        if (errorName) {
          if (errorName === "PositionDoesNotExist") {
            return {
              success: false,
              error: "This position does not exist or has already been closed",
              code: "POSITION_NOT_FOUND",
            };
          } else if (errorName === "NotTheOwner") {
            return {
              success: false,
              error: "You don't have permission to modify this position",
              code: "NOT_OWNER",
            };
          } else if (errorName === "Liquidated") {
            return {
              success: false,
              error: "This position has been liquidated",
              code: "LIQUIDATED",
            };
          }
        }

        // Default error handling using the decoder
        const decodedError = handleContractFunctionExecutionError(err);
        return {
          success: false,
          error: decodedError.message,
          code: decodedError.code || "CONTRACT_ERROR",
        };
      }

      // Check for UserRejectedRequestError
      if (err.code === 4001 || err.name === "UserRejectedRequestError") {
        return {
          success: false,
          error: "Transaction was rejected by the user",
          code: "USER_REJECTED",
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Open a new position with enhanced error handling
  const openPosition = async (
    countryId: string,
    side: "long" | "short",
    leverage: number,
    size: string
  ) => {
    // Ensure we're on Base Sepolia and not in demo mode
    if (chain?.id !== 84532) {
      console.warn(
        "🚨 Demo mode or wrong network detected! Please switch to Base Sepolia (chainId 84532) to proceed with live transactions."
      );
      toast({
        title: "Network Error",
        description:
          "You're on the wrong network. Switch to Base Sepolia to execute live orders!",
        variant: "destructive",
      });
      return {
        success: false,
        error: "Wrong network. Must use Base Sepolia (chainId 84532)",
        code: "WRONG_NETWORK",
      };
    }

    if (isDemoMode) {
      console.warn(
        "🚨 Demo mode active! Please disable demo mode to proceed with live transactions."
      );
      toast({
        title: "Demo Mode Active",
        description: "You're in DEMO MODE. Disable it to execute live orders!",
        variant: "destructive",
      });
      return {
        success: false,
        error: "Demo mode active. Please disable to use real transactions",
        code: "DEMO_MODE_ACTIVE",
      };
    }

    // Validasi input
    if (
      !countryId ||
      !["long", "short"].includes(side) ||
      leverage <= 0 ||
      !size ||
      parseFloat(size) <= 0
    ) {
      throw new Error("Invalid parameters");
    }

    try {
      // Get contract instance
      if (!publicClient || !walletClient || !contractAddress) {
        throw new Error("Contract or wallet not initialized");
      }

      // Construct contract instance
      const contract = {
        estimateGas: {
          openPosition: async (
            countryId: string,
            direction: number,
            leverage: number,
            size: bigint
          ) => {
            return await publicClient.estimateContractGas({
              address: contractAddress as `0x${string}`,
              abi: PREDICTION_MARKET_ABI,
              functionName: "openPosition",
              account: address,
              args: [countryId, direction, leverage, size],
            });
          },
        },
        write: {
          openPosition: async ({
            args,
            gas,
          }: {
            args: [string, number, number, bigint];
            gas: bigint;
          }) => {
            return await walletClient.writeContract({
              address: contractAddress as `0x${string}`,
              abi: PREDICTION_MARKET_ABI,
              functionName: "openPosition",
              args,
              gas,
            });
          },
        },
      };

      // Tambahkan estimasi gas
      const gasEstimation = await contract.estimateGas.openPosition(
        countryId,
        side === "long" ? 0 : 1,
        Math.floor(leverage * 10),
        formatMarginAmount(size)
      );

      // Log transaction details before sending
      console.log("📊 TRANSACTION FLOW - STEP 1: OPENING POSITION", {
        network: chain?.name,
        chainId: chain?.id,
        contractAddress,
        countryId,
        direction: side,
        leverage,
        sizeOriginal: size,
        sizeFormatted: formatMarginAmount(size).toString(),
        userAddress: address,
        gasEstimation: gasEstimation.toString(),
        isDemoMode,
      });

      // Add gas estimation with buffer
      const tx = await contract.write.openPosition({
        args: [
          countryId,
          side === "long" ? 0 : 1,
          Math.floor(leverage * 10),
          formatMarginAmount(size),
        ],
        gas: BigInt(Math.floor(Number(gasEstimation) * 1.2)),
      });

      console.log("📊 TRANSACTION FLOW - STEP 2: POSITION OPENED", {
        txHash: tx,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Position Opening",
        description:
          "Transaction submitted to blockchain. Updating positions...",
      });

      // Here we would trigger position update
      // This could be done by dispatching an event or calling a function

      return tx;
    } catch (error) {
      console.error("Contract call error:", error);
      throw error;
    }
  };

  // Close position with enhanced error handling
  const closePosition = async (positionId: string) => {
    return callContractWithErrorHandling(async () => {
      console.log("Closing position:", { positionId, isDemoMode });
      setIsLoading(true);
      setError(null);

      // Check if this is a demo position ID (starts with "demo-")
      if (positionId.startsWith("demo-") || isDemoMode) {
        // Demo mode position closing is handled elsewhere
        console.log(
          "Demo position detected - should be closed via demo context"
        );
        setIsLoading(false);
        return {
          success: false,
          error: "Use demo mode methods to close this position",
          code: "DEMO_POSITION",
        };
      }

      // For real mode, make the contract call
      if (!predictionContract) throw new Error("Contract not initialized");
      if (!address) throw new Error("Wallet not connected");

      try {
        // The contract expects the position ID, not just the user's address
        console.log("📊 TRANSACTION FLOW - STEP 1: CLOSING POSITION", {
          positionId,
          userAddress: address,
          contractAddress,
          network: chain?.name,
          chainId: chain?.id,
          timestamp: new Date().toISOString(),
          isDemoMode,
        });

        // Simulate the transaction first to catch pre-execution errors
        try {
          if (publicClient && contractAddress) {
            console.log("Simulating closePosition transaction before sending");
            await publicClient.simulateContract({
              address: contractAddress as `0x${string}`,
              abi: PREDICTION_MARKET_ABI,
              functionName: "closePosition",
              account: address,
              args: [BigInt(positionId)], // Convert positionId to BigInt
            });
            console.log("Simulation successful");
          }
        } catch (simError: any) {
          debugContractError(simError, "Contract Simulation Error");

          // Check for specific simulation errors
          if (simError.message) {
            // Position doesn't exist or is already closed
            if (
              simError.message.includes("PositionDoesNotExist") ||
              simError.message.includes("Position closed") ||
              (simError.cause?.error?.data &&
                simError.cause.error.data.includes("0x10560cbd"))
            ) {
              return {
                success: false,
                error:
                  "This position does not exist or has already been closed",
                code: "POSITION_NOT_FOUND",
              };
            }
          }

          // Re-throw for main error handler to process
          throw simError;
        }

        // Use wagmi v1 pattern for contract write with improved config
        const txHash = await closePositionWrite({
          args: [BigInt(positionId)], // Convert positionId to BigInt
          gas: BigInt(500000), // Set a higher gas limit to avoid estimation issues
          onError: (error) => {
            debugContractError(error, "Contract Error During Write");
          },
        });

        console.log("📊 TRANSACTION FLOW - STEP 2: POSITION CLOSED", {
          txHash: txHash.hash,
          timestamp: new Date().toISOString(),
        });

        // Display a toast notification for the pending transaction
        toast({
          title: "Transaction Submitted",
          description:
            "Position closing transaction has been sent to the blockchain",
        });

        // Wait for transaction confirmation
        const receipt = await txHash.wait();

        console.log(
          "📊 TRANSACTION FLOW - STEP 3: POSITION CLOSURE CONFIRMED",
          {
            txReceipt: receipt,
            timestamp: new Date().toISOString(),
          }
        );

        // Successful transaction toast
        toast({
          title: "Position Closed",
          description: "Your position has been successfully closed",
          variant: "default",
        });

        // Trigger P&L calculation and balance update
        console.log("📊 TRANSACTION FLOW - STEP 4: UPDATING P&L AND BALANCE", {
          positionId,
          timestamp: new Date().toISOString(),
        });

        // This is where you would trigger P&L calculation and balance updates
        // through your store or other mechanisms

        // Update transaction history
        console.log(
          "📊 TRANSACTION FLOW - STEP 5: UPDATING TRANSACTION HISTORY",
          {
            type: "POSITION_CLOSED",
            positionId,
            timestamp: new Date().toISOString(),
          }
        );

        // This is where you would update transaction history

        setIsLoading(false);
        return {
          success: true,
          txHash: txHash.hash,
          data: receipt,
        };
      } catch (err: any) {
        // Use our dedicated debug function
        debugContractError(err, "Close Position Error");
        setIsLoading(false);

        // Check for specific contract errors by examining error message patterns
        if (err.message) {
          // Position doesn't exist or is already closed
          if (
            err.message.includes("PositionDoesNotExist") ||
            err.message.includes("Position closed") ||
            (err.cause?.error?.data &&
              err.cause.error.data.includes("0x10560cbd"))
          ) {
            return {
              success: false,
              error: "This position does not exist or has already been closed",
              code: "POSITION_NOT_FOUND",
            };
          }

          // Not the position owner
          if (
            err.message.includes("NotTheOwner") ||
            err.message.includes("Not position owner") ||
            (err.cause?.error?.data &&
              err.cause.error.data.includes("0x30cd7471"))
          ) {
            return {
              success: false,
              error: "You are not the owner of this position",
              code: "NOT_OWNER",
            };
          }

          // Position liquidated
          if (
            err.message.includes("Liquidated") ||
            (err.cause?.error?.data &&
              err.cause.error.data.includes("0xb11864fc"))
          ) {
            return {
              success: false,
              error: "This position has been liquidated",
              code: "LIQUIDATED",
            };
          }

          // User rejected transaction
          if (
            err.message.includes("User denied") ||
            err.message.includes("User rejected")
          ) {
            return {
              success: false,
              error: "Transaction was rejected",
              code: "USER_REJECTED",
            };
          }

          // Gas estimation errors
          if (
            err.message.includes("gas required exceeds") ||
            err.code === "UNPREDICTABLE_GAS_LIMIT"
          ) {
            return {
              success: false,
              error:
                "Transaction may fail. Please check your inputs or try again later.",
              code: "GAS_ESTIMATION_FAILED",
            };
          }

          // Network errors
          if (
            err.message.includes("network") ||
            err.message.includes("timeout")
          ) {
            return {
              success: false,
              error:
                "Network error. Please check your connection and try again.",
              code: "NETWORK_ERROR",
            };
          }
        }

        // Try to extract the revert reason using the structured decoder
        if (
          err.name === "ContractFunctionExecutionError" ||
          (err.message &&
            err.message.includes("ContractFunctionExecutionError"))
        ) {
          const decodedError = handleContractFunctionExecutionError(err);
          return {
            success: false,
            error: decodedError.message || "Contract error",
            code: decodedError.code,
          };
        }

        // If we got here, it's a generic error
        return {
          success: false,
          error: formatContractError(err).message || "Unknown error",
        };
      }
    }, "Close position");
  };

  const handleSetTPSL = async (takeProfit: number, stopLoss: number) => {
    try {
      console.log("Setting TP/SL:", { takeProfit, stopLoss, isDemoMode });
      setIsLoading(true);
      setError(null);

      if (isDemoMode) {
        console.log("TP/SL not supported in demo mode");
        setIsLoading(false);
        return { success: false, error: "TP/SL not supported in demo mode" };
      }

      // For real mode, make the contract call
      if (!chain) throw new Error("No chain selected");
      if (!predictionContract) throw new Error("Contract not initialized");

      // Use wagmi v1 pattern for contract write
      const txHash = await setTPSLWrite({
        args: [takeProfit, stopLoss],
      });

      console.log("Transaction sent:", txHash.hash);

      // Wait for transaction confirmation
      const receipt = await txHash.wait();

      console.log("Transaction receipt:", receipt);

      setIsLoading(false);
      return { success: true, data: receipt };
    } catch (error) {
      setIsLoading(false);
      const result = handleContractError(error);
      throw new Error(result.error);
    }
  };

  // Get position details
  const getPosition = async (positionId: bigint): Promise<Position | null> => {
    console.log("Getting position:", positionId);
    try {
      const data = await refetchPosition();
      if (!data.data) return null;

      const contractPos = data.data;
      if (contractPos.positionId.toString() !== positionId.toString()) {
        console.warn("Position ID mismatch:", {
          requested: positionId.toString(),
          received: contractPos.positionId.toString(),
        });
      }

      const countryData = countries.find(
        (c: Country) => c.id === contractPos.countryId
      );
      if (!countryData) return null;

      return contractPositionToPosition(contractPos, countryData);
    } catch (error) {
      handleContractError(error);
      return null;
    }
  };

  // Get all positions owned by the current user
  const getPositions = async (): Promise<Position[]> => {
    console.log("Getting all positions");
    try {
      // For now, return empty array - implement actual logic later
      return [];
    } catch (error) {
      handleContractError(error);
      return [];
    }
  };

  // Helper to approve USDC for contract
  const approveUSDCForContract = async (
    amount: string,
    contractAddress: string
  ): Promise<any> => {
    try {
      console.log("Approving USDC:", {
        amount,
        contractAddress,
        isDemoMode,
      });
      setIsLoading(true);
      setError(null);

      if (isDemoMode) {
        console.log("Approval not needed in demo mode");
        setIsLoading(false);
        return { success: true, demo: true };
      }

      if (!chain) throw new Error("No chain selected");
      if (!validateContractAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      const usdcContract = getUSDCContract(walletClient, chain?.id);
      const amountBigInt = formatMarginAmount(amount); // Convert to proper format

      // Make the contract call
      const response = await approveUSDC(
        usdcContract,
        contractAddress as `0x${string}`,
        amountBigInt
      );

      console.log("Approve USDC response:", response);

      // Set approved state
      setIsApproved(true);
      setIsLoading(false);
      return { success: true, data: response };
    } catch (error) {
      setIsLoading(false);
      const result = handleContractError(error);
      throw new Error(result.error);
    }
  };

  // Enhanced error handler with better ContractFunctionExecutionError support
  const handleContractError = (
    err: any
  ): { success: false; error: string; code?: string } => {
    console.error("Contract error:", err);

    // Check if this is a ContractFunctionExecutionError, which requires special handling
    if (
      err.name === "ContractFunctionExecutionError" ||
      (err.message && err.message.includes("ContractFunctionExecutionError"))
    ) {
      const decodedError = handleContractFunctionExecutionError(err);
      return {
        success: false,
        error: decodedError.message,
        code: decodedError.code,
      };
    }

    // Check for USDC allowance errors
    if (
      err.code === "INSUFFICIENT_ALLOWANCE" ||
      (err.message &&
        (err.message.includes("allowance") ||
          err.message.includes("0xfb8f41b2") ||
          err.message.includes("ERC20InsufficientAllowance")))
    ) {
      return {
        success: false,
        error: "USDC approval required before opening a position",
        code: "INSUFFICIENT_ALLOWANCE",
      };
    }

    // For transaction rejected by user
    if (
      err.code === "ACTION_REJECTED" ||
      (err.message && err.message.includes("User denied"))
    ) {
      return {
        success: false,
        error: "Transaction rejected by user",
        code: "USER_REJECTED",
      };
    }

    // For other types of errors, just return the message
    return {
      success: false,
      error: err.message || "Unknown contract error",
    };
  };

  console.log("Contract address:", contractAddress);
  console.log("Current chain ID:", chain?.id);

  // Clear status message about demo mode
  console.log(
    `%c${
      isDemoMode ? "🚨 DEMO MODE ACTIVE" : "✅ LIVE MODE - REAL TRANSACTIONS"
    } (Chain: ${chain?.name || "Not Connected"}, ID: ${chain?.id || "None"})`,
    `color: ${
      isDemoMode ? "orange" : "green"
    }; font-weight: bold; font-size: 14px;`
  );

  return {
    openPosition,
    closePosition,
    setTPSL,
    getPosition,
    getPositions,
    approveUSDCForContract,
    error,
    isLoading,
    isApproved,
    clearError,
    handleClosePosition: closePosition,
    handleSetTPSL: handleSetTPSL,
  };
}
