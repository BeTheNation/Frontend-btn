"use client";

import { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CountryChartProps {
  countryId: string;
}

export default function CountryChart({ countryId }: CountryChartProps) {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1D");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockChartData(timeframe, countryId);
      setChartData(data);
      setIsLoading(false);
    }, 500);
  }, [timeframe, countryId]);

  const generateMockChartData = (timeframe, countryId) => {
    const now = new Date();
    let points = 0;
    let interval = 0;
    let lastValue = 100 + (parseInt(countryId) % 10) * 10;

    // Set the number of data points and interval based on timeframe
    if (timeframe === "1D") {
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour
    } else if (timeframe === "1W") {
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === "1M") {
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else {
      points = 12;
      interval = 30 * 24 * 60 * 60 * 1000; // 1 month
    }

    const data: Array<{ date: string; value: number }> = [];

    for (let i = points; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval);
      const randomFactor =
        Math.sin((i / points) * Math.PI) * 0.05 + (Math.random() - 0.5) * 0.02;
      lastValue = lastValue * (1 + randomFactor);

      data.push({
        date: date.toISOString(),
        value: Number(lastValue.toFixed(2)),
      });
    }

    return data;
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="bg-[#1A1A1A] p-1">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>

          <div className="text-sm text-gray-400">
            Last Price: ${chartData[chartData.length - 1]?.value.toFixed(2)}
          </div>
        </div>
      </Tabs>

      <div className="h-[400px] w-full">
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
              tickFormatter={(date) => {
                const d = new Date(date);
                return timeframe === "1D"
                  ? d.getHours() + ":00"
                  : d.toLocaleDateString();
              }}
              stroke="#666666"
              axisLine={{ stroke: "#333333" }}
              tick={{ fill: "#666666" }}
            />
            <YAxis
              stroke="#666666"
              axisLine={{ stroke: "#333333" }}
              tick={{ fill: "#666666" }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                borderColor: "#333333",
                borderRadius: "8px",
              }}
              labelFormatter={(date) => new Date(date).toLocaleString()}
              formatter={(value) => ["$" + value, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#3B82F6" }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
