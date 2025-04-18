"use client";

import {
  PREDICTION_MARKET_ABI,
  getContractAddress,
  formatMarginAmount,
  formatTPSL,
  validateOpenPositionParams,
  validateContractAddress,
} from "@/lib/contracts/PredictionMarket";
import { toast } from "@/components/ui/utils/use-toast";
import { parseEther } from "viem";
import {
  handleError,
  handleValidationError,
  debugContractFunctionExecutionError,
} from "@/lib/error-handler";

/**
 * Service for interacting with the PredictionMarket contract
 * Provides methods for common operations with standardized error handling
 */
export class ContractService {
  // Check if we're connected to the right network
  static validateNetwork(chain: any) {
    if (!chain) {
      console.warn("No chain selected. Continuing in read-only/demo mode.");
      return false;
    }

    const isSepolia = chain.id === 11155111;

    // Get the contract address for debugging
    const contractAddress = getContractAddress(chain.id);
    console.log("Contract connection details:", {
      chainId: chain.id,
      chainName: chain.name,
      contractAddress,
      isSepolia,
      isValidAddress: validateContractAddress(contractAddress),
    });

    if (!isSepolia) {
      console.warn("Non-Sepolia network detected", {
        current: chain.name,
        required: "Sepolia",
        currentId: chain.id,
        requiredId: 11155111,
      });

      toast({
        title: "Network Warning",
        description: `You are on ${chain.name}. Please switch to Sepolia testnet for real transactions.`,
        variant: "destructive",
      });

      return false;
    }

    // Check if contract address is valid
    if (!validateContractAddress(contractAddress)) {
      console.warn("Contract address is not valid, using demo mode");
      return false;
    }

    console.log(
      "Connected to Sepolia with valid contract address:",
      contractAddress
    );
    return true;
  }

