"use client";

import EnhancedCountryList from "@/components/dashboard/EnhancedCountryList";
import BalanceDisplay from "@/components/ui/balance-display";
import Image from "next/image";
import { useWeb3 } from "@/hooks/useWeb3";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button";

export default function Dashboard() {
  const { address, isConnected } = useWeb3();
  const shortenedAddress = address
    ? `0x${address.substring(2, 6)}...${address.substring(address.length - 4)}`
    : "Connect Wallet";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header/Navbar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#222]">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="h-8 w-8 rounded-full bg-amber-600/80 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">⊕</span>
            </div>
            <span className="text-white font-medium">BeTheNation.Fun</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
              <Image
                src="/placeholder-user.jpg"
                alt="User"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="text-white text-sm">{shortenedAddress}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-xl text-white font-semibold mb-4">
              Connect your wallet to view country markets
            </h2>
            <p className="text-gray-400 mb-6">
              Access the trading platform by connecting your wallet
            </p>
            <ConnectWalletButton />
          </div>
        ) : (
          <EnhancedCountryList />
        )}
      </div>
    </div>
  );
}
