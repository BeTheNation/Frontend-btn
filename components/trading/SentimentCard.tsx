"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Progress } from "@/components/ui/feedback/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type { Country } from "@/hooks/useCountries";
import { useFundingRate } from "@/hooks/useFundingRate";

interface SentimentCardProps {
  country: Country;
}

export default function SentimentCard({ country }: SentimentCardProps) {
  const sentimentColor =
    country.sentimentScore >= 70
      ? "bg-green-500"
      : country.sentimentScore >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  const { fundingRate, timeUntilFunding } = useFundingRate(country.id);

  const newsData = [
    { name: "Positive", value: country.newsImpact?.positive || 0 },
    { name: "Negative", value: country.newsImpact?.negative || 0 },
    { name: "Neutral", value: country.newsImpact?.neutral || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Overall Sentiment</span>
            <span className="font-medium">{country.sentimentScore}/100</span>
          </div>
          <div className="relative h-4 w-full bg-[#262626] rounded-full overflow-hidden">
            <div
              className={`absolute h-full transition-all ${sentimentColor}`}
              style={{ width: `${country.sentimentScore}%` }}
            />
          </div>
        </div>

        <Tabs defaultValue="news">
          <TabsList className="w-full">
            <TabsTrigger value="news" className="flex-1">
              News Impact
            </TabsTrigger>
            <TabsTrigger value="social" className="flex-1">
              Social Media
            </TabsTrigger>
            <TabsTrigger value="analyst" className="flex-1">
              Analyst
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="name" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#262626",
                    borderColor: "#333333",
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="social">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <span className="text-sm text-gray-400">
                  Social Media Sentiment
                </span>
                <Progress value={country.socialMediaSentiment} />
                <div className="flex justify-between text-sm">
                  <span>Bearish</span>
                  <span>Neutral</span>
                  <span>Bullish</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analyst">
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div
                  className={`
                  text-2xl font-bold p-4 rounded-full
                  ${
                    country.analystConsensus === "bullish"
                      ? "text-green-500"
                      : country.analystConsensus === "bearish"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                `}
                >
                  {country.analystConsensus?.toUpperCase()}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Historical Trend */}
        <div className="space-y-2">
          <span className="text-sm text-gray-400">Historical Trend</span>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={country.historicalSentiment}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333333"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#666666"
                  tickFormatter={(date: string) =>
                    new Date(date).toLocaleDateString()
                  }
                />
                <YAxis stroke="#666666" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#262626",
                    borderColor: "#333333",
                  }}
                  labelFormatter={(date: string) =>
                    new Date(date).toLocaleDateString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funding Rate Display */}
        <div className="space-y-2 mt-6 pt-4 border-t border-[#333333]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Funding Rate</span>
            <div className="flex items-center">
              <span
                className={fundingRate >= 0 ? "text-green-500" : "text-red-500"}
              >
                {fundingRate >= 0 ? "+" : ""}
                {fundingRate}% / 8h
              </span>
              <span className="text-xs text-gray-400 ml-2">
                (Next: {timeUntilFunding})
              </span>
            </div>
          </div>

          <div className="relative h-2 w-full bg-[#262626] rounded-full overflow-hidden mt-2">
            {/* Center line */}
            <div
              className="absolute h-full top-0 left-1/2 w-[2px] bg-gray-400"
              style={{ transform: "translateX(-50%)" }}
            />
            {/* Funding rate indicator */}
            <div
              className={`absolute h-full transition-all ${
                fundingRate < 0 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(Math.abs(fundingRate) * 20, 50)}%`,
                left: fundingRate < 0 ? "0" : "50%",
                right: fundingRate > 0 ? "0" : "auto",
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="flex-1 text-xs text-gray-400 text-left">
              Short Pay
            </div>
            <div className="flex-1 text-xs text-gray-400 text-center">
              Neutral
            </div>
            <div className="flex-1 text-xs text-gray-400 text-right">
              Long Pay
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            {fundingRate > 0
              ? "Long positions pay funding to short positions"
              : fundingRate < 0
              ? "Short positions pay funding to long positions"
              : "Funding is neutral (no payment)"}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {fundingRate !== 0 &&
              `For a $10,000 position, you would ${
                Math.abs(fundingRate) > 0 ? "pay" : "receive"
              } about $${(Math.abs(fundingRate) * 10).toFixed(
                2
              )} every 8 hours.`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
