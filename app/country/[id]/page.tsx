"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCountryData } from "@/hooks/useCountryData";
import CountryChart from "@/components/trading/CountryChart";
import PredictionForm from "@/components/trading/PredictionForm";
import SentimentCard from "@/components/trading/SentimentCard";

export default function CountryPage() {
  const { id } = useParams();
  const { country, isLoading, error } = useCountryData(id as string);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex justify-center p-12 text-red-500">
        Error loading country data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Chart and Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={country.flagUrl || "/placeholder.svg"}
                alt={`${country.name} flag`}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{country.name}</h1>
            <p className="text-gray-400">
                  Sentiment Score: {country.sentimentScore}/100
            </p>
          </div>
            </div>
            <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                country.trend === "up"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {country.trend === "up" ? "▲" : "▼"} {country.changePercent}%
            </div>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-1">
                ${country.markPrice}
            </div>
          </div>
        </div>

          {/* Chart */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardContent className="p-6">
              <CountryChart countryId={country.id} />
            </CardContent>
          </Card>

          {/* Country Information */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle>Country Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
                <TabsList className="bg-[#262626]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Sentiment Score</p>
                      <p className="text-xl font-medium">
                          {country.sentimentScore}/100
                        </p>
                      </div>
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <p className="text-sm text-gray-400">24h Volume</p>
                      <p className="text-xl font-medium">
                        ${country.volume24h}M
                      </p>
                      </div>
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Funding Rate</p>
                        <p
                        className={`text-xl font-medium ${
                            country.fundingRate >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {country.fundingRate >= 0 ? "+" : ""}
                          {country.fundingRate}%
                        </p>
                      </div>
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Analyst Consensus</p>
                        <p
                        className={`text-xl font-medium ${
                            country.analystConsensus === "bullish"
                              ? "text-green-500"
                              : country.analystConsensus === "bearish"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {country.analystConsensus?.toUpperCase()}
                        </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="news" className="mt-4">
                  <SentimentCard country={country} />
                </TabsContent>

                <TabsContent value="social" className="mt-4">
                  <div className="space-y-4">
                    <div className="bg-[#262626] p-4 rounded-lg">
                      <p className="text-sm text-gray-400">
                        Social Media Sentiment
                      </p>
                      <p className="text-xl font-medium">
                        {country.socialMediaSentiment}/100
                      </p>
                      <div className="mt-2 relative h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-blue-500 transition-all"
                          style={{ width: `${country.socialMediaSentiment}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

        {/* Right Column - Trading Panel */}
      <div className="lg:col-span-1">
        <PredictionForm country={country} />
        </div>
      </div>
    </div>
  );
}
