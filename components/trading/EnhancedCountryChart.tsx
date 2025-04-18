"use client";

import React, { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { Card, CardContent } from "@/components/ui/data-display/card";

interface ChartDataPoint {
  date: string;
  price: number;
  sentiment: number;
  projectedPrice?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

interface EnhancedCountryChartProps {
  countryId: string;
  countryName: string;
}

type TimeframeOption = "1M" | "3M" | "6M" | "1Y";

export default function EnhancedCountryChart({
  countryId,
  countryName,
}: EnhancedCountryChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("1M");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const historicalData = generateMockChartData(timeframe, countryId);
      const data = generateProjectionData(historicalData);
      setChartData(data);
      setIsLoading(false);
    }, 500);
  }, [timeframe, countryId]);

  const generateMockChartData = (
    timeframe: TimeframeOption,
    countryId: string
  ): ChartDataPoint[] => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    let points = 0;
    let interval = 0;

    switch (timeframe) {
      case "1M":
        points = 30;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "3M":
        points = 90;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "6M":
        points = 180;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "1Y":
        points = 365;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
    }

    const baseValue = Number.parseInt(countryId) * 10 + 100;
    let lastValue = baseValue;
    let lastSentiment = 50 + Math.random() * 20;

    for (let i = points; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval);

      // Create smoother transitions for price
      const priceRandomFactor =
        Math.sin((i / points) * Math.PI) * 0.05 + (Math.random() - 0.5) * 0.02;
      lastValue = lastValue * (1 + priceRandomFactor);

      // Create smoother transitions for sentiment
      const sentimentRandomFactor =
        Math.sin((i / points) * Math.PI) * 0.1 + (Math.random() - 0.5) * 0.05;
      lastSentiment = Math.max(
        0,
        Math.min(100, lastSentiment + sentimentRandomFactor)
      );

      data.push({
        date: date.toISOString(),
        price: Number(lastValue.toFixed(2)),
        sentiment: Number(lastSentiment.toFixed(2)),
      });
    }

    return data;
  };

  const generateProjectionData = (
    historicalData: ChartDataPoint[]
  ): ChartDataPoint[] => {
    const lastPrice = historicalData[historicalData.length - 1].price;
    const lastSentiment = historicalData[historicalData.length - 1].sentiment;
    const projectionDays = 30;
    const projectionData: ChartDataPoint[] = [];

    for (let i = 1; i <= projectionDays; i++) {
      const date = new Date(
        new Date(historicalData[historicalData.length - 1].date).getTime() +
          i * 24 * 60 * 60 * 1000
      );

      // Create projection based on sentiment trend
      const sentimentTrend = lastSentiment > 50 ? 1 : -1;
      const projectedChange = (Math.random() * 0.02 + 0.01) * sentimentTrend;
      const projectedPrice = lastPrice * (1 + projectedChange * i);

      projectionData.push({
        date: date.toISOString(),
        price: lastPrice,
        sentiment: lastSentiment,
        projectedPrice: Number(projectedPrice.toFixed(2)),
      });
    }

    return [...historicalData, ...projectionData];
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length > 0) {
      const date = new Date(label || "").toLocaleDateString();
      return (
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-3 shadow-lg">
          <p className="text-gray-400">{date}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {entry.name === "Sentiment" ? "/100" : " USD"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#333333]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {countryName} Sentiment Analysis
            </h3>
            <Tabs defaultValue={timeframe}>
              <TabsList className="bg-[#262626]">
                <TabsTrigger value="1M" onClick={() => setTimeframe("1M")}>
                  1M
                </TabsTrigger>
                <TabsTrigger value="3M" onClick={() => setTimeframe("3M")}>
                  3M
                </TabsTrigger>
                <TabsTrigger value="6M" onClick={() => setTimeframe("6M")}>
                  6M
                </TabsTrigger>
                <TabsTrigger value="1Y" onClick={() => setTimeframe("1Y")}>
                  1Y
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
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
                  axisLine={{ stroke: "#333333" }}
                  tick={{ fill: "#666666" }}
                />
                <YAxis
                  yAxisId="price"
                  stroke="#666666"
                  axisLine={{ stroke: "#333333" }}
                  tick={{ fill: "#666666" }}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  yAxisId="sentiment"
                  orientation="right"
                  stroke="#666666"
                  axisLine={{ stroke: "#333333" }}
                  tick={{ fill: "#666666" }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  animationDuration={500}
                />
                <Line
                  yAxisId="sentiment"
                  type="monotone"
                  dataKey="sentiment"
                  name="Sentiment"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  animationDuration={500}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="projectedPrice"
                  name="Projected"
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
