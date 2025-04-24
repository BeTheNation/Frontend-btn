"use client";

import { useState } from "react";
import { useContract } from "./useContract";
import { usePositions } from "./usePositions";
import { useDemoMode } from "./useDemoMode";
import { useToast } from "@/components/ui/use-toast";
import { generateId, PendingTransactionManager } from "@/lib/utils";

/**
 * Hook for creating new positions with proper handling for both contract and demo modes
 */
export function usePositionCreation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { openPosition, waitForTransaction } = useContract();
  const { addPosition, refreshPositions } = usePositions();
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();

  // Add new function to handle browser closing during transaction
  const savePendingTransactionBeforeUnload = (
    txHash: string,
    positionData: any
  ) => {
    try {
      // Add event listener for beforeunload
      const handleBeforeUnload = () => {
        // Mark the transaction as possibly interrupted due to browser closing
        const pendingTxs = PendingTransactionManager.getPendingTransactions();
        const updatedTxs = pendingTxs.map((tx) => {
          if (tx.txHash === txHash) {
            return {
              ...tx,
              browserClosed: true,
              lastUpdated: Date.now(),
            };
          }
          return tx;
        });
        localStorage.setItem("pendingTransactions", JSON.stringify(updatedTxs));
        console.log(
          `Transaction ${txHash} marked as possibly interrupted due to browser closing`
        );
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Return function to remove listener
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } catch (e) {
      console.error("Error setting up beforeunload handler:", e);
      return () => {}; // Return empty function if it fails
    }
  };

  const createPosition = async (
    countryId: string,
    countryName: string,
    direction: "long" | "short",
    size: number,
    leverage: number,
    entryPrice: number,
    markPrice: number
  ) => {
    setIsProcessing(true);
    let removeBeforeUnloadListener = () => {}; // Default no-op function

    try {
      // If in demo mode, create a demo position without blockchain interaction
      if (isDemoMode) {
        // Create a demo position with a unique ID
        const demoPosition = {
          id: `demo-${generateId()}`,
          country: {
            id: countryId,
            name: countryName,
          },
          direction: direction,
          size: size,
          leverage: leverage,
          entryPrice: entryPrice,
          markPrice: markPrice,
          openTime: new Date(),
          fundingRate: 0.01, // Default funding rate
          nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        };

        // Add the position to the store
        addPosition(demoPosition);

        toast({
          title: "Demo Position Created",
          description: `Successfully opened a ${direction} position on ${countryName} in demo mode.`,
          variant: "success",
        });

        return { success: true, position: demoPosition };
      } else {
        // Use the contract method when not in demo mode
        const result = await openPosition(
          countryId,
          direction,
          leverage,
          size.toString()
        );

        if (result && !result.error) {
          // Extract transaction hash if available
          const txHash = result.txHash || result.hash || undefined;

          if (!txHash) {
            console.warn("No transaction hash returned from openPosition");
          } else {
            // Save pending transaction to localStorage for recovery
            const positionData = {
              countryId,
              countryName,
              direction,
              size,
              leverage,
              entryPrice,
              markPrice,
              timestamp: Date.now(),
            };
            PendingTransactionManager.savePendingTransaction(
              txHash,
              positionData
            );

            // Add beforeunload event listener
            removeBeforeUnloadListener = savePendingTransactionBeforeUnload(
              txHash,
              positionData
            );
          }

          // Add the new position with transaction hash
          if (result.position) {
            const position = {
              ...result.position,
              txHash,
            };
            addPosition(position);
          }

          toast({
            title: "Position Created",
            description: `Successfully opened a ${direction} position on ${countryName}. Waiting for confirmation...`,
            variant: "success",
          });

          // If we have a transaction hash, monitor its confirmation
          if (txHash && waitForTransaction) {
            // Show a "pending confirmation" toast
            toast({
              title: "Transaction Pending",
              description: "Waiting for blockchain confirmation...",
            });

            // Start monitoring in the background
            waitForTransaction(txHash)
              .then((confirmation) => {
                if (confirmation.success) {
                  // Transaction confirmed successfully
                  toast({
                    title: "Transaction Confirmed",
                    description:
                      "Your position has been confirmed on the blockchain.",
                    variant: "success",
                  });

                  // Refresh positions to fetch the latest data
                  refreshPositions();

                  // Remove from pending transactions
                  PendingTransactionManager.removePendingTransaction(txHash);
                } else {
                  // Transaction failed on-chain
                  toast({
                    title: "Transaction Failed",
                    description:
                      confirmation.error ||
                      "Your position could not be confirmed on the blockchain.",
                    variant: "destructive",
                  });
                }
              })
              .catch((error) => {
                console.error("Error monitoring transaction:", error);
                toast({
                  title: "Monitoring Error",
                  description:
                    "Could not verify transaction confirmation. Please check your wallet.",
                  variant: "destructive",
                });
              });
          }

          return { success: true, position: result.position, txHash };
        } else {
          // Check if this is specifically an approval error
          if (
            result?.code === "APPROVAL_REQUIRED" ||
            result?.code === "INSUFFICIENT_ALLOWANCE" ||
            result?.code === "CONTRACT_ERROR" ||
            (result?.error &&
              (result.error.includes("allowance") ||
                result.error.includes("ERC20") ||
                result.error.includes("approve") ||
                result.error.includes("0xfb8f41b2")))
          ) {
            return {
              success: false,
              error: result.error || "USDC approval required",
              code: "USDC_APPROVAL_REQUIRED",
            };
          }

          // Check if this is a user rejection/cancellation
          if (
            result?.code === "USER_REJECTED" ||
            (result?.error && result.error.includes("rejected"))
          ) {
            toast({
              title: "Transaction Cancelled",
              description: "You cancelled the transaction in your wallet.",
              variant: "default",
            });
            return {
              success: false,
              error: "Transaction was rejected by user",
              code: "USER_REJECTED",
            };
          }

          throw new Error(result?.error || "Failed to create position");
        }
      }
    } catch (error: any) {
      console.error("Error creating position:", error);

      // Check if error is user rejection
      if (
        error.code === 4001 ||
        error.code === "ACTION_REJECTED" ||
        error.name === "UserRejectedRequestError" ||
        (error.message &&
          (error.message.includes("User denied") ||
            error.message.includes("user rejected") ||
            error.message.includes("canceled") ||
            error.message.includes("cancelled") ||
            error.message.includes("rejected by the user")))
      ) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the transaction in your wallet.",
          variant: "default",
        });
        return {
          success: false,
          error: "Transaction was rejected by user",
          code: "USER_REJECTED",
        };
      }

      // Check for USDC approval errors in the catch block too
      if (
        error.code === "INSUFFICIENT_ALLOWANCE" ||
        (error.message &&
          (error.message.includes("allowance") ||
            error.message.includes("ERC20") ||
            error.message.includes("approve") ||
            error.message.includes("0xfb8f41b2") || // Specific error signature for insufficient allowance
            (error.message.includes("signature") &&
              error.message.includes("0xfb8f41b2"))))
      ) {
        return {
          success: false,
          error: "USDC approval required before opening position",
          code: "USDC_APPROVAL_REQUIRED",
        };
      }

      toast({
        title: "Error Creating Position",
        description:
          error.message || "Failed to create position. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      // Clean up the beforeunload listener
      removeBeforeUnloadListener();
      setIsProcessing(false);
    }
  };

  return {
    createPosition,
    isProcessing,
  };
}
