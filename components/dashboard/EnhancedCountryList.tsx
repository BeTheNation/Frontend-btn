"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/hooks/useCountries";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, Filter, SortDesc } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { usePositionStore } from "@/store/positionStore";

export default function EnhancedCountryList() {
  const { countries, isLoading } = useCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { isConnected } = useWeb3();
  const addPosition = usePositionStore((state) => state.addPosition);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "gdp") {
      comparison = a.currentGdp - b.currentGdp;
    } else if (sortBy === "change") {
      comparison = a.changePercent - b.changePercent;
    } else if (sortBy === "volume") {
      comparison = a.volume24h - b.volume24h;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleQuickTrade = (country, direction, leverage = 1) => {
    if (!isConnected) return;

    // Create a demo position with default values
    const newPosition = {
      id: `pos-${Date.now()}`,
      country: country,
      direction: direction,
      size: 100, // Default size
      leverage: leverage,
      entryPrice: country.markPrice,
      markPrice: country.markPrice,
      openTime: new Date(),
      fundingRate: country.fundingRate,
      nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    };

    addPosition(newPosition);
    // Show a toast or notification
    alert(
      `${direction === "long" ? "Long" : "Short"} position opened for ${
        country.name
      } with ${leverage}x leverage`
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading countries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Input
          placeholder="Search countries..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={sortBy === "name" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("name")}
          className="text-xs"
        >
          Name
        </Button>
        <Button
          variant={sortBy === "gdp" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("gdp")}
          className="text-xs"
        >
          GDP
        </Button>
        <Button
          variant={sortBy === "change" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("change")}
          className="text-xs"
        >
          Change %
        </Button>
        <Button
          variant={sortBy === "volume" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("volume")}
          className="text-xs"
        >
          Volume
        </Button>
      </div>

      <TabsContent value="card" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCountries.map((country) => (
            <Card
              key={country.id}
              className="overflow-hidden hover:border-blue-500 transition-colors"
            >
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flagUrl || "/placeholder.svg"}
                        alt={`${country.name} flag`}
                        className="w-6 h-6 rounded-full"
                      />
                      <h3 className="font-semibold">{country.name}</h3>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        country.trend === "up"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {country.trend === "up" ? "▲" : "▼"}{" "}
                      {country.changePercent}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Current GDP:</span>
                      <span>${country.currentGdp} trillion</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mark Price:</span>
                      <span>${country.markPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">24h Volume:</span>
                      <span>${country.volume24h}M</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#333333] flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">Funding Rate:</span>
                      <span
                        className={
                          country.fundingRate > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {" "}
                        {country.fundingRate > 0 ? "+" : ""}
                        {country.fundingRate}%
                      </span>
                    </div>
                    <Link href={`/country/${country.id}`}>
                      <Button size="sm">Details</Button>
                    </Link>
                  </div>
                </div>

                {/* Quick Trade Panel */}
                <div className="bg-[#111] p-4 border-t border-[#333]">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quick Trade</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 5].map((lev) => (
                          <Button
                            key={lev}
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 text-xs"
                            title={`${lev}x leverage`}
                          >
                            {lev}x
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                        size="sm"
                        onClick={() => handleQuickTrade(country, "long")}
                        disabled={!isConnected}
                      >
                        <ChevronUp className="mr-1 h-4 w-4" />
                        Long
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700 h-8"
                        size="sm"
                        onClick={() => handleQuickTrade(country, "short")}
                        disabled={!isConnected}
                      >
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Short
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="table" className="mt-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4">Country</th>
                <th className="text-left py-3 px-4">GDP</th>
                <th className="text-left py-3 px-4">Mark Price</th>
                <th className="text-left py-3 px-4">Change</th>
                <th className="text-left py-3 px-4">Volume</th>
                <th className="text-left py-3 px-4">Funding</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map((country) => (
                <tr
                  key={country.id}
                  className="border-b border-[#333333] hover:bg-[#1A1A1A]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flagUrl || "/placeholder.svg"}
                        alt={`${country.name} flag`}
                        className="w-6 h-6 rounded-full"
                      />
                      {country.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">${country.currentGdp} trillion</td>
                  <td className="py-3 px-4">${country.markPrice}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        country.trend === "up"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {country.trend === "up" ? "▲" : "▼"}{" "}
                      {country.changePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4">${country.volume24h}M</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        country.fundingRate > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {country.fundingRate > 0 ? "+" : ""}
                      {country.fundingRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-7 bg-green-600 hover:bg-green-700"
                        onClick={() => handleQuickTrade(country, "long")}
                        disabled={!isConnected}
                      >
                        Long
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 bg-red-600 hover:bg-red-700"
                        onClick={() => handleQuickTrade(country, "short")}
                        disabled={!isConnected}
                      >
                        Short
                      </Button>
                      <Link href={`/country/${country.id}`}>
                        <Button size="sm" variant="outline" className="h-7">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </div>
  );
}
