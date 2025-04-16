"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CountryData } from "@/app/dashboard/trading-platform";

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
    markPrice: "$1,302,500",
    fundingRate: "0.01%",
    openInterest: "$7,500,000",
    description:
      "The United States economy is the world's largest by nominal GDP, characterized by high innovation, diverse sectors, and strong consumer spending. Recent fiscal policies have aimed to boost infrastructure and manufacturing.",
    market: {
      lastTradePrice: "$1,302,450",
      bidPrice: "$1,302,400",
      askPrice: "$1,302,600",
      dayHigh: "$1,310,000",
      dayLow: "$1,298,500",
      volume: "$1,500,000",
    },
  },
  germany: {
    name: "Germany",
    flagCode: "🇩🇪",
    countryScore: 1200,
    volume24h: "$800,000",
    indexPrice: "$1,100,000",
    sentiment: "Bearish",
    changePercent: -1.8,
    trend: "down",
    markPrice: "$1,098,000",
    fundingRate: "-0.005%",
    openInterest: "$3,200,000",
    description:
      "Germany has Europe's largest economy, with a strong focus on manufacturing, exports and innovation. Recent challenges include energy transition and supply chain disruptions.",
    market: {
      lastTradePrice: "$1,097,850",
      bidPrice: "$1,097,800",
      askPrice: "$1,098,100",
      dayHigh: "$1,105,000",
      dayLow: "$1,095,200",
      volume: "$800,000",
    },
  },
  japan: {
    name: "Japan",
    flagCode: "🇯🇵",
    countryScore: 1600,
    volume24h: "$1,050,000",
    indexPrice: "$950,000",
    sentiment: "Bearish",
    changePercent: 0.5,
    trend: "up",
    markPrice: "$950,500",
    fundingRate: "0.003%",
    openInterest: "$2,800,000",
    description:
      "Japan's economy is highly industrialized and known for its technological innovation. The country faces challenges from an aging population and has implemented various stimulus measures to boost growth.",
    market: {
      lastTradePrice: "$950,450",
      bidPrice: "$950,300",
      askPrice: "$950,600",
      dayHigh: "$952,300",
      dayLow: "$948,100",
      volume: "$1,050,000",
    },
  },
};

// Sample positions data
const samplePositions = [
  {
    id: "pos-1",
    country: "USA",
    direction: "LONG",
    size: "$5,000",
    leverage: "5x",
    entryPrice: "$1,298,500",
    markPrice: "$1,302,500",
    pnl: "+$154",
    pnlPercent: "+3.08%",
    liquidationPrice: "$1,233,575",
  },
];

