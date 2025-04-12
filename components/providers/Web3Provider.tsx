"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiConfig, chains } from "@/lib/web3";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from "react";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: "#3B82F6", // blue-500
          accentColorForeground: "white",
          borderRadius: "medium",
        })}
        coolMode
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