  // Open a position with standard error handling
  static async openPosition(
    openPosition: any, // contract write function
    chain: any,
    countryId: string,
    direction: "long" | "short",
    leverage: number,
    marginAmount: string,
    isDemoMode: boolean
  ) {
    try {
      // Ensure leverage is an integer
      if (!Number.isInteger(leverage)) {
        console.warn(
          `Non-integer leverage value (${leverage}) provided. Rounding to ${Math.round(
            leverage
          )}.`
        );
        leverage = Math.round(leverage);
      }

      // Verbose diagnostic logging - inspect all parameters and their types
      console.log("Opening Position Diagnostic Info:", {
        countryId: `${countryId} (${typeof countryId})`,
        direction: `${direction === "long"} (${typeof (direction === "long")})`,
        leverage: `${leverage} (${typeof leverage}, isInteger: ${Number.isInteger(
          leverage
        )})`,
        marginAmount: `${marginAmount} (${typeof marginAmount})`,
        isDemoMode: `${isDemoMode} (${typeof isDemoMode})`,
        chain: chain ? `${chain.name} (ID: ${chain.id})` : "undefined",
        timestamp: new Date().toISOString(),
      });

      // Check if connected to right network
      const isValidNetwork = this.validateNetwork(chain);

      // Make sure countryId is a string (not a number or other type)
      if (typeof countryId !== "string") {
        console.warn(
          `countryId must be a string, got ${typeof countryId}. Converting...`
        );
        countryId = String(countryId);
      }

      // Format parameters
      const value = formatMarginAmount(marginAmount);

      // Log value details to debug conversion issues
      console.log("Value after formatting:", {
        originalAmount: marginAmount,
        formattedValueBigInt: value,
        formattedValueString: value.toString(),
        hexValue: "0x" + value.toString(16),
      });

      const args = [countryId, direction === "long", leverage] as const;

      // Validate parameters
      const error = validateOpenPositionParams(
        countryId,
        direction === "long",
        leverage,
        value
      );

      if (error) {
        throw handleValidationError(error);
      }

      // Handle demo mode or real transaction
      let tx;

      // Skip the actual transaction in demo mode
      if (isDemoMode || !isValidNetwork) {
        console.log("Using demo mode for position opening");
        tx = { hash: "demo-tx-" + Date.now() };

        toast({
          title: "Demo Mode",
          description:
            "Transaction simulated in demo mode. Connect to Sepolia and disable demo mode for real transactions.",
        });

        return tx;
      }

      try {
        // Make sure value is provided correctly for payable function
        if (value <= BigInt(0)) {
          throw new Error("Margin amount must be greater than 0");
        }

        console.log("Attempting to send transaction with params:", {
          args,
          value,
          valueAsString: value.toString(),
          marginAmount,
        });

        // Check if openPosition is available
        if (!openPosition || typeof openPosition !== "function") {
          console.error(
            "openPosition function is not available:",
            openPosition
          );
          throw new Error(
            "Contract write function is not properly initialized"
          );
        }

        // Attempt to simulate the transaction first to catch errors early
        if (typeof openPosition.simulate === "function") {
          try {
            console.log("Simulating contract transaction before sending...");
            await openPosition.simulate({
              args,
              value,
            });
            console.log("Simulation successful, proceeding with transaction");
          } catch (simError) {
            console.error("Simulation failed:", simError);

            // Use the detailed error analysis
            if (
              simError.message &&
              simError.message.includes("ContractFunctionExecutionError")
            ) {
              const errorAnalysis =
                debugContractFunctionExecutionError(simError);
              console.error("Contract execution error details:", errorAnalysis);

              if (errorAnalysis.reason) {
                return {
                  error: true,
                  message: `Contract simulation failed: ${errorAnalysis.reason}`,
                  details: errorAnalysis,
                };
              }
            }

            return {
              error: true,
              message: simError.message || "Contract simulation failed",
              details: simError,
            };
          }
        }

        // Send the transaction
        try {
          tx = await openPosition({
            args,
            value,
          });
          console.log("Transaction submitted successfully:", tx);

          toast({
            title: "Transaction Sent",
            description:
              "Your position is being opened. Please wait for it to be confirmed.",
          });

          return tx;
        } catch (contractError) {
          // Use the detailed error analysis
          console.error("Contract execution error:", contractError);

          if (
            contractError.message &&
            contractError.message.includes("ContractFunctionExecutionError")
          ) {
            const errorAnalysis =
              debugContractFunctionExecutionError(contractError);
            console.error("Detailed error analysis:", errorAnalysis);

            if (errorAnalysis.reason) {
              toast({
                title: "Transaction Failed",
                description: `Contract error: ${errorAnalysis.reason}`,
                variant: "destructive",
              });

              return {
                error: true,
                message: `Contract error: ${errorAnalysis.reason}`,
                details: errorAnalysis,
              };
            }
          }

          // Handle other contract errors
          toast({
            title: "Transaction Failed",
            description:
              contractError.message || "Failed to execute transaction",
            variant: "destructive",
          });

          return {
            error: true,
            message: contractError.message || "Unknown contract error",
            details: contractError,
          };
        }
      } catch (error: any) {
        console.error("Transaction error details:", {
          name: error.name,
          message: error.message,
          code: error.code,
          reason: error.reason,
          data: error.data,
        });

        if (error.message && error.message.includes("reverted")) {
          const reasonMatch = error.message.match(/reverted: ([^"]+)/);
          if (reasonMatch && reasonMatch[1]) {
            throw new Error(`Contract Error: ${reasonMatch[1]}`);
          }
        }

        throw error;
      }
    } catch (error: any) {
      // Use standardized error handling
      handleError(error, "Failed to open position");
      throw error;
    }
  }

  // Close a position with standard error handling
  static async closePosition(
    closePosition: any, // contract write function
    positionId: bigint,
    isDemoMode: boolean
  ) {
    try {
      // Handle demo mode
      if (isDemoMode) {
        console.log(
          "Demo mode active: simulating position close for",
          positionId.toString()
        );

        toast({
          title: "Position Closed (Demo)",
          description: "Your demo position has been closed successfully.",
        });

        return { hash: "demo-tx-close-" + Date.now() };
      }

      // Add global error handling for all close operations
      if (!closePosition) {
        console.warn("No closePosition function available");
        toast({
          title: "Operation unavailable",
          description:
            "The close position function is not currently available. Try again later.",
        });
        return {
          error: true,
          message: "Close position function unavailable",
          positionId: positionId.toString(),
        };
      }

      // Execute real transaction
      let tx;
      try {
        console.log(
          "Attempting to close position with ID:",
          positionId.toString()
        );

        // Modify the wagmi/viem contract call to catch errors early
        // Use a custom implementation that doesn't throw errors
        if (typeof closePosition.simulate === "function") {
          try {
            await closePosition.simulate({
              args: [positionId],
            });
          } catch (simError) {
            // If simulation failed, check if position already closed
            if (
              simError.message &&
              simError.message.includes("Position already closed")
            ) {
              console.log("Position already closed - caught in simulation");
              toast({
                title: "Position Already Closed",
                description:
                  "This position has already been closed. Updating your positions...",
              });
              return { alreadyClosed: true, positionId: positionId.toString() };
            }

            // For other simulation errors, return error object instead of throwing
            console.error("Simulation failed:", simError);
            toast({
              title: "Transaction Simulation Failed",
              description: simError.message || "Could not simulate transaction",
              variant: "destructive",
            });
            return {
              error: true,
              message: simError.message,
              positionId: positionId.toString(),
            };
          }
        }

        // CRITICAL: Wrap in try/catch to prevent errors from propagating
        try {
          tx = await closePosition({
            args: [positionId],
          });
          console.log("Close position transaction submitted successfully:", tx);
        } catch (contractError) {
          // Handle contract errors without throwing
          console.error("Contract interaction error:", contractError);

          // Check if position already closed
          if (
            contractError.message &&
            contractError.message.includes("Position already closed")
          ) {
            toast({
              title: "Position Already Closed",
              description:
                "This position has already been closed. Updating your positions...",
            });
            return { alreadyClosed: true, positionId: positionId.toString() };
          }

          // Handle other contract errors
          toast({
            title: "Transaction Failed",
            description:
              contractError.message || "Failed to execute transaction",
            variant: "destructive",
          });
          return {
            error: true,
            message: contractError.message,
            positionId: positionId.toString(),
          };
        }
      } catch (error) {
        // Final catch for any other errors
        console.error("Error in closePosition:", error);

        // Check if position already closed
        if (
          error.message &&
          error.message.includes("Position already closed")
        ) {
          console.log("Position was already closed, updating UI state");
          toast({
            title: "Position Already Closed",
            description:
              "This position has already been closed. Refreshing your positions...",
          });

          // Return a special object to indicate position was already closed
          return { alreadyClosed: true, positionId: positionId.toString() };
        }

        // Return error object instead of throwing
        return {
          error: true,
          message: error.message || "Unknown error",
          positionId: positionId.toString(),
        };
      }

      // Transaction successful
      toast({
        title: "Position Closed",
        description: "Your position has been closed successfully.",
      });

      return tx;
    } catch (error) {
      // This should never be reached, but just in case
      console.error("Unexpected error in closePosition:", error);
      return {
        error: true,
        message: "Unexpected error in closePosition",
        positionId: positionId.toString(),
      };
    }
  }

  // Set TP/SL with standard error handling
  static async setTPSL(
    setTPSL: any, // contract write function
    chain: any,
    positionId: bigint,
    takeProfit: number,
    stopLoss: number,
    isDemoMode: boolean
  ) {
    try {
      // Format TP/SL values
      const { takeProfit: tp, stopLoss: sl } = formatTPSL(takeProfit, stopLoss);

      // Log action
      console.log("Setting TP/SL:", {
        positionId: positionId.toString(),
        takeProfit,
        stopLoss,
        demoMode: isDemoMode,
      });

      let tx;

      // Use demo mode if enabled or not on Sepolia
      if (isDemoMode || chain?.id !== 11155111) {
        console.log("Demo mode active: simulating setTPSL");

        // Simulate a transaction
        tx = { hash: "demo-tx-tpsl-" + Date.now() };

        toast({
          title: "TP/SL Set (Demo)",
          description: "Take profit and stop loss have been set in demo mode.",
        });
      } else {
        // Execute actual transaction
        try {
          console.log("Attempting to set TP/SL with params:", {
            positionId: positionId.toString(),
            takeProfit: tp.toString(),
            stopLoss: sl.toString(),
          });
          tx = await setTPSL({
            args: [positionId, tp, sl],
          });
          console.log("Set TP/SL transaction submitted successfully:", tx);
        } catch (error: any) {
          console.error("Set TP/SL transaction error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            reason: error.reason,
            data: error.data,
          });
          throw error;
        }

        toast({
          title: "TP/SL Set",
          description: "Take profit and stop loss have been set successfully.",
        });
      }

      return tx;
    } catch (error: any) {
      // Use standardized error handling
      handleError(error, "Failed to set take profit and stop loss");
      throw error;
    }
  }
}
