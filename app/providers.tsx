"use client";

import { type ReactNode } from "react";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { PredictionMarketProvider } from "@/contexts/PredictionMarketContext";
import { useEffect } from "react";
import { PendingTransactionManager } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";
import { usePositionStore } from "@/store/positionStore";
import { useToast } from "@/components/ui/use-toast";

// Component that checks for pending transactions
function PendingTransactionChecker() {
  const { waitForTransaction } = useContract();
  const { fetchPositions } = usePositionStore();
  const { toast } = useToast();

  useEffect(() => {
    const checkPendingTransactions = async () => {
      try {
        // Clean up old transactions first
        PendingTransactionManager.cleanupOldTransactions();

        // Get pending transactions
        const pendingTxs = PendingTransactionManager.getPendingTransactions();
        if (pendingTxs.length === 0) return;

        console.log(`Found ${pendingTxs.length} pending transactions to check`);
        toast({
          title: "Checking Pending Transactions",
          description: `Verifying ${pendingTxs.length} pending transactions...`,
        });

        for (const tx of pendingTxs) {
          // Skip transactions older than 24 hours
          if (Date.now() - tx.timestamp > 24 * 60 * 60 * 1000) {
            console.log(`Skipping old transaction ${tx.txHash}`);
            continue;
          }

          console.log(`Checking status of transaction ${tx.txHash}`);

          // Check transaction status
          if (waitForTransaction) {
            const status = await waitForTransaction(tx.txHash, 1, 3);
            if (status.success) {
              console.log(`Pending transaction ${tx.txHash} confirmed`);
              toast({
                title: "Transaction Confirmed",
                description: `Previous transaction has been confirmed on the blockchain.`,
                variant: "success",
              });

              // Refresh positions
              fetchPositions();

              // Remove from pending
              PendingTransactionManager.removePendingTransaction(tx.txHash);
            } else {
              console.log(
                `Transaction ${tx.txHash} not confirmed yet or failed`
              );
              // Keep in pending list for future checks
            }
          }
        }
      } catch (e) {
        console.error("Error checking pending transactions:", e);
      }
    };

    // Check on application startup
    checkPendingTransactions();

    // Also set up interval to check periodically
    const interval = setInterval(checkPendingTransactions, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [waitForTransaction, fetchPositions, toast]);

  return null; // This component doesn't render anything
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DemoModeProvider>
        <Web3Provider>
          <PredictionMarketProvider>
            <PendingTransactionChecker />
            {children}
          </PredictionMarketProvider>
        </Web3Provider>
      </DemoModeProvider>
    </ThemeProvider>
  );
}
