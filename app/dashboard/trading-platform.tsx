"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define country data to match the reference screenshot
const countries = [
  {
    id: "usa",
    name: "USA",
    flagCode: "🇺🇸",
    countryScore: 1839,
    volume24h: "$1,500,000",
    indexPrice: "$1,300,000",
    sentiment: "Bullish",
    changePercent: 3.2,
    trend: "up",
  },
  {
    id: "germany",
    name: "Germany",
    flagCode: "🇩🇪",
    countryScore: 1200,
    volume24h: "$800,000",
    indexPrice: "$1,100,000",
    sentiment: "Bearish",
    changePercent: -1.8,
    trend: "down",
  },
  {
    id: "japan",
    name: "Japan",
    flagCode: "🇯🇵",
    countryScore: 1600,
    volume24h: "$1,050,000",
    indexPrice: "$950,000",
    sentiment: "Bearish",
    changePercent: 0.5,
    trend: "up",
  },
  {
    id: "india",
    name: "India",
    flagCode: "🇮🇳",
    countryScore: 1050,
    volume24h: "$1,200,000",
    indexPrice: "$850,000",
    sentiment: "Bullish",
    changePercent: 2.1,
    trend: "up",
  },
  {
    id: "brazil",
    name: "Brazil",
    flagCode: "🇧🇷",
    countryScore: 900,
    volume24h: "$600,000",
    indexPrice: "$720,000",
    sentiment: "Bearish",
    changePercent: -0.3,
    trend: "down",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flagCode: "🇬🇧",
    countryScore: 1500,
    volume24h: "$2,000,000",
    indexPrice: "$1,350,000",
    sentiment: "Bullish",
    changePercent: 4.5,
    trend: "up",
  },
  {
    id: "china",
    name: "China",
    flagCode: "🇨🇳",
    countryScore: 1700,
    volume24h: "$1,500,000",
    indexPrice: "$1,100,000",
    sentiment: "Bullish",
    changePercent: 2.7,
    trend: "up",
  },
  {
    id: "canada",
    name: "Canada",
    flagCode: "🇨🇦",
    countryScore: 1400,
    volume24h: "$900,000",
    indexPrice: "$1,250,000",
    sentiment: "Neutral",
    changePercent: 1.1,
    trend: "up",
  },
  {
    id: "australia",
    name: "Australia",
    flagCode: "🇦🇺",
    countryScore: 1450,
    volume24h: "$850,000",
    indexPrice: "$1,150,000",
    sentiment: "Bullish",
    changePercent: 3.3,
    trend: "up",
  },
  {
    id: "mexico",
    name: "Mexico",
    flagCode: "🇲🇽",
    countryScore: 950,
    volume24h: "$500,000",
    indexPrice: "$720,000",
    sentiment: "Bearish",
    changePercent: -2.1,
    trend: "down",
  },
  {
    id: "russia",
    name: "Russia",
    flagCode: "🇷🇺",
    countryScore: 1200,
    volume24h: "$600,000",
    indexPrice: "$1,000,000",
    sentiment: "Bearish",
    changePercent: -1.5,
    trend: "down",
  },
  {
    id: "southkorea",
    name: "South Korea",
    flagCode: "🇰🇷",
    countryScore: 1300,
    volume24h: "$750,000",
    indexPrice: "$1,080,000",
    sentiment: "Neutral",
    changePercent: 0.8,
    trend: "up",
  },
];

const TradingPlatform = () => {
  const [filter, setFilter] = useState("Country");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top navigation bar */}
      <header className="border-b border-gray-800/50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-amber-600/30 flex items-center justify-center">
              <Image
                src="/placeholder-logo.svg"
                alt="BeTheNation.Fun"
                width={28}
                height={28}
              />
            </div>
            <h1 className="text-xl font-semibold">BeTheNation.Fun</h1>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-64 p-2 pl-10 text-sm bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search countries"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden">
                <Image
                  src="/placeholder-user.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-gray-300">0xAhmadTaufiq</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="border-b border-gray-800/50 px-6">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            className={`py-3 px-5 relative ${
              filter === "Country"
                ? "text-white"
                : "text-gray-500 hover:text-gray-400"
            }`}
            onClick={() => setFilter("Country")}
          >
            {filter === "Country" && (
              <svg
                className="absolute left-0 right-0 bottom-0 h-0.5 w-full"
                viewBox="0 0 100 1"
                fill="none"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            )}
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Country
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
          <button
            className={`py-3 px-5 relative ${
              filter === "Sport"
                ? "text-white"
                : "text-gray-500 hover:text-gray-400"
            }`}
            onClick={() => setFilter("Sport")}
          >
            {filter === "Sport" && (
              <svg
                className="absolute left-0 right-0 bottom-0 h-0.5 w-full"
                viewBox="0 0 100 1"
                fill="none"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            )}
            Sport
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/country/${country.id}`}
              className="bg-[#141414] hover:bg-[#1A1A1A] rounded-lg border border-gray-800/50 p-5 transition-colors duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-800">
                    <span className="text-lg">{country.flagCode}</span>
                  </div>
                  <span className="font-semibold">{country.name}</span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-sm font-medium ${
                    country.trend === "up"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {country.trend === "up" ? "+" : ""}
                  {country.changePercent}%
                </div>
              </div>

              {/* Stats section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">CountryScore:</span>
                  <span className="font-medium">{country.countryScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">24H Volume:</span>
                  <span className="font-medium">{country.volume24h}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Index Price:</span>
                  <span className="font-medium">{country.indexPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Market Sentiment:
                  </span>
                  <span
                    className={`font-medium ${
                      country.sentiment === "Bullish"
                        ? "text-green-500"
                        : country.sentiment === "Bearish"
                        ? "text-red-500"
                        : "text-gray-300"
                    }`}
                  >
                    {country.sentiment}
                  </span>
                </div>
              </div>

              {/* Trade button */}
              <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200">
                Trade Now
              </button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TradingPlatform;
