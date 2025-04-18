"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook to redirect users to the dashboard when they connect their wallet
 */
export function useWalletRedirect() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // When the user connects their wallet, redirect to the dashboard
    if (isConnected) {
      // Using a short timeout to ensure all connection states are properly updated
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isConnected, router]);

  return null;
}
