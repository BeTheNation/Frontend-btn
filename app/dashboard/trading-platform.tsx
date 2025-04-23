"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CountryCard from "@/components/dashboard/CountryCard";
import HistoryTable from "@/components/dashboard/HistoryTable";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  // Filter countries based on search term
  const filteredCountries = countryData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#111214] text-white">
      {/* Header with Tabs and Search */}
      <div className="p-6 bg-[#111214]">
        <div className="self-stretch inline-flex justify-between items-center w-full">
          <div className="px-2 py-[7px] rounded-[100px] outline outline-2 outline-offset-[-2px] outline-[#1d1f22] flex justify-start items-center gap-2.5">
            <motion.button 
              onClick={() => setActiveTab("discover")}
              className={`h-[63px] px-6 py-1.5 ${activeTab === "discover" ? "bg-[#262a33]" : ""} rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-start items-center gap-4 flex-wrap content-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={`justify-start ${activeTab === "discover" ? "text-white" : "text-[#505050]"} text-xl font-normal font-['Inter'] leading-tight`}>
                Discover
              </div>
            </motion.button>
            <motion.button 
              onClick={() => setActiveTab("history")}
              className={`h-[63px] px-6 py-1.5 ${activeTab === "history" ? "bg-[#262a33]" : ""} rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-start items-center gap-4 flex-wrap content-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={`justify-start ${activeTab === "history" ? "text-white" : "text-[#505050]"} text-xl font-normal font-['Inter'] leading-tight`}>
                History
              </div>
            </motion.button>
          </div>
          <AnimatePresence>
            {activeTab === "discover" && (
              <motion.div 
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-[445px] h-[63px] px-6 py-1.5 bg-[#1d1f22] rounded-full shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex items-center gap-4 relative">
                  <div className="w-[34px] h-[34px] relative overflow-hidden flex-shrink-0">
                    <svg
                      className="w-[27.07px] h-[27.07px] absolute left-[2.83px] top-[2.83px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                        stroke="#D6D6D6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent text-[#d6d6d6] text-xl font-normal font-['Inter'] leading-tight focus:outline-none"
                    />
                    {!searchTerm && (
                      <div className="absolute inset-0 pointer-events-none text-[#d6d6d6] text-xl font-normal font-['Inter'] leading-tight">
                        Search countries
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 pt-2 bg-[#111214]">
        <AnimatePresence mode="wait">
          {activeTab === "discover" ? (
            <motion.div 
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center"
            >
              {filteredCountries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <HistoryTable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
