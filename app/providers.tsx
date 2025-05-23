"use client";

import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { baseGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PositionsProvider } from "@/components/trading/PositionsContext";

// Replace the hardcoded projectId with:
let projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;


if (!projectId) {
  console.warn('WalletConnect Project ID tidak ditemukan');
  projectId = "93bd6adc806e23fb5f54c3a66744c9e4";
}

const { chains, publicClient } = configureChains([baseGoerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "BeTheNation",
  projectId: projectId, // Add project ID here
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <PositionsProvider>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </PositionsProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
