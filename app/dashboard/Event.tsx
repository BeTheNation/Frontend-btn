"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountryCard from "@/components/dashboard/CountryCard";
import { RPC_URL } from "@/lib/contracts/constants";
import { fetcher } from "@/src/services/fetcher";
import useSWR from "swr";
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
  status: string;
};

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "Trump will announce new tariffs on China before July 2025?",
    category: "Politics",
    endDate: "2025-07-15",
    volume: "$2,450,000",
    yesPrice: 0.65,
    noPrice: 0.35,
    yesChange: +2.3,
    noChange: -2.3,
    liquidity: "$850,000",
    participants: 1247,
    status: "active",
    image: "🇺🇸",
  },
  {
    id: 2,
    title: "Bitcoin will reach $150,000 by end of 2025?",
    category: "Crypto",
    endDate: "2025-12-31",
    volume: "$1,890,000",
    yesPrice: 0.42,
    noPrice: 0.58,
    yesChange: -1.8,
    noChange: +1.8,
    liquidity: "$680,000",
    participants: 892,
    status: "active",
    image: "₿",
  },
  {
    id: 3,
    title: "Indonesia will win ASEAN Cup 2025?",
    category: "Sports",
    endDate: "2025-08-20",
    volume: "$320,000",
    yesPrice: 0.28,
    noPrice: 0.72,
    yesChange: +0.5,
    noChange: -0.5,
    liquidity: "$95,000",
    participants: 234,
    status: "active",
    image: "🇮🇩",
  },
  {
    id: 4,
    title: "Apple will release AR glasses in 2025?",
    category: "Technology",
    endDate: "2025-12-31",
    volume: "$1,200,000",
    yesPrice: 0.33,
    noPrice: 0.67,
    yesChange: -0.2,
    noChange: +0.2,
    liquidity: "$440,000",
    participants: 567,
    status: "active",
    image: "🍎",
  },
  {
    id: 5,
    title: "Will there be a major earthquake (7.0+) in California in 2025?",
    category: "Science",
    endDate: "2025-12-31",
    volume: "$580,000",
    yesPrice: 0.15,
    noPrice: 0.85,
    yesChange: +0.1,
    noChange: -0.1,
    liquidity: "$180,000",
    participants: 123,
    status: "active",
    image: "🌍",
  },
  {
    id: 6,
    title: "Tesla stock will hit $500 before 2026?",
    category: "Finance",
    endDate: "2025-12-31",
    volume: "$890,000",
    yesPrice: 0.51,
    noPrice: 0.49,
    yesChange: +1.2,
    noChange: -1.2,
    liquidity: "$320,000",
    participants: 445,
    status: "coming_soon",
    image: "🚗",
  },
];

const categoriesNations = ["All", "Bullish", "Bearish", "Neutral"];

const categoriesEvent = [
  "All",
  "Politics",
  "Crypto",
  "Sports",
  "Technology",
  "Science",
  "Finance",
];

