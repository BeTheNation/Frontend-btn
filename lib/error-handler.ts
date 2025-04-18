"use client";

import { toast } from "@/components/ui/utils/use-toast";

/**
 * Standard error types in the application
 */
export enum ErrorType {
  NETWORK = "network",
  CONTRACT = "contract",
  VALIDATION = "validation",
  WALLET = "wallet",
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
  console.error("Contract error:", error);

  // Default error response
  const errorResponse: ErrorResponse = {
    message: "An unknown error occurred",
    type: ErrorType.UNKNOWN,
  };

  // Check if it's a ContractFunctionExecutionError from viem
  if (
    error.name === "ContractFunctionExecutionError" ||
    (error.message && error.message.includes("ContractFunctionExecutionError"))
  ) {
    // Extract the reason from the error message
    const reasonMatch = error.message?.match(/reason="([^"]+)"/);
    const reason = reasonMatch ? reasonMatch[1] : "Contract execution failed";

    errorResponse.message = reason;
    errorResponse.type = ErrorType.CONTRACT;
    errorResponse.code = "CONTRACT_EXECUTION_ERROR";
    return errorResponse;
  }

  // Check for specific error codes
  if (error.code === "INSUFFICIENT_FUNDS") {
    errorResponse.message = "Insufficient funds for transaction";
    errorResponse.type = ErrorType.WALLET;
    errorResponse.code = error.code;
  } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
    errorResponse.message =
      "Transaction may fail. Please try with different parameters";
    errorResponse.type = ErrorType.CONTRACT;
    errorResponse.code = error.code;
  } else if (error.reason) {
    errorResponse.message = error.reason;
    errorResponse.type = ErrorType.CONTRACT;
  } else if (error.message && error.message.includes("User rejected")) {
    errorResponse.message = "Transaction was rejected";
    errorResponse.type = ErrorType.WALLET;
  } else if (error.message) {
    errorResponse.message = error.message;
  }

  // Add details for debugging
  errorResponse.details = {
    originalError: {
      message: error.message,
      code: error.code,
      reason: error.reason,
      data: error.data,
    },
  };

  return errorResponse;
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
  };

  return result;
}
