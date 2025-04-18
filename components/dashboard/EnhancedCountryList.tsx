"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/inputs/input";
import { Button } from "@/components/ui/inputs/button";
import { useCountries } from "@/hooks/useCountries";
import { Card, CardContent } from "@/components/ui/data-display/card";
import { useWeb3 } from "@/hooks/useWeb3";
import { SearchIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function EnhancedCountryList() {
  const { countries, isLoading } = useCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected } = useWeb3();

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenTrade = (country) => {
    if (!isConnected) return;
    window.location.href = `/country/${country.id}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search markets..."
            className="pl-10 bg-[#111] border-[#333]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#101010] border-[#333] rounded-md"
          >
            <span className="flex items-center">
              Country
              <span className="ml-2 w-3 h-3 bg-[#333] rounded-full flex items-center justify-center">
                <span className="text-[10px]">✓</span>
              </span>
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#101010] border-[#333] rounded-md"
          >
            <span>Sport</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCountries.map((country) => (
          <Card
            key={country.id}
            className="overflow-hidden border-[#222] bg-[#101010] rounded-md hover:border-[#333] transition-colors duration-200"
          >
            <CardContent className="p-0">
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={country.flagUrl || "/placeholder.svg"}
                      alt={`${country.name} flag`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <h3 className="font-medium text-white text-sm">
                      {country.name}
                    </h3>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      country.trend === "up"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {country.trend === "up" ? "+" : ""}
                    {country.changePercent}%
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-400">Countryscore :</span>
                    <span className="text-white">800</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-400">24H Volume :</span>
                    <span className="text-white">
                      {formatCurrency(country.volume24h)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-400">Index Price :</span>
                    <span className="text-white">
                      {formatCurrency(country.markPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-400">Market Sentiment :</span>
                    <span
                      className={`text-white ${
                        country.analystConsensus === "bullish"
                          ? "text-green-500"
                          : country.analystConsensus === "bearish"
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {country.analystConsensus === "bullish"
                        ? "Bullish"
                        : country.analystConsensus === "bearish"
                        ? "Bearish"
                        : "Neutral"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <div className="mt-3">
                <Button
                  className="rounded-none py-2 w-full bg-[#5E5AFA] hover:bg-[#4A46FA] text-white flex items-center justify-center border-0 font-medium"
                  onClick={() => handleOpenTrade(country)}
                >
                  Trade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
