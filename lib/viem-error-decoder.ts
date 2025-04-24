// lib/viem-error-decoder.ts
"use client";

import { ethers } from "ethers";
import PredictionMarketJson from "@/lib/abi/PredictionMarket.json";

// Define a simple type for ContractFunctionExecutionError since it's not exported from viem
interface ContractFunctionExecutionError {
  name: string;
  message: string;
  shortMessage?: string;
  cause?: any;
  details?: string;
  data?: string;
  code?: string;
  reason?: string;
  error?: any;
  metaMessages?: string[];
  args?: any[];
  errorName?: string;
}

// Store error signatures - Pre-populate with known OpenZeppelin ERC20 error signatures
export const ERROR_SIGNATURES: Record<string, string> = {
  // OpenZeppelin ERC20 errors that might not be in our ABI
  "0xfb8f41b2": "ERC20InsufficientAllowance",
  "0x0c11171a": "ERC20InvalidApprover",
  "0x8994dd25": "ERC20InvalidSpender",
  "0x18160ddd": "ERC20InsufficientBalance",
  "0xa1a9ad0e": "ERC20InvalidSender",
  "0x7939f424": "ERC20InvalidReceiver",
  // Additional PredictionMarket errors from our contract
  "0x5667ba93": "LeverageShouldBeBetweenOneAndFive",
  "0xd6ea9c84": "SizeShouldBeGreaterThanZero",
  "0x49ed6464": "PositionDoesNotExist",
  "0x5c02e3bf": "PositionAlreadyExist",
  "0x1f2a2005": "Liquidated",
  "0xe86ef778": "NotTheOwner",
};

// Initialize error signatures from ABI
export function initializeErrorSignatures() {
  // If we already have a lot of signatures, no need to reinitialize
  if (Object.keys(ERROR_SIGNATURES).length > 10) return ERROR_SIGNATURES;

  try {
    // Correct way to access the ABI from the JSON file
    const errorFragments = PredictionMarketJson.abi.filter(
      (item) => item.type === "error"
    );

    errorFragments.forEach((errorFragment) => {
      // Make sure name is defined, default to "Error" if not
      const errorName = errorFragment.name || "Error";

      // Handle errors with parameters correctly
      const paramTypes =
        errorFragment.inputs?.map((input) => input.type).join(",") || "";
      const signature = `${errorName}(${paramTypes})`;

      // Use ethers v6 format instead of utils.id
      const selector = ethers.id(signature).slice(0, 10); // First 10 chars (0x + 8 chars)
      ERROR_SIGNATURES[selector] = errorName;

      console.debug(`Initialized error signature: ${errorName} => ${selector}`);
    });
  } catch (error) {
    console.error("Error initializing error signatures:", error);
  }

  return ERROR_SIGNATURES;
}

// Extract error selector from Viem's ContractFunctionExecutionError
export function extractErrorSelector(error: any): string | null {
  try {
    // Initialize signatures if not already done
    initializeErrorSignatures();

    if (!error) return null;

    // Debug log the error details
    console.debug("Decoding contract error:", {
      name: error.name,
      message: error.message?.substring(0, 200) + "...",
      cause: error.cause,
      data: error.data,
    });

    // Special case for direct matching of known error selectors in the error message
    if (error.message) {
      for (const [selector, errorName] of Object.entries(ERROR_SIGNATURES)) {
        if (error.message.includes(selector)) {
          console.log(`Direct match found for ${selector} => ${errorName}`);
          return selector;
        }
      }
    }

    // Check for direct data in the error object
    if (
      error.data &&
      typeof error.data === "string" &&
      error.data.startsWith("0x")
    ) {
      return error.data.slice(0, 10);
    }

    // For Viem's specific error format
    if (error.name === "ContractFunctionExecutionError" && error.message) {
      // Look for the selector pattern in the error message
      const selectorMatch = error.message.match(/0x[a-fA-F0-9]{8}[a-fA-F0-9]*/);
      if (selectorMatch) {
        return selectorMatch[0].slice(0, 10);
      }

      // Look for revert reason in quotes
      const reasonMatch = error.message.match(/reason="([^"]+)"/);
      if (reasonMatch) {
        return reasonMatch[1]; // Return the reason as a string
      }

      // Look for error data in the structure
      if (error.shortMessage && typeof error.shortMessage === "string") {
        const shortMessageMatch = error.shortMessage.match(
          /0x[a-fA-F0-9]{8}[a-fA-F0-9]*/
        );
        if (shortMessageMatch) {
          return shortMessageMatch[0].slice(0, 10);
        }
      }
    }

    // For newer versions of Viem
    if (error.details && error.details.includes("0x")) {
      const detailsMatch = error.details.match(/0x[a-fA-F0-9]{8}[a-fA-F0-9]*/);
      if (detailsMatch) {
        return detailsMatch[0].slice(0, 10);
      }
    }

    // Check in error.cause (Viem wraps original errors)
    if (error.cause) {
      const causeSelector = extractErrorSelector(error.cause);
      if (causeSelector) return causeSelector;
    }

    return null;
  } catch (extractError) {
    console.error("Error while extracting selector:", extractError);
    return null;
  }
}

