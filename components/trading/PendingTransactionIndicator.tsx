"use client";

import { useEffect, useState } from "react";
import { PendingTransactionManager } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useContract } from "@/hooks/useContract";
import { usePositionStore } from "@/store/positionStore";
import { motion } from "framer-motion";

/**
 * Component that visually shows pending transactions and their status
 */
export function PendingTransactionIndicator() {
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const { waitForTransaction } = useContract();
  const { fetchPositions } = usePositionStore();

  useEffect(() => {
    // Initial load
    const txs = PendingTransactionManager.getPendingTransactions();
    setPendingTxs(txs);

    // Set up interval to check
    const checkInterval = setInterval(() => {
      const currentTxs = PendingTransactionManager.getPendingTransactions();
      setPendingTxs(currentTxs);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, []);

  // No indicator when no pending transactions
  if (pendingTxs.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-[#1d1f22] rounded-lg shadow-lg p-4 border border-[#323232]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="font-bold mb-2 text-white flex items-center">
        <Spinner className="mr-2" />
        <span>Pending Transactions</span>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-auto">
        {pendingTxs.map((tx) => (
          <div key={tx.txHash} className="flex items-center text-sm">
            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
            <div
              className="text-gray-200 truncate"
              style={{ maxWidth: "200px" }}
            >
              {tx.txHash.substring(0, 8)}...
              {tx.txHash.substring(tx.txHash.length - 8)}
            </div>
            <button
              className="ml-2 text-xs text-blue-400 hover:text-blue-300"
              onClick={() => {
                // Try to verify the transaction
                if (waitForTransaction) {
                  waitForTransaction(tx.txHash).then((result) => {
                    if (result.success) {
                      // Transaction confirmed - refresh positions and remove from pending
                      fetchPositions();
                      PendingTransactionManager.removePendingTransaction(
                        tx.txHash
                      );
                      setPendingTxs(
                        PendingTransactionManager.getPendingTransactions()
                      );
                    }
                  });
                }
              }}
            >
              Check
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Transactions are automatically verified on a regular basis.
      </div>
    </motion.div>
  );
}
