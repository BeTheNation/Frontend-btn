"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountryCard from "@/components/dashboard/CountryCard";
import HistoryTable from "@/components/dashboard/HistoryTable";
import useSWR from "swr";
import { fetcher } from "@/src/services/fetcher";
import { RPC_URL } from "@/lib/contracts/constants";

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

export default function TradingPlatform() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "history">(
    "discover"
  );
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111214] text-white">
        <div className="p-4 md:p-6 bg-[#111214]">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-[#888]">Loading countries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111214] text-white">
        <div className="p-4 md:p-6 bg-[#111214]">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-2">Error loading countries</p>
              <p className="text-[#888] text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111214] text-white">
      <div className="p-4 md:p-6 bg-[#111214]">
        <div className="w-full flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Tab Navigation */}
          <div className="px-2 py-2 rounded-[100px] outline outline-2 outline-offset-[-2px] outline-[#1d1f22] flex justify-start items-center gap-2.5 w-full md:w-auto">
            <motion.button
              onClick={() => setActiveTab("discover")}
              className={`h-12 md:h-[63px] px-4 md:px-6 py-1.5 ${
                activeTab === "discover" ? "bg-[#262a33]" : "hover:bg-[#1d1f22]"
              } rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex justify-center items-center gap-4 flex-1 md:flex-none cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={`${
                  activeTab === "discover" ? "text-white" : "text-[#505050]"
                } text-base md:text-xl font-normal font-['Inter'] leading-tight`}
              >
                Discover
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

          {/* Search Bar */}
          <AnimatePresence>
            {activeTab === "discover" && (
              <motion.div
                className="flex justify-center md:justify-end w-full md:w-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-full max-w-md md:w-[445px] h-12 md:h-[63px] px-4 md:px-6 py-1.5 bg-[#1d1f22] rounded-full shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] flex items-center gap-3 md:gap-4 relative">
                  <div className="w-6 h-6 md:w-[34px] md:h-[34px] relative overflow-hidden flex-shrink-0">
                    <svg
                      className="w-5 h-5 md:w-[27.07px] md:h-[27.07px] absolute left-[2px] top-[2px] md:left-[2.83px] md:top-[2.83px]"
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
                      className="w-full bg-transparent text-[#d6d6d6] text-base md:text-xl font-normal font-['Inter'] leading-tight focus:outline-none"
                      placeholder="Search countries"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content */}
      <div className="p-3 md:p-4 pt-0 md:pt-2 bg-[#111214]">
        <AnimatePresence mode="wait">
          {activeTab === "discover" ? (
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
          ) : (
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