interface ErrorResult {
  message: string;
  code: string;
}

// Extract the most useful part of a viem error message for users
export function decodeViemError(error: any): string {
  // If not an error object, return generic message
  if (!error) return "Unknown error occurred";

  try {
    // If it's a viem ContractFunctionExecutionError, extract the most useful part
    if (error.name === "ContractFunctionExecutionError") {
      // Extract the reason string from the error
      const reasonMatch = error.message.match(/reason="([^"]+)"/);
      if (reasonMatch && reasonMatch[1]) {
        return reasonMatch[1];
      }

      // Extract custom error name if present
      const customErrorMatch = error.message.match(
        /execution reverted \("([^"]+)"\)/
      );
      if (customErrorMatch && customErrorMatch[1]) {
        return customErrorMatch[1];
      }

      // Check for gas estimation errors
      if (error.message.includes("gas required exceeds allowance")) {
        return "Not enough gas to execute transaction. Try with higher gas limit or lower complexity.";
      }

      // Check for general execution revert
      if (error.message.includes("execution reverted")) {
        return "Transaction reverted by the contract. Please check your inputs.";
      }
    }

    // If it's a user rejected error
    if (
      error.code === "ACTION_REJECTED" ||
      (typeof error.message === "string" &&
        error.message.includes("user rejected"))
    ) {
      return "Transaction was rejected by the user";
    }

    // If there's a message property, return it
    if (error.message) {
      if (typeof error.message === "string") {
        // Simplify and clean up message
        let message = error.message;

        // Remove "Error:" prefix if present
        if (message.startsWith("Error:")) {
          message = message.substring(6).trim();
        }

        // Limit length to avoid extremely long messages
        if (message.length > 150) {
          message = message.substring(0, 150) + "...";
        }

        return message;
      }
    }

    // If all else fails, convert error to string
    return String(error);
  } catch (decodingError) {
    console.error("Error while decoding viem error:", decodingError);
    return String(error) || "Unknown error occurred";
  }
}

// More structured error handler that returns code and message
export function handleContractError(error: any): ErrorResult {
  try {
    // Common error codes
    if (error.code) {
      switch (error.code) {
        case "UNPREDICTABLE_GAS_LIMIT":
          return {
            code: "GAS_LIMIT",
            message:
              "Transaction may fail or requires too much gas. Check inputs or network congestion.",
          };
        case "INSUFFICIENT_FUNDS":
          return {
            code: "NO_FUNDS",
            message: "Not enough funds to complete this transaction",
          };
        case "CALL_EXCEPTION":
        case "CALL_REVERTED":
          return {
            code: "REVERTED",
            message: decodeViemError(error),
          };
        case "ACTION_REJECTED":
          return {
            code: "REJECTED",
            message: "Transaction was rejected by user",
          };
        default:
          // Handle other known codes
          return {
            code: error.code,
            message: decodeViemError(error),
          };
      }
    }

    // Check if it's a ContractFunctionExecutionError
    if (error.name === "ContractFunctionExecutionError") {
      return {
        code: "CONTRACT_ERROR",
        message: decodeViemError(error),
      };
    }

    // For other errors, extract a user-friendly message
    return {
      code: "UNKNOWN",
      message: decodeViemError(error),
    };
  } catch (decodingError) {
    console.error("Error in handleContractError:", decodingError);
    return {
      code: "INTERNAL_ERROR",
      message: "An internal error occurred while processing the contract error",
    };
  }
}