const EventCard = ({ event }: { event: any }) => {
  const [selectedSide, setSelectedSide] = useState<any>(null);
  const [amount, setAmount] = useState("");

  const formatPrice = (price: number) => `$${(price * 100).toFixed(0)}¢`;
  const formatChange = (change: number) =>
    change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

  const daysLeft = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      className="bg-[#1d1f22] rounded-[20px] p-6 border border-[#2a2d33] hover:border-[#3a3d43] transition-all duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{event.image}</div>
          <div>
            <span className="text-xs text-[#888] bg-[#262a33] px-2 py-1 rounded-full">
              {event.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#888]">Ends in</div>
          <div className="text-sm text-white font-medium">{daysLeft} days</div>
        </div>
      </div>

      {/* Event Title */}
      <h3 className="text-white font-medium text-base mb-4 leading-tight">
        {event.title}
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-[#888]">Volume</div>
          <div className="text-sm text-white font-medium">{event.volume}</div>
        </div>
        <div>
          <div className="text-xs text-[#888]">Traders</div>
          <div className="text-sm text-white font-medium">
            {event.participants.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Yes/No Options */}
      <div className="space-y-2 mb-4">
        <motion.button
          onClick={() => setSelectedSide(selectedSide === "yes" ? null : "yes")}
          className={`w-full p-3 rounded-xl border transition-all duration-200 ${
            selectedSide === "yes"
              ? "border-green-500 bg-green-500/10"
              : "border-[#2a2d33] hover:border-green-500/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white font-medium">YES</span>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold">
                {formatPrice(event.yesPrice)}
              </div>
              <div
                className={`text-xs ${
                  event.yesChange > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatChange(event.yesChange)}
              </div>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setSelectedSide(selectedSide === "no" ? null : "no")}
          className={`w-full p-3 rounded-xl border transition-all duration-200 ${
            selectedSide === "no"
              ? "border-red-500 bg-red-500/10"
              : "border-[#2a2d33] hover:border-red-500/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-white font-medium">NO</span>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">
                {formatPrice(event.noPrice)}
              </div>
              <div
                className={`text-xs ${
                  event.noChange > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatChange(event.noChange)}
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Trading Interface */}
      <AnimatePresence>
        {selectedSide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#2a2d33] pt-4"
          >
            <div className="mb-3">
              <label className="text-xs text-[#888] block mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full bg-[#111214] border border-[#2a2d33] rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {amount && (
              <div className="mb-3 p-3 bg-[#111214] rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">You pay:</span>
                  <span className="text-white">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">You get if correct:</span>
                  <span className="text-green-400">
                    $
                    {(
                      parseFloat(amount) /
                      (selectedSide === "yes" ? event.yesPrice : event.noPrice)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <motion.button
              className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedSide === "yes"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!amount}
            >
              Buy {selectedSide.toUpperCase()} for ${amount || "0"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Overlay */}
      {event.status === "coming_soon" && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-white text-lg font-bold mb-2">Coming Soon</div>
            <div className="text-gray-300 text-sm">Stay tuned for updates</div>
            <div className="mt-3 w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function EventsTradingPlatform() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("nations");
  const [selectedCategoryNation, setSelectedCategoryNation] = useState("All");
  const [selectedCategoryEvent, setSelectedCategoryEvent] = useState("All");
  const [sortBy, setSortBy] = useState("volume");
  const rpcUrl = RPC_URL;
  const { data, error, isLoading } = useSWR(
    `${rpcUrl}/api/v1/metrics/cards`,
    fetcher
  );

  const countryData: CountryData[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item: any, index: number) => ({
      id: item.code,
      name: item.name,
      flagCode: item.flag,
      countryScore: item.countryScore || 0,
      volume24h: item.volume24h || "N/A",
      indexPrice: item.indexPrice || "N/A",
      sentiment:
        item.changePercent > 0
          ? "Bullish"
          : item.changePercent < 0
          ? "Bearish"
          : "Neutral",
      changePercent: item.changePercent || 0,
      trend: item.changePercent >= 0 ? "up" : "down",
      status: item.status === "COMING SOON" ? "COMING SOON" : "ACTIVE",
    }));
  }, [data]);
  const filteredCountries = useMemo(() => {
    return countryData.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countryData, searchTerm]);

  const filteredEvents = useMemo(() => {
    let filtered = mockEvents.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategoryEvent === "All" ||
        event.category === selectedCategoryEvent;
      return matchesSearch && matchesCategory;
    });

    // Sort events
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "volume":
          return (
            parseInt(b.volume.replace(/[$,]/g, "")) -
            parseInt(a.volume.replace(/[$,]/g, ""))
          );
        case "participants":
          return b.participants - a.participants;
        case "ending":
          return new Date(a.endDate) - new Date(b.endDate);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategoryEvent, sortBy]);

  return (
    <div className="min-h-screen bg-[#111214] text-white">
      {/* Header */}
      <div className="p-4 md:p-6 bg-[#111214]">
        <div className="w-full flex flex-col space-y-4">
          {/* Tab Navigation */}
          <div className="px-2 py-2 rounded-[100px] outline outline-2 outline-offset-[-2px] outline-[#1d1f22] flex justify-start items-center gap-2.5 w-full md:w-auto">
            <motion.button
              onClick={() => setActiveTab("nations")}
              className={`h-12 md:h-[63px] px-4 md:px-6 py-1.5 ${
                activeTab === "nations" ? "bg-[#262a33]" : "hover:bg-[#1d1f22]"
              } rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-center items-center gap-4 flex-1 md:flex-none cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={`${
                  activeTab === "nations" ? "text-white" : "text-[#505050]"
                } text-base md:text-xl font-normal font-['Inter'] leading-tight`}
              >
                Nations
              </div>
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("events")}
              className={`h-12 md:h-[63px] px-4 md:px-6 py-1.5 ${
                activeTab === "events" ? "bg-[#262a33]" : "hover:bg-[#1d1f22]"
              } rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-center items-center gap-4 flex-1 md:flex-none cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={`${
                  activeTab === "events" ? "text-white" : "text-[#505050]"
                } text-base md:text-xl font-normal font-['Inter'] leading-tight`}
              >
                Events
              </div>
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("history")}
              className={`h-12 md:h-[63px] px-4 md:px-6 py-1.5 ${
                activeTab === "history" ? "bg-[#262a33]" : "hover:bg-[#1d1f22]"
              } rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-center items-center gap-4 flex-1 md:flex-none cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={`${
                  activeTab === "history" ? "text-white" : "text-[#505050]"
                } text-base md:text-xl font-normal font-['Inter'] leading-tight`}
              >
                History
              </div>
            </motion.button>
          </div>

          {/* Events Controls */}
          <AnimatePresence>
            {activeTab !== "history" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                {/* Search */}
                <div className="w-full max-w-md h-12 px-4 py-1.5 bg-[#1d1f22] rounded-full shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      stroke="#D6D6D6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent text-[#d6d6d6] text-base focus:outline-none"
                    placeholder={
                      activeTab === "nations"
                        ? "Search country..."
                        : "Search events..."
                    }
                  />
                </div>

                <div className="flex gap-3">
                  {/* Category Filter */}
                  <select
                    value={
                      activeTab === "nations"
                        ? selectedCategoryNation
                        : selectedCategoryEvent
                    }
                    onChange={(e) =>
                      activeTab === "nations"
                        ? setSelectedCategoryNation(e.target.value)
                        : setSelectedCategoryEvent(e.target.value)
                    }
                    className="bg-[#1d1f22] border border-[#2a2d33] rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {activeTab === "nations" &&
                      categoriesNations.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    {activeTab === "events" &&
                      categoriesEvent.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#1d1f22] border border-[#2a2d33] rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="volume">Volume</option>
                    <option value="participants">Traders</option>
                    <option value="ending">Ending Soon</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-4 pt-0 md:pt-2 bg-[#111214]">
        <AnimatePresence mode="wait">
          {activeTab === "nations" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div key={country.id} className="relative">
                    {/* Country Card */}
                    <div
                      className={`
                                    ${
                                      country.status === "COMING SOON"
                                        ? "pointer-events-none cursor-not-allowed"
                                        : ""
                                    }
                                  `}
                    >
                      <CountryCard country={country} />
                    </div>

                    {/* Coming Soon Overlay */}
                    {country.status === "COMING SOON" && (
                      <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-[2.2px] rounded-[30px] flex items-center justify-center z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center px-4">
                          <motion.div
                            className="text-white text-xl md:text-2xl font-bold mb-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            Coming Soon
                          </motion.div>
                          <motion.div
                            className="text-gray-300 text-sm md:text-base"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            Stay tuned for updates
                          </motion.div>
                          <motion.div
                            className="mt-3 w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#888] text-lg">
                    {searchTerm
                      ? "No countries found matching your search."
                      : "No countries available."}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Featured Event Banner */}
              <motion.div
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-[20px] p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-blue-400 text-sm font-medium">
                    TRENDING
                  </span>
                </div>
                <h2 className="text-white text-xl font-bold mb-2">
                  {mockEvents[0].title}
                </h2>
                <div className="flex items-center gap-6 text-sm text-[#888]">
                  <span>Volume: {mockEvents[0].volume}</span>
                  <span>
                    Traders: {mockEvents[0].participants.toLocaleString()}
                  </span>
                  <span>
                    Ends: {new Date(mockEvents[0].endDate).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#888] text-lg">
                    {searchTerm
                      ? "No events found matching your search."
                      : "No events available."}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="w-full overflow-x-auto"
            >
              <HistoryTable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
