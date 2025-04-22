import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionErrorProps {
  error: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionErrorDisplay({
  error,
  isOpen,
  onClose,
}: TransactionErrorProps) {
  // Extract useful information from the error
  const errorName = error?.name || "Unknown Error";
  const errorMessage = error?.message || "No error message available";
  const errorCode = error?.code || "Unknown";
  const errorDetails = error?.details || null;
  const errorCause = error?.cause ? JSON.stringify(error.cause, null, 2) : null;

  // Try to extract the revert reason
  const revertReason = errorMessage.includes("reason string")
    ? errorMessage.match(/reason string '([^']+)'/)?.[1] || null
    : null;

  // Try to extract function selector from error data
  const extractSelector = (data: string) => {
    if (!data || typeof data !== "string") return null;
    // Function selectors are 4 bytes (8 hex chars) after 0x
    if (data.startsWith("0x") && data.length >= 10) {
      return data.substring(0, 10);
    }
    return null;
  };

  const errorSelector = error?.cause?.error?.data
    ? extractSelector(error.cause.error.data)
    : null;

  // Known error selectors
  const knownSelectors: Record<string, string> = {
    "0x10560cbd": "PositionDoesNotExist",
    "0x30cd7471": "NotTheOwner",
    "0xb11864fc": "Liquidated",
    "0xfb8f41b2": "ERC20InsufficientAllowance",
  };

  const friendlyErrorName = errorSelector
    ? knownSelectors[errorSelector] || `Unknown error (${errorSelector})`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-red-500">Transaction Error</DialogTitle>
          <DialogDescription>
            There was an error while trying to execute the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 overflow-auto max-h-[300px]">
          {/* User-friendly error summary */}
          <div className="mb-4 p-3 bg-red-500/10 rounded-md border border-red-500/30">
            <h3 className="font-semibold text-red-500">Error Summary</h3>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>

          {/* Contract-specific error information */}
          {(friendlyErrorName || revertReason) && (
            <div className="mb-4 p-3 bg-yellow-500/10 rounded-md border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-500">Contract Error</h3>
              {friendlyErrorName && (
                <p className="mt-1 text-sm">
                  <span className="font-medium">Type:</span> {friendlyErrorName}
                </p>
              )}
              {revertReason && (
                <p className="mt-1 text-sm">
                  <span className="font-medium">Reason:</span> {revertReason}
                </p>
              )}
              {errorSelector && (
                <p className="mt-1 text-sm">
                  <span className="font-medium">Selector:</span> {errorSelector}
                </p>
              )}
            </div>
          )}

          {/* Technical details (collapsible) */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium text-sm">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-800 rounded text-xs overflow-x-auto">
              <p className="mb-1">
                <span className="text-gray-400">Name:</span> {errorName}
              </p>
              <p className="mb-1">
                <span className="text-gray-400">Code:</span> {errorCode}
              </p>
              {errorDetails && (
                <p className="mb-1">
                  <span className="text-gray-400">Details:</span> {errorDetails}
                </p>
              )}
              {errorCause && (
                <div className="mt-2">
                  <p className="text-gray-400 mb-1">Cause:</p>
                  <pre className="whitespace-pre-wrap text-xs text-gray-300">
                    {errorCause}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for use in try-catch blocks
export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: (error: Error) => React.ReactNode;
}) {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    return <>{fallback(error)}</>;
  }

  return (
    <React.Fragment>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            onError: (err: Error) => setError(err),
          });
        }
        return child;
      })}
    </React.Fragment>
  );
}