const CountryPage = () => {
  const params = useParams();
  const countryId = typeof params.id === "string" ? params.id : "";
  const router = useRouter();

  const [country, setCountry] = useState(countryData.usa);
  const [positions, setPositions] = useState(samplePositions);
  const [tradeAmount, setTradeAmount] = useState("1000");
  const [leverage, setLeverage] = useState(5);
  const [tradeDirection, setTradeDirection] = useState<"long" | "short" | null>(
    null
  );

  useEffect(() => {
    // In a real app, fetch the country data based on the ID
    if (countryId && countryData[countryId as keyof typeof countryData]) {
      setCountry(countryData[countryId as keyof typeof countryData]);
    }
  }, [countryId]);

  const closePosition = (positionId: string) => {
    setPositions(positions.filter((p) => p.id !== positionId));
  };

  const handlePlaceTrade = () => {
    if (!tradeDirection) return;

    // In a real app, this would connect to a smart contract to place the trade
    const newPosition = {
      id: `pos-${Date.now()}`,
      country: country.name,
      direction: tradeDirection === "long" ? "LONG" : "SHORT",
      size: `$${tradeAmount}`,
      leverage: `${leverage}x`,
      entryPrice: country.market.lastTradePrice,
      markPrice: country.markPrice,
      pnl: "+$0",
      pnlPercent: "0.00%",
      liquidationPrice: "$0",
    };

    setPositions([...positions, newPosition]);
    setTradeDirection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center text-xl font-bold text-amber-500"
          ></Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-8 px-6">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Country details */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 mr-3">
              <span className="text-lg">{country.flagCode}</span>
            </div>
            <h1 className="text-2xl font-bold">{country.name} Economy Index</h1>
            <div
              className={`ml-4 px-3 py-1 rounded-md text-sm font-medium ${
                country.trend === "up"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {country.trend === "up" ? "+" : ""}
              {country.changePercent}%
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Chart and market data */}
          <div className="lg:col-span-8 space-y-6">
            {/* Chart card */}
            <div className="bg-[#141414] border border-gray-800/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {country.name} Performance
                  </h2>
                  <p className="text-sm text-gray-400">Economic Index</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1 rounded-md">
                    1H
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1 rounded-md">
                    1D
                  </button>
                  <button className="bg-blue-600 text-xs px-3 py-1 rounded-md">
                    1W
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1 rounded-md">
                    1M
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1 rounded-md">
                    1Y
                  </button>
                </div>
              </div>

              {/* Price chart */}
              <div className="h-64 w-full relative mb-6">
                {/* This would be replaced with a real chart library like recharts or Chart.js */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 200"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  {/* Chart grid lines */}
                  <line
                    x1="0"
                    y1="0"
                    x2="600"
                    y2="0"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="600"
                    y2="50"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="600"
                    y2="100"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="600"
                    y2="150"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="200"
                    x2="600"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />

                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="120"
                    y1="0"
                    x2="120"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="240"
                    y1="0"
                    x2="240"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="360"
                    y1="0"
                    x2="360"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="480"
                    y1="0"
                    x2="480"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <line
                    x1="600"
                    y1="0"
                    x2="600"
                    y2="200"
                    stroke="#333"
                    strokeWidth="1"
                  />

                  {/* Chart line for the country performance */}
                  <path
                    d="M0 120C20 110 40 100 60 105C80 110 100 130 120 120C140 110 160 90 180 70C200 50 220 40 240 45C260 50 280 70 300 80C320 90 340 100 360 90C380 80 400 60 420 50C440 40 460 30 480 40C500 50 520 80 540 70C560 60 580 50 600 40"
                    stroke={country.trend === "up" ? "#22C55E" : "#EF4444"}
                    strokeWidth="3"
                    fill="none"
                  />

                  {/* Gradient fill underneath the line */}
                  <linearGradient
                    id="gradientFill"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={country.trend === "up" ? "#22C55E" : "#EF4444"}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor={country.trend === "up" ? "#22C55E" : "#EF4444"}
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <path
                    d="M0 120C20 110 40 100 60 105C80 110 100 130 120 120C140 110 160 90 180 70C200 50 220 40 240 45C260 50 280 70 300 80C320 90 340 100 360 90C380 80 400 60 420 50C440 40 460 30 480 40C500 50 520 80 540 70C560 60 580 50 600 40 L600 200 L0 200Z"
                    fill="url(#gradientFill)"
                  />
                </svg>

                {/* Time labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Mar 1</span>
                  <span>Mar 8</span>
                  <span>Mar 15</span>
                  <span>Mar 22</span>
                  <span>Mar 29</span>
                  <span>Apr 5</span>
                </div>

                {/* Price labels */}
                <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-xs text-gray-500 py-1">
                  <span>$1,350,000</span>
                  <span>$1,325,000</span>
                  <span>$1,300,000</span>
                  <span>$1,275,000</span>
                  <span>$1,250,000</span>
                </div>
              </div>

              {/* Market stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Mark Price</div>
                  <div className="font-medium">{country.markPrice}</div>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Funding Rate</div>
                  <div className="font-medium">{country.fundingRate}</div>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">
                    Open Interest
                  </div>
                  <div className="font-medium">{country.openInterest}</div>
                </div>
              </div>
            </div>

            {/* Market information */}
            <div className="bg-[#141414] border border-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Market Information</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  About {country.name} Economy
                </h3>
                <p className="text-sm text-gray-300">{country.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Last Trade Price
                  </div>
                  <div className="font-medium">
                    {country.market.lastTradePrice}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                  <div className="font-medium">{country.volume24h}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Bid Price</div>
                  <div className="font-medium">{country.market.bidPrice}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ask Price</div>
                  <div className="font-medium">{country.market.askPrice}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">24h High</div>
                  <div className="font-medium">{country.market.dayHigh}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">24h Low</div>
                  <div className="font-medium">{country.market.dayLow}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Trading panel and positions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Trading panel */}
            <div className="bg-[#141414] border border-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Place Trade</h2>

              {/* Direction selection */}
              <div className="flex justify-between items-center mb-6">
                <button
                  className={`w-1/2 py-3 rounded-l-md font-medium text-center transition-colors ${
                    tradeDirection === "long"
                      ? "bg-green-600 text-white"
                      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                  }`}
                  onClick={() => setTradeDirection("long")}
                >
                  LONG
                </button>
                <button
                  className={`w-1/2 py-3 rounded-r-md font-medium text-center transition-colors ${
                    tradeDirection === "short"
                      ? "bg-red-600 text-white"
                      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                  }`}
                  onClick={() => setTradeDirection("short")}
                >
                  SHORT
                </button>
              </div>

              {/* Amount input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <button
                      className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                      onClick={() => setTradeAmount("1000")}
                    >
                      $1K
                    </button>
                    <button
                      className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                      onClick={() => setTradeAmount("5000")}
                    >
                      $5K
                    </button>
                  </div>
                </div>
              </div>

              {/* Leverage slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-400">Leverage</label>
                  <span className="text-sm font-medium">{leverage}x</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1x</span>
                    <span>5x</span>
                    <span>10x</span>
                  </div>
                </div>
              </div>

              {/* Trade details */}
              <div className="bg-[#1a1a1a] p-4 rounded-md mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Entry Price</span>
                  <span className="font-medium">
                    {country.market.lastTradePrice}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Position Size</span>
                  <span className="font-medium">
                    ${parseInt(tradeAmount) * leverage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Est. Liquidation Price
                  </span>
                  {tradeDirection === "long" && (
                    <span className="font-medium">
                      $
                      {(
                        parseInt(
                          country.market.lastTradePrice.replace(/[^0-9]/g, "")
                        ) * 0.95
                      ).toLocaleString()}
                    </span>
                  )}
                  {tradeDirection === "short" && (
                    <span className="font-medium">
                      $
                      {(
                        parseInt(
                          country.market.lastTradePrice.replace(/[^0-9]/g, "")
                        ) * 1.05
                      ).toLocaleString()}
                    </span>
                  )}
                  {!tradeDirection && <span className="font-medium">-</span>}
                </div>
              </div>

              {/* Trade button */}
              <button
                className={`w-full py-3 rounded-md font-medium text-center transition-colors ${
                  !tradeDirection
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : tradeDirection === "long"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                disabled={!tradeDirection}
                onClick={handlePlaceTrade}
              >
                {!tradeDirection
                  ? "Select Direction"
                  : tradeDirection === "long"
                  ? "Open Long Position"
                  : "Open Short Position"}
              </button>
            </div>

            {/* Positions */}
            <div className="bg-[#141414] border border-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Your Positions</h2>

              {positions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 mx-auto mb-2 opacity-50"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                    />
                  </svg>
                  <p>No open positions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="bg-[#1a1a1a] p-4 rounded-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              position.direction === "LONG"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {position.direction}
                          </div>
                          <span className="ml-2 font-medium">
                            {position.country}
                          </span>
                        </div>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => closePosition(position.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                        <div>
                          <div className="text-xs text-gray-400">Size</div>
                          <div className="font-medium">
                            {position.size} ({position.leverage})
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">PnL</div>
                          <div
                            className={`font-medium ${
                              position.pnl.startsWith("+")
                                ? "text-green-400"
                                : position.pnl.startsWith("-")
                                ? "text-red-400"
                                : ""
                            }`}
                          >
                            {position.pnl} ({position.pnlPercent})
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">
                            Entry Price
                          </div>
                          <div className="font-medium">
                            {position.entryPrice}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">
                            Mark Price
                          </div>
                          <div className="font-medium">
                            {position.markPrice}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Liq. Price: {position.liquidationPrice}</span>
                        <button className="text-blue-400 hover:text-blue-300">
                          Edit Position
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryPage;
