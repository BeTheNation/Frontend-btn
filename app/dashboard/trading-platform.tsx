"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Placeholder chart component - in a real app, you'd use a chart library like recharts, chart.js, etc.
const ChartComponent = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-64 ${className}`}>
    <div className="absolute inset-0 bg-[#0A1428]/70 rounded-xl overflow-hidden">
      <div className="h-full w-full relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 200"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 200L4 196C8 192 16 184 24 180C32 176 40 176 48 172C56 168 64 160 72 156C80 152 88 152 96 148C104 144 112 136 120 140C128 144 136 160 144 164C152 168 160 160 168 152C176 144 184 136 192 136C200 136 208 144 216 148C224 152 232 152 240 148C248 144 256 136 264 132C272 128 280 128 288 136C296 144 304 160 312 160C320 160 328 144 336 136C344 128 352 128 360 120C368 112 376 96 384 88C392 80 396 80 398 80L400 80"
            stroke="#22C55E"
            strokeWidth="3"
            fill="none"
          />
          <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
          <path
            d="M0 200L4 196C8 192 16 184 24 180C32 176 40 176 48 172C56 168 64 160 72 156C80 152 88 152 96 148C104 144 112 136 120 140C128 144 136 160 144 164C152 168 160 160 168 152C176 144 184 136 192 136C200 136 208 144 216 148C224 152 232 152 240 148C248 144 256 136 264 132C272 128 280 128 288 136C296 144 304 160 312 160C320 160 328 144 336 136C344 128 352 128 360 120C368 112 376 96 384 88C392 80 396 80 398 80L400 80 L400 200 L0 200Z"
            fill="url(#gradientFill)"
          />
        </svg>
      </div>
    </div>
  </div>
);

// Sample data for the UI
const countries = [
  { id: "usa", name: "USA", currentValue: 1250, change: 3.5, trend: "up" },
  { id: "jpn", name: "Japan", currentValue: 950, change: -1.2, trend: "down" },
  { id: "deu", name: "Germany", currentValue: 1120, change: 2.1, trend: "up" },
  { id: "gbr", name: "UK", currentValue: 980, change: -0.7, trend: "down" },
  { id: "fra", name: "France", currentValue: 1050, change: 1.4, trend: "up" },
];

const leaderboardData = [
  { rank: 1, user: "Trader123", pnl: 245000, avatar: "/placeholder-user.jpg" },
  { rank: 2, user: "CryptoKing", pnl: 187000, avatar: "/placeholder-user.jpg" },
  {
    rank: 3,
    user: "AlphaInvestor",
    pnl: 125000,
    avatar: "/placeholder-user.jpg",
  },
  { rank: 4, user: "EconomyGuru", pnl: 98000, avatar: "/placeholder-user.jpg" },
  {
    rank: 5,
    user: "MarketMaster",
    pnl: 76000,
    avatar: "/placeholder-user.jpg",
  },
];

const TradingPlatform = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <div className="min-h-screen bg-[#050B17] text-white pb-16">
      {/* Header with CTA */}
      <header className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Country Performance Trading
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Experience the future of trading with real-time economic
              indicators, perpetual contracts, and advanced analytics. Predict
              country performance and maximize your returns.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30">
                Start Trading Now
              </button>
              <button className="bg-transparent border border-blue-500/50 px-6 py-3 rounded-lg font-medium hover:bg-blue-900/20 transition-all">
                Explore Markets
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Trading Platform */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Trading information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Country Selection */}
            <div className="bg-[#0A1428] rounded-xl border border-blue-900/20 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                Select Country Market
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {countries.map((country) => (
                  <div
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                      ${
                        selectedCountry.id === country.id
                          ? "bg-blue-900/30 border border-blue-500/50"
                          : "bg-[#111827]/60 hover:bg-[#111827] border border-transparent"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold">
                          {country.name.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{country.name}</div>
                        <div className="text-xs text-gray-400">
                          Current Index
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${country.currentValue}</div>
                      <div
                        className={`text-xs ${
                          country.trend === "up"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {country.trend === "up" ? "▲" : "▼"}{" "}
                        {Math.abs(country.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Form */}
            <div className="bg-[#0A1428] rounded-xl border border-blue-900/20 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                Place Trade
              </h2>

              <div className="mb-6 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  {selectedCountry.name}
                </div>
                <div className="flex">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-l-lg">
                    Long
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-lg">
                    Short
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Amount (USD)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0D1B2F] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Leverage
                  </label>
                  <div className="w-full bg-[#0D1B2F] h-2 rounded-full mb-1 relative">
                    <div className="absolute w-1/3 h-full bg-blue-500 rounded-full"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1x</span>
                    <span>5x</span>
                    <span>10x</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Entry Price
                    </label>
                    <div className="bg-[#0D1B2F] border border-gray-700 rounded-lg px-4 py-2">
                      ${selectedCountry.currentValue}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Position Size
                    </label>
                    <div className="bg-[#0D1B2F] border border-gray-700 rounded-lg px-4 py-2">
                      $3,000
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg mt-4 hover:from-blue-500 hover:to-indigo-500 transition-all">
                  Place Trade
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Live data and visualizations */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main chart */}
            <div className="bg-[#0A1428] rounded-xl border border-blue-900/20 p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-100">
                    {selectedCountry.name} Performance
                  </h2>
                  <p className="text-sm text-gray-400">Economic Index Trend</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-900/30 hover:bg-blue-900/50 text-xs px-3 py-1 rounded-full">
                    1D
                  </button>
                  <button className="bg-blue-600 text-xs px-3 py-1 rounded-full">
                    1W
                  </button>
                  <button className="bg-blue-900/30 hover:bg-blue-900/50 text-xs px-3 py-1 rounded-full">
                    1M
                  </button>
                  <button className="bg-blue-900/30 hover:bg-blue-900/50 text-xs px-3 py-1 rounded-full">
                    1Y
                  </button>
                </div>
              </div>

              <ChartComponent className="mb-4" />

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-[#0D1B2F]/80 p-3 rounded-lg">
                  <div className="text-xs text-gray-400">GDP Growth</div>
                  <div className="font-medium text-green-400">+2.3%</div>
                </div>
                <div className="bg-[#0D1B2F]/80 p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Inflation</div>
                  <div className="font-medium text-yellow-400">3.6%</div>
                </div>
                <div className="bg-[#0D1B2F]/80 p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Unemployment</div>
                  <div className="font-medium text-blue-400">4.2%</div>
                </div>
                <div className="bg-[#0D1B2F]/80 p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Currency</div>
                  <div className="font-medium text-purple-400">-0.5%</div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Perpetual Contracts Card */}
              <div className="bg-gradient-to-br from-[#0A1428] to-[#162A46] rounded-xl border border-blue-900/30 p-5 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mt-10 -mr-10"></div>
                <div className="relative z-10">
                  <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Perpetual Contracts
                  </h3>
                  <p className="text-sm text-gray-300">
                    Trade with no expiration dates on positions. Hold as long as
                    market conditions favor your strategy.
                  </p>
                </div>
              </div>

              {/* Economic Indicators Card */}
              <div className="bg-gradient-to-br from-[#0A1428] to-[#1A2D46] rounded-xl border border-blue-900/30 p-5 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -mt-10 -mr-10"></div>
                <div className="relative z-10">
                  <div className="bg-indigo-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Economic Indicators
                  </h3>
                  <p className="text-sm text-gray-300">
                    Track GDP, inflation, currency strength and more to make
                    informed trading decisions.
                  </p>
                </div>
              </div>

              {/* Leverage Options Card */}
              <div className="bg-gradient-to-br from-[#0A1428] to-[#2E2846] rounded-xl border border-blue-900/30 p-5 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mt-10 -mr-10"></div>
                <div className="relative z-10">
                  <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Leverage Options
                  </h3>
                  <p className="text-sm text-gray-300">
                    Trade with up to 10x leverage to maximize potential returns
                    while managing risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#0A1428] rounded-xl border border-blue-900/20 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                Live Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboardData.map((trader) => (
                  <div
                    key={trader.rank}
                    className="flex items-center justify-between p-3 bg-[#0D1B2F]/80 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold mr-3">
                        {trader.rank}
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden mr-3">
                          <Image
                            src={trader.avatar}
                            alt={trader.user}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div className="font-medium">{trader.user}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      ${trader.pnl.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center py-2 text-sm text-blue-400 hover:text-blue-300">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlatform;