// Helper function to display error to console with details
export function logContractError(error: any, context?: string): void {
  const prefix = context ? `[${context}] ` : "";
  console.error(`${prefix}Contract Error:`, error);

  try {
    const { message, code } = handleContractError(error);
    console.log(`${prefix}Decoded: [${code}] ${message}`);
  } catch (e) {
    console.error(`${prefix}Failed to decode error:`, e);
  }
}

// Helper function to get error type from message
function getErrorTypeFromMessage(message?: string): { message: string; code: string } | null {
  if (!message) return null;
  
  if (message.includes("insufficient funds")) {
    return {
      message: "Insufficient funds to execute transaction",
      code: "INSUFFICIENT_FUNDS",
    };
  }
  
  if (message.includes("user rejected") || message.includes("user denied")) {
    return {
      message: "Transaction was rejected by the user",
      code: "USER_REJECTED",
    };
  }
  
  if (message.includes("gas required exceeds")) {
    return {
      message: "Transaction requires too much gas. Try simplifying the operation.",
      code: "GAS_LIMIT_EXCEEDED",
    };
  }
  
  return null;
}

/**
 * Specialized decoder for Viem's ContractFunctionExecutionError
 * This handles the specific error format of viem's contract execution errors
 */
export function handleContractFunctionExecutionError(err: any): {
  message: string;
  code?: string;
} {
  try {
    // Extract error data more effectively
    const errorData = err.cause?.error?.data || err.cause?.data;

    // Add specific handling for common errors
    if (err.message?.includes("insufficient funds")) {
      return {
        message: "Insufficient funds to execute transaction",
        code: "INSUFFICIENT_FUNDS",
      };
    }

    // Handle other errors
    const errorType = getErrorTypeFromMessage(err.message);
    if (errorType) {
      return errorType;
    }

    // Default error message
    return {
      message: "An error occurred while executing the contract",
      code: "CONTRACT_ERROR",
    };
  } catch (decodingError) {
    console.error(
      "Error in handleContractFunctionExecutionError:",
      decodingError
    );
    return {
      message: "An internal error occurred while processing the contract error",
      code: "INTERNAL_ERROR",
    };
  }
}

/**
 * Helper function to extract error data from ABI
 * This can be used to match error selectors to known contract error types
 */
export function decodeErrorData(errorData: string, contractAbi: any[]): any {
  if (!errorData || !contractAbi) return null;

  try {
    // This is a placeholder - in a real implementation, this would use
    // ethers.js or viem to decode the error data against the ABI

    // Find all error definitions in the ABI
    const errorDefs = contractAbi.filter((item) => item.type === "error");

    // Basic implementation to check error data against error selectors
    // A real implementation would do proper ABI encoding/decoding

    return {
      decoded: false,
      errorData,
      possibleErrors: errorDefs.map((def) => def.name),
    };
  } catch (error) {
    console.error("Failed to decode error data:", error);
    return null;
  }
}

export function debugContractError(error: any, context = "Contract Error") {
  console.error(`=== ${context} DETAILS ===`);
  console.error("Error type:", error.name);
  console.error("Error message:", error.message);

  // Log data specific to viem
  if (error.shortMessage) console.error("Short message:", error.shortMessage);
  if (error.details) console.error("Details:", error.details);
  if (error.data) console.error("Error data:", error.data);

  // Log error cause (usually contains blockchain information)
  if (error.cause) {
    console.error("Cause:", {
      name: error.cause.name,
      message: error.cause.message,
      code: error.cause?.code,
    });

    // Provider/RPC error details
    if (error.cause.error) {
      console.error("Provider error:", {
        code: error.cause.error.code,
        message: error.cause.error.message,
        data: error.cause.error.data,
      });
    }
  }

  // Log contract revert reason if available
  if (error.cause?.reason) {
    console.error("Revert reason:", error.cause.reason);
  }

  // Extract error selectors
  if (error.cause?.error?.data) {
    console.error("Error data selector:", error.cause.error.data.slice(0, 10));
    console.error("Full error data:", error.cause.error.data);
  }

  return { error, context };
}
