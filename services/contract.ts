"use client";

import {
  PREDICTION_MARKET_ABI,
  getContractAddress,
  formatMarginAmount,
  formatTPSL,
  validateOpenPositionParams,
  validateContractAddress,
  getUSDCAddress,
  approveUSDC,
} from "@/lib/contracts/PredictionMarket";
import { toast } from "@/components/ui/use-toast";
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

  /**
   * Open a new position
   *
   * @param openPosition Contract write function for opening position
   * @param chain Current chain information
   * @param countryId Country ID to trade
   * @param direction Position direction (long/short)
   * @param leverage Position leverage (1-5)
   * @param marginAmount Amount to use as margin, in string format
   * @param isDemoMode Whether we're in demo mode
   * @returns Result object with transaction data or error
   */
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
      console.log("Opening position:", {
        countryId,
        direction,
        leverage,
        marginAmount,
        isDemoMode,
      });

      // If in demo mode, simulate successful transaction
      if (isDemoMode) {
        console.log("Demo mode: Simulating position open");
        return {
          success: true,
          hash: `demo-tx-open-${Date.now()}`,
          countryId,
          direction,
          leverage,
          marginAmount,
        };
      }

      // Validate network
      if (!this.validateNetwork(chain)) {
        return {
          error: true,
          message: "Unsupported network. Please switch to Sepolia Testnet.",
        };
      }

      // Make sure country ID is valid
      if (!countryId || countryId.trim() === "") {
        return {
          error: true,
          message: "Invalid country ID",
        };
      }

      // Convert direction to numeric enum value
      const directionValue = direction === "long" ? 0 : 1;

      // Parse the margin amount to wei
      const size = parseEther(marginAmount);

      // First, approve USDC spending (if we're not in a mock environment)
      try {
        // If we're in a browser environment, the user will need to approve USDC first
        // This would typically be handled through a separate UI action
        console.log(
          "⚠️ IMPORTANT: Make sure to approve USDC spending before opening a position"
        );
        console.log(
          `Use the PredictionMarket UI to approve at least ${marginAmount} USDC for the contract`
        );
        console.log(`Contract address: ${getContractAddress(chain.id)}`);
        console.log(`USDC address: ${getUSDCAddress(chain.id)}`);
      } catch (error) {
        console.warn("Could not notify about USDC approval:", error);
      }

      // Execute contract call
      const tx = await openPosition({
        args: [countryId, directionValue, leverage, size],
        value: 0n, // Include zero value for payable function
      });

      console.log("Position opened tx:", tx?.hash);
      return {
        success: true,
        hash: tx?.hash,
        countryId,
        direction,
        leverage,
        marginAmount,
      };
    } catch (error: any) {
      console.error("Error opening position:", error);

      // Special handling for ERC20InsufficientAllowance error
      if (
        error.message &&
        (error.message.includes("0xfb8f41b2") ||
          error.message.includes("allowance") ||
          error.message.includes("ERC20InsufficientAllowance") ||
          error.code === "INSUFFICIENT_ALLOWANCE")
      ) {
        console.warn(
          "Detected ERC20InsufficientAllowance error - user needs to approve USDC"
        );

        // Return a structured error object with a specific code
        return {
          error: true,
          code: "INSUFFICIENT_ALLOWANCE",
          message:
            "You need to approve USDC spending before opening a position",
          details: {
            name: error.name,
            errorSignature: "0xfb8f41b2",
            errorType: "ERC20InsufficientAllowance",
          },
        };
      }

      // Format the error for UI display
      const errorResponse = handleError(error, "Failed to open position");

      return {
        error: true,
        message: errorResponse.message,
        code: errorResponse.code,
        details: errorResponse.details,
      };
    }
  }

  /**
   * Close an open position
   *
   * @param closePosition Contract write function for closing position
   * @param sender The address of the trader who owns the position
   * @param isDemoMode Whether we're in demo mode
   * @returns Result object with transaction data or error
   */
  static async closePosition(
    closePosition: any, // contract write function
    sender: string,
    isDemoMode: boolean
  ) {
    try {
      console.log(
        `Closing position for sender ${sender}, isDemoMode=${isDemoMode}`
      );

      // If in demo mode, simulate successful transaction
      if (isDemoMode) {
        console.log("Demo mode: Simulating position close");
        return {
          success: true,
          hash: `demo-tx-close-${Date.now()}`,
          sender,
        };
      }

      // Validate parameters
      if (!sender || sender === "0x0000000000000000000000000000000000000000") {
        return {
          error: true,
          message: "Valid sender address is required",
        };
      }

      // Execute contract call
      const tx = await closePosition({
        args: [sender],
      });

      console.log("Position close tx:", tx?.hash);
      return {
        success: true,
        hash: tx?.hash,
        sender,
      };
    } catch (error: any) {
      console.error("Error closing position:", error);

      // Format the error for UI display
      const errorResponse = handleError(error, "Failed to close position");

      return {
        error: true,
        message: errorResponse.message,
        code: errorResponse.code,
        details: errorResponse.details,
      };
    }
  }

  /**
   * Set Take Profit and Stop Loss for a position
   *
   * @param setTPSL Contract write function for setting TP/SL
   * @param chain Current chain information
   * @param takeProfit Take profit price level
   * @param stopLoss Stop loss price level
   * @param isDemoMode Whether we're in demo mode
   * @returns Result object with transaction data or error
   */
  static async setTPSL(
    setTPSL: any, // contract write function
    chain: any,
    takeProfit: number,
    stopLoss: number,
    isDemoMode: boolean
  ) {
    try {
      console.log(`Setting TP/SL:`, {
        takeProfit,
        stopLoss,
        isDemoMode,
      });

      // If in demo mode, simulate successful transaction
      if (isDemoMode) {
        console.log("Demo mode: Simulating TP/SL update");
        return {
          success: true,
          hash: `demo-tx-tpsl-${Date.now()}`,
          takeProfit,
          stopLoss,
        };
      }

      // Validate chain
      if (!this.validateNetwork(chain)) {
        return {
          error: true,
          message: "Unsupported network. Please switch to Sepolia Testnet.",
        };
      }

      // Convert takeProfit and stopLoss to BigInt values
      const takeProfitBigInt = BigInt(takeProfit);
      const stopLossBigInt = BigInt(stopLoss);

      // Execute contract call
      const tx = await setTPSL({
        args: [takeProfitBigInt, stopLossBigInt],
      });

      console.log("Set TP/SL tx:", tx?.hash);
      return {
        success: true,
        hash: tx?.hash,
        takeProfit,
        stopLoss,
      };
    } catch (error: any) {
      console.error("Error setting TP/SL:", error);

      // Format the error for UI display
      const errorResponse = handleError(error, "Failed to set TP/SL");

      return {
        error: true,
        message: errorResponse.message,
        code: errorResponse.code,
        details: errorResponse.details,
      };
    }
  }
}
