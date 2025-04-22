"use client";

import { toast } from "@/components/ui/use-toast";

/**
 * Standard error types in the application
 */
export enum ErrorType {
  CONTRACT = "contract",
  WALLET = "wallet",
  NETWORK = "network",
  APPROVAL = "approval",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

/**
 * Error response with additional metadata
 */
export interface ErrorResponse {
  message: string;
  type: ErrorType;
  code?: string;
  details?: any;
}

/**
 * Format contract errors into standardized error responses
 */
export function formatContractError(error: any): ErrorResponse {
  if (!error) {
    return {
      message: "Unknown error occurred",
      type: ErrorType.UNKNOWN,
    };
  }

  // Check for specific error patterns
  if (error.message?.includes("User denied")) {
    return {
      message: "Transaction was rejected",
      type: ErrorType.WALLET,
      code: "USER_REJECTED",
    };
  }

  // Handle viem ContractFunctionExecutionError
  if (
    error.name === "ContractFunctionExecutionError" ||
    error.message?.includes("ContractFunctionExecutionError")
  ) {
    try {
      // Try to extract meaningful information from the error
      const reasonMatch = error.message?.match(/reason="([^"]+)"/);
      let errorMessage = "Contract execution failed";

      if (reasonMatch && reasonMatch[1]) {
        errorMessage = reasonMatch[1];
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage;
      } else if (error.details) {
        errorMessage = error.details;
      }

      return {
        message: errorMessage,
        type: ErrorType.CONTRACT,
        code: error.code || "EXECUTION_FAILED",
        details: {
          originalError: error,
        },
      };
    } catch (decodingError) {
      console.error("Error decoding contract error:", decodingError);
    }
  }

  // Handle insufficient funds errors
  if (
    error.message?.includes("insufficient funds") ||
    error.message?.includes("Insufficient funds")
  ) {
    return {
      message: "Not enough funds to complete this transaction",
      type: ErrorType.WALLET,
      code: "INSUFFICIENT_FUNDS",
    };
  }

  // Handle gas estimation errors
  if (
    error.code === "UNPREDICTABLE_GAS_LIMIT" ||
    error.message?.includes("gas required exceeds")
  ) {
    return {
      message: "Cannot estimate transaction gas. The transaction may fail.",
      type: ErrorType.CONTRACT,
      code: "GAS_ESTIMATION_FAILED",
    };
  }

  // Handle network errors
  if (
    error.message?.includes("network") ||
    error.message?.includes("connection") ||
    error.message?.includes("timeout")
  ) {
    return {
      message: "Network error. Please check your connection and try again.",
      type: ErrorType.NETWORK,
      code: "NETWORK_ERROR",
    };
  }

  // Default error handling
  return {
    message: error.message || "An error occurred",
    type: ErrorType.UNKNOWN,
    code: error.code,
    details: error,
  };
}

/**
 * Handle validation errors
 */
export function handleValidationError(message: string): ErrorResponse {
  return {
    message,
    type: ErrorType.VALIDATION,
  };
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: any): ErrorResponse {
  return {
    message: error.message || "Network connection error",
    type: ErrorType.NETWORK,
    details: error,
  };
}

/**
 * Main error handler function that processes errors and provides toast notifications
 */
export function handleError(error: any, customMessage?: string): ErrorResponse {
  let errorResponse: ErrorResponse;

  if (error.type && Object.values(ErrorType).includes(error.type)) {
    // Already formatted error
    errorResponse = error;
  } else if (error.code || error.reason) {
    // Contract/web3 error
    errorResponse = formatContractError(error);
  } else if (
    error.message &&
    (error.message.includes("Network") ||
      error.message.includes("connection") ||
      error.message.includes("timeout"))
  ) {
    // Network error
    errorResponse = handleNetworkError(error);
  } else {
    // Unknown error
    errorResponse = {
      message: error.message || "An unknown error occurred",
      type: ErrorType.UNKNOWN,
      details: error,
    };
  }

  // Display toast notification with appropriate styling
  toast({
    title: getErrorTitle(errorResponse),
    description: customMessage || errorResponse.message,
    variant: "destructive",
  });

  return errorResponse;
}

