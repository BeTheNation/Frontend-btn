"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type CountryData = {
  id: string;
  name: string;
  flagCode: string;
  countryScore: number;
  volume24h: string;
  indexPrice: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  changePercent: number;
  trend: "up" | "down";
};

const countryData: CountryData[] = [
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
    sentiment: "Neutral",
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
    id: "korea",
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

export default function TradingPlatform() {
  const [activeTab, setActiveTab] = useState("Country");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter countries based on search term
  const filteredCountries = countryData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with search */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-amber-500">
            {/* Removed BeTheNation.Fun text */}
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search countries"
              className="bg-gray-900 border border-gray-700 rounded-full px-4 py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab selection */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4">
            <button
              className={`py-4 px-4 font-medium text-sm relative ${
                activeTab === "Country"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("Country")}
            >
              Country
              {activeTab === "Country" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
              )}
            </button>
            <button
              className={`py-4 px-4 font-medium text-sm relative ${
                activeTab === "Sport"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("Sport")}
            >
              Sport
              {activeTab === "Sport" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <Link
              key={country.id}
              href={`/country/${country.id}`}
              className="block"
            >
              <div className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition duration-200 h-full">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{country.flagCode}</div>
                      <div className="font-medium">{country.name}</div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        country.trend === "up"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {country.trend === "up" ? "+" : ""}
                      {country.changePercent}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-sm">CountryScore:</div>
                      <div className="font-medium">
                        {country.countryScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-sm">24H Volume:</div>
                      <div className="font-medium">{country.volume24h}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-sm">Index Price:</div>
                      <div className="font-medium">{country.indexPrice}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-sm">
                        Market Sentiment:
                      </div>
                      <div
                        className={`font-medium ${
                          country.sentiment === "Bullish"
                            ? "text-green-400"
                            : country.sentiment === "Bearish"
                            ? "text-red-400"
                            : ""
                        }`}
                      >
                        {country.sentiment}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
                      Trade Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
