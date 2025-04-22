"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCountryData } from "@/hooks/useCountryData";
import { useWeb3 } from "@/hooks/useWeb3";
import { CountryPositionsList } from "@/components/trading/CountryPositionsList";
import { useContract } from "@/hooks/useContract";
import { useToast } from "@/components/ui/use-toast";
import { usePositionCreation } from "@/hooks/usePositionCreation";
import { USDCApproval } from "@/components/ui/usdc-approval";

// Sample country data - in a real app, this would come from an API
const countryData = {
  usa: {
    name: "USA",
    flagCode: "🇺🇸",
    countryScore: 1839,
    volume24h: "$1,500,000",
    indexPrice: "$1,300,000",
    sentiment: "Bullish",
    changePercent: 3.2,
    trend: "up",
    markPrice: "3.87M",
    fundingRate: "0.01%",
    openInterest: "$7,500,000",
    openTrades: "$120,800",
    volumes: "$200,000",
    fundingCooldown: "00:37:40",
    fundingPercent: "0.3000%",
    description:
      "The USA is one of the largest and most influential economies globally, driven by a diverse range of sectors including technology, finance, and consumer goods. With a CountryScore of 1,839, the U.S. reflects a strong economic performance, supported by GDP growth, low unemployment, and a stable inflation rate. The market is dominated by robust stock exchanges such as the S&P 500 and NASDAQ, which are major indicators of global investor sentiment.",
    liquidationPrice: "5.41M",
  },
};

