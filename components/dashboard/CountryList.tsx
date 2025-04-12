"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/hooks/useCountries";
import { Progress } from "@/components/ui/progress";

export default function CountryList() {
  const { countries, isLoading } = useCountries();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <Link href={`/country/${country.id}`} key={country.id}>
            <div className="card hover:border-blue-500 transition-colors cursor-pointer">
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
                  {country.trend === "up" ? "▲" : "▼"} {country.changePercent}%
                </div>
              </div>

              <div className="space-y-4">
                {/* Sentiment Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sentiment Score</span>
                    <span>{country.sentimentScore}/100</span>
                  </div>
                  <Progress value={country.sentimentScore} />
                </div>

                {/* News Impact */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Positive</div>
                    <div className="text-sm text-green-500">
                      {country.newsImpact?.positive}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Neutral</div>
                    <div className="text-sm text-yellow-500">
                      {country.newsImpact?.neutral}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Negative</div>
                    <div className="text-sm text-red-500">
                      {country.newsImpact?.negative}%
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mark Price</span>
                  <span>${country.markPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">24h Volume</span>
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
                <Button size="sm">Trade</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
