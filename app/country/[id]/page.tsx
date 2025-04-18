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

  const [country, setCountry] = useState(countryData.usa);

  // Calculate position size based on leverage and amount
  const positionSize = amount * leverage;

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

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen">
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
{/* p */}
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

            <button
              className={`w-full py-3 rounded-md font-medium shadow-lg transition-colors ${
                isConnected && isAmountValid
                  ? "bg-[#1a7cff] text-white hover:bg-blue-500"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!isConnected || !isAmountValid}
            >
              {!isConnected
                ? "Connect Wallet to Trade"
                : !isAmountValid
                ? "Insufficient Balance"
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

            <div>
              <div className="flex items-center gap-2 pb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-white">USA</div>
                <div className="ml-auto text-red-500">-$0.24 (-0.0%)</div>
              </div>

              <div className="border-t border-[#222222] py-3">
                <div className="flex justify-between text-sm py-1">
                  <div className="text-gray-400">Position Size</div>
                  <div className="text-white">$1,750</div>
                </div>

                <div className="flex justify-between text-sm py-1">
                  <div className="text-gray-400">Entry Price</div>
                  <div className="text-white">3.87M</div>
                </div>

                <div className="flex justify-between text-sm py-1">
                  <div className="text-gray-400">Liquidation Price</div>
                  <div className="text-white">8.58M</div>
                </div>

                <div className="flex justify-between text-sm py-1">
                  <div className="text-gray-400">Fees</div>
                  <div className="text-white">$2.50</div>
                </div>
              </div>

              <div className="border-t border-[#222222] pt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-gray-400">Abstract</div>
                <div className="ml-auto text-green-500">$0.24 (+0.5%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
