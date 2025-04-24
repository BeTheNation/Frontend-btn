import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatCurrency(
  amount: number,
  decimals: number = 2,
  symbol: string = "$"
): string {
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique random ID for positions and trades
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Transaction status management with localStorage
export const PendingTransactionManager = {
  // Save a pending transaction to localStorage
  savePendingTransaction: (txHash: string, positionData: any) => {
    try {
      const pendingTxs = PendingTransactionManager.getPendingTransactions();
      pendingTxs.push({
        txHash,
        positionData,
        timestamp: Date.now(),
      });
      localStorage.setItem("pendingTransactions", JSON.stringify(pendingTxs));
      console.log(`Saved pending transaction ${txHash} to localStorage`);
    } catch (e) {
      console.error("Failed to save pending transaction:", e);
    }
  },

  // Get all pending transactions from localStorage
  getPendingTransactions: () => {
    try {
      return JSON.parse(localStorage.getItem("pendingTransactions") || "[]");
    } catch (e) {
      console.error("Failed to get pending transactions:", e);
      return [];
    }
  },

  // Remove a transaction from pending list
  removePendingTransaction: (txHash: string) => {
    try {
      const pendingTxs = PendingTransactionManager.getPendingTransactions();
      const updatedTxs = pendingTxs.filter((tx: any) => tx.txHash !== txHash);
      localStorage.setItem("pendingTransactions", JSON.stringify(updatedTxs));
      console.log(`Removed transaction ${txHash} from pending list`);
    } catch (e) {
      console.error("Failed to remove pending transaction:", e);
    }
  },

  // Check if a transaction hash exists in pending list
  isPendingTransaction: (txHash: string) => {
    try {
      const pendingTxs = PendingTransactionManager.getPendingTransactions();
      return pendingTxs.some((tx: any) => tx.txHash === txHash);
    } catch (e) {
      console.error("Failed to check pending transaction:", e);
      return false;
    }
  },

  // Clean up old pending transactions (older than 24 hours)
  cleanupOldTransactions: () => {
    try {
      const pendingTxs = PendingTransactionManager.getPendingTransactions();
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const updatedTxs = pendingTxs.filter(
        (tx: any) => tx.timestamp > oneDayAgo
      );

      if (updatedTxs.length !== pendingTxs.length) {
        localStorage.setItem("pendingTransactions", JSON.stringify(updatedTxs));
        console.log(
          `Cleaned up ${pendingTxs.length - updatedTxs.length} old transactions`
        );
      }
    } catch (e) {
      console.error("Failed to clean up old transactions:", e);
    }
  },
};
