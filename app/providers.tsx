"use client";

import { type ReactNode } from "react";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { PredictionMarketProvider } from "@/contexts/PredictionMarketContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DemoModeProvider>
        <Web3Provider>
          <PredictionMarketProvider>{children}</PredictionMarketProvider>
        </Web3Provider>
      </DemoModeProvider>
    </ThemeProvider>
  );
}
