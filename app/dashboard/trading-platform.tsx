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
      {/* Tab selection */}
      <div className="pt-4 pb-2 px-4">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-6 text-sm font-medium rounded-full border ${
              activeTab === "Country"
                ? "border-white bg-transparent text-white"
                : "border-gray-700 text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("Country")}
          >
            {activeTab === "Country" && <span className="mr-2">✓</span>}
            Country
          </button>
          <button
            className={`py-2 px-6 text-sm font-medium rounded-full border ${
              activeTab === "Sport"
                ? "border-white bg-transparent text-white"
                : "border-gray-700 text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("Sport")}
          >
            Sport
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCountries.map((country) => (
            <Link
              key={country.id}
              href={`/country/${country.id}`}
              className="block"
            >
              <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#222222] h-full">
                <div className="p-4">
                  {/* Country header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{country.flagCode}</div>
                      <div className="font-medium text-white">
                        {country.name}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        country.trend === "up"
                          ? "bg-green-700 text-green-400"
                          : "bg-red-700 text-red-500"
                      }`}
                    >
                      {country.trend === "up" ? "+" : ""}
                      {country.changePercent}%
                    </div>
                  </div>

                  {/* Country data */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <div className="text-gray-500">CountryScore :</div>
                      <div className="font-medium text-white text-right">
                        {country.countryScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-500">24H Volume :</div>
                      <div className="font-medium text-white text-right">
                        {country.volume24h}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-500">Index Price :</div>
                      <div className="font-medium text-white text-right">
                        {country.indexPrice}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-500">Market Sentiment :</div>
                      <div
                        className={`font-medium text-right ${
                          country.sentiment === "Bullish"
                            ? "text-green-400"
                            : country.sentiment === "Bearish"
                            ? "text-red-500"
                            : "text-gray-300" // For Neutral
                        }`}
                      >
                        {country.sentiment}
                      </div>
                    </div>
                  </div>

                  {/* Trade button */}
                  <div className="mt-4">
                    <button className="w-full bg-[#1E6FF7] hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium transition">
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