export default function CountryPage() {
  const params = useParams();
  const countryId = typeof params.id === "string" ? params.id : "usa";
  const router = useRouter();
  const { isConnected, balance } = useWeb3();
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState(500);
  const { toast } = useToast();
  const { createPosition, isProcessing } = usePositionCreation();
  const [needsUSDCApproval, setNeedsUSDCApproval] = useState(false);

  const [country, setCountry] = useState(countryData.usa);

  // Calculate position size based on leverage and amount
  const positionSize = amount * leverage;

  // Convert string price to number for calculations
  const currentPrice = country?.markPrice
    ? parseFloat(country.markPrice as string)
    : 0;

  // Format the balance for display
  const formattedBalance =
    isConnected && balance ? parseFloat(balance.formatted).toFixed(2) : "0.00";

  // Convert formatted balance to number for validation
  const numericBalance =
    isConnected && balance ? parseFloat(balance.formatted) : 0;

  // Check if the amount exceeds the balance
  const isAmountValid = amount <= numericBalance;

  useEffect(() => {
    // In a real app, fetch the country data based on the ID
    if (countryId && countryData[countryId as keyof typeof countryData]) {
      setCountry(countryData[countryId as keyof typeof countryData]);
    }
  }, [countryId]);

  // Handle submitting a new trade
  const handlePlaceTrade = async () => {
    if (!isConnected || !isAmountValid || isProcessing) return;

    try {
      // If USDC approval is needed, don't proceed with the trade
      if (needsUSDCApproval) {
        toast({
          title: "USDC Approval Required",
          description: "Please approve USDC spending before opening a position",
          variant: "destructive",
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Processing Trade",
        description: "Your transaction is being processed...",
      });

      // Create a new position
      const result = await createPosition(
        countryId,
        country.name,
        direction,
        amount,
        leverage,
        currentPrice,
        currentPrice
      );

      if (result?.success) {
        // Clear the form or update UI as needed
        // No need for additional toast as the createPosition function handles it
      } else if (result?.code === "USDC_APPROVAL_REQUIRED") {
        // Handle USDC approval requirement
        setNeedsUSDCApproval(true);
        toast({
          title: "USDC Approval Required",
          description: "Please approve USDC spending before opening a position",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Trade Failed",
        description:
          error.message || "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle successful USDC approval
  const handleApprovalSuccess = () => {
    setNeedsUSDCApproval(false);
    toast({
      title: "USDC Approved",
      description:
        "You can now place your trade. Proceeding with transaction...",
      variant: "default",
    });

    // Add a short delay before retrying the trade to ensure the UI updates first
    setTimeout(() => {
      // Retry the trade now that we have approval
      handlePlaceTrade();
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen">
      {/* Back to Dashboard button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 mb-4 text-gray-400 hover:text-white bg-[#111111] rounded-lg"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back To Dashboard
      </Link>

      <div className="space-y-4">
        {/* Header Panel */}
        <div className="bg-[#111111] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <div className="text-4xl">{country.flagCode}</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{country.name}</h2>
              <p className="text-[#1EFA10] font-medium text-lg">
                {country.countryScore}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">$</span>
                </div>
                <span className="text-gray-400 text-sm">Open Trades</span>
              </div>
              <p className="text-white font-medium">{country.openTrades}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">V</span>
                </div>
                <span className="text-gray-400 text-sm">Volumes</span>
              </div>
              <p className="text-white font-medium">{country.volumes}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">%</span>
                </div>
                <span className="text-gray-400 text-sm">Funding/Cooldown</span>
              </div>
              <p className="text-[#1EFA10] font-medium">
                {country.fundingPercent} {country.fundingCooldown}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chart Panel */}
          <div className="md:col-span-2 bg-[#111111] rounded-xl p-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-gray-300 text-sm">Live Countryscore</h3>
              <span className="text-[#1EFA10] font-medium">
                {country.countryScore}
              </span>
            </div>

            <div className="h-64 w-full">
              {/* Replace with actual chart component */}
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <path
                  d="M0,200 L20,180 C40,160 60,140 80,150 C100,160 120,170 140,150 C160,130 180,110 200,115 C220,120 240,125 260,100 C280,75 300,50 320,75 C340,100 360,125 380,100 C400,75 420,50 440,30 C460,10 480,0 500,0"
                  fill="none"
                  stroke="#1EFA10"
                  strokeWidth="3"
                />
                <path
                  d="M0,200 L20,180 C40,160 60,140 80,150 C100,160 120,170 140,150 C160,130 180,110 200,115 C220,120 240,125 260,100 C280,75 300,50 320,75 C340,100 360,125 380,100 C400,75 420,50 440,30 C460,10 480,0 500,0 L500,200 L0,200"
                  fill="url(#greenGradient)"
                  fillOpacity="0.3"
                />
                <defs>
                  <linearGradient
                    id="greenGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#1EFA10" stopOpacity="0.7" />
                    <stop offset="30%" stopColor="#1EFA10" stopOpacity="0.4" />
                    <stop
                      offset="100%"
                      stopColor="#1EFA10"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>00:10</span>
              <span>02:00</span>
              <span>04:00</span>
              <span>06:00</span>
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="bg-[#111111] rounded-xl p-4">
            <div className="bg-[#1A1A1A] rounded-full flex mb-4">
              <button
                className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center ${
                  direction === "long"
                    ? "bg-[#00E084] text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setDirection("long")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5 5 5"
                  />
                </svg>
                Long
              </button>
              <button
                className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center ${
                  direction === "short"
                    ? "bg-[#FF4B4B] text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setDirection("short")}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 13l5 5 5-5"
                  />
                </svg>
                Short
              </button>
            </div>

            <h3 className="text-white font-medium mb-2">Market</h3>
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">
                Balance :{" "}
                {isConnected && balance ? `$${formattedBalance}` : "$0.00"}
              </span>
              <button className="text-blue-400 text-sm">Deposit Funds</button>
            </div>

            <div className="bg-[#1A1A1A] rounded-md p-3 flex justify-between items-center mb-4">
              <span className="text-gray-400">Amount</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className={`bg-transparent text-right w-24 outline-none ${
                    isAmountValid ? "text-white" : "text-red-500"
                  }`}
                />
                <span className="text-white">nUSDC</span>
              </div>
            </div>
            <div className="mb-4">
              <Slider
                defaultValue={[leverage]}
                max={5}
                step={1}
                onValueChange={(vals) => setLeverage(vals[0])}
                className="mt-2"
              />
              <div className="flex justify-end mt-1">
                <span className="text-gray-400 text-sm">x{leverage}</span>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">Size = Entry Price</div>
                  <div className="text-white">
                    ${positionSize} at {country.markPrice}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">Liquidated at</div>
                  <div className="text-white">{country.liquidationPrice}</div>
                </div>
              </div>
            </div>

            {/* Add USDC Approval UI when needed */}
            {needsUSDCApproval && (
              <div className="mb-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                <USDCApproval
                  amount={amount.toString()}
                  onSuccess={handleApprovalSuccess}
                />
              </div>
            )}

            <button
              className={`w-full py-3 rounded-md font-medium shadow-lg transition-colors ${
                isConnected &&
                isAmountValid &&
                !isProcessing &&
                !needsUSDCApproval
                  ? "bg-[#1a7cff] text-white hover:bg-blue-500"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              disabled={
                !isConnected ||
                !isAmountValid ||
                isProcessing ||
                needsUSDCApproval
              }
              onClick={handlePlaceTrade}
            >
              {!isConnected
                ? "Connect Wallet to Trade"
                : !isAmountValid
                ? "Insufficient Balance"
                : isProcessing
                ? "Processing..."
                : needsUSDCApproval
                ? "Approve USDC First"
                : "Place Trade"}
            </button>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* About Panel */}
          <div className="bg-[#111111] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">About</h3>
              <button className="text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {country.description}
            </p>
          </div>

          {/* Leaderboard Panel */}
          <div className="bg-[#111111] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Leaderboard</h3>
              <button className="text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-500 mb-4 border-b border-[#222222] pb-3">
              You are ranked 167th in Indonesia
            </p>

            <div className="space-y-0">
              {/* User 1 */}
              <div className="py-3 border-b border-[#222222]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-14">Rank #1</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src="/sarah.jpg"
                        alt="Profile 1"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm">0xMeilline</span>
                  </div>
                  <span className="text-[#1EFA10]">$250,000</span>
                </div>
              </div>

              {/* User 2 */}
              <div className="py-3 border-b border-[#222222]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-14">Rank #2</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src="/john.jpg"
                        alt="Profile 2"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm">0xClara</span>
                  </div>
                  <span className="text-[#1EFA10]">$12,000</span>
                </div>
              </div>

              {/* User 3 */}
              <div className="py-3 border-b border-[#222222]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-14">Rank #3</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src="/david.jpg"
                        alt="Profile 3"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm">0xEdward</span>
                  </div>
                  <span className="text-[#1EFA10]">$10,000</span>
                </div>
              </div>

              {/* User 167 */}
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-14">
                      Rank #167
                    </span>
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder-user.jpg"
                        alt="Profile 4"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm">0xCeline</span>
                  </div>
                  <span className="text-[#1EFA10]">$1,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Positions Panel */}
          <div className="bg-[#111111] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Positions</h3>
              <button className="text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            <CountryPositionsList
              countryId={countryId}
              currentPrice={currentPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