/**
 * Get appropriate error title based on error type
 */
function getErrorTitle(error: ErrorResponse): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return "Network Error";
    case ErrorType.CONTRACT:
      return "Contract Error";
    case ErrorType.VALIDATION:
      return "Validation Error";
    case ErrorType.WALLET:
      return "Wallet Error";
    default:
      return "Error";
  }
}

/**
 * Detailed analysis of ContractFunctionExecutionError
 */
export function debugContractFunctionExecutionError(error: any): {
  reason: string | null;
  errorDetails: any;
} {
  console.error("Analyzing ContractFunctionExecutionError:", error);

  const result = {
    reason: null,
    errorDetails: {},
  };

  // Extract reason from error message
  if (error.message) {
    const reasonMatch = error.message.match(/reason="([^"]+)"/);
    if (reasonMatch && reasonMatch[1]) {
      result.reason = reasonMatch[1];
    } else if (error.reason) {
      result.reason = error.reason;
    } else {
      // Try alternative formats
      const customErrorMatch = error.message.match(
        /execution reverted \("([^"]+)"\)/
      );
      if (customErrorMatch && customErrorMatch[1]) {
        result.reason = customErrorMatch[1];
      } else if (error.message.includes("execution reverted")) {
        const revertMatch = error.message.match(
          /execution reverted:?\s*(.+?)($|\n)/i
        );
        if (revertMatch && revertMatch[1]) {
          result.reason = revertMatch[1].trim();
        }
      }
    }
  }

  // Gather error details
  result.errorDetails = {
    name: error.name,
    code: error.code,
    functionName: error.functionName,
    args: error.args,
    value: error.value,
    data: error.data,
    message: error.message,
    // If the error has a cause, include that as well
    cause: error.cause
      ? {
          code: error.cause.code,
          message: error.cause.message,
        }
      : undefined,
  };

  return result;
}

/**
 * Convert technical error messages to user-friendly descriptions
 */
export function getUserFriendlyErrorMessage(error: ErrorResponse): string {
  // Map common technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    "gas required exceeds allowance":
      "Transaction requires more gas than available. Try with simpler parameters.",
    "insufficient funds":
      "You don't have enough funds in your wallet to complete this transaction.",
    "user rejected transaction": "You cancelled the transaction.",
    "nonce too high": "Please refresh the page and try again.",
    "execution reverted":
      "The transaction was rejected by the smart contract. Please check your inputs.",
  };

  // Check if the error message contains any of the technical terms
  for (const [technicalTerm, friendlyMessage] of Object.entries(
    errorMappings
  )) {
    if (error.message.toLowerCase().includes(technicalTerm.toLowerCase())) {
      return friendlyMessage;
    }
  }

  // If no mapping found, return the original message
  return error.message;
}

/**
 * Import the viem error decoder to use its functionality
 */
import { handleContractFunctionExecutionError } from "./viem-error-decoder";

/**
 * Enhanced error handler that uses both formatContractError and handleContractFunctionExecutionError
 */
export function handleTransactionError(error: any): ErrorResponse {
  console.debug("Handling transaction error:", error);

  // Use the viem-specific decoder for ContractFunctionExecutionError
  if (
    error.name === "ContractFunctionExecutionError" ||
    error.message?.includes("ContractFunctionExecutionError")
  ) {
    try {
      const decodedError = handleContractFunctionExecutionError(error);
      return {
        message: decodedError.message,
        type: ErrorType.CONTRACT,
        code: decodedError.code,
      };
    } catch (decodingError) {
      console.error(
        "Error in handleContractFunctionExecutionError:",
        decodingError
      );
      // Fall back to the standard formatter
    }
  }

  // Use the standard error formatter for other cases
  return formatContractError(error);
}
