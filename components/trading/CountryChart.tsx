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
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { generateMockChartData, generateEnhancedChartData } from "@/lib/mock-data";

interface ChartDataPoint {
  date: string;
  value: number;
  sentiment?: number;
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

type TimeframeOption = "1D" | "1W" | "1M" | "1Y" | "3M" | "6M";

interface CountryChartProps {
  countryId: string;
  countryName?: string;
  variant?: "basic" | "enhanced";
  showSentiment?: boolean;
  showProjection?: boolean;
}

export default function CountryChart({ 
  countryId, 
  countryName, 
  variant = "basic",
  showSentiment = false,
  showProjection = false
}: CountryChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("1M");
  const [isLoading, setIsLoading] = useState(true);
  const isEnhanced = variant === "enhanced";

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = isEnhanced || showProjection
        ? generateEnhancedChartData(timeframe, countryId)
        : generateMockChartData(timeframe, countryId);
      setChartData(data);
      setIsLoading(false);
    }, 500);
  }, [timeframe, countryId, isEnhanced, showProjection]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const date = label ? new Date(label).toLocaleDateString() : '';
    const hasProjection = payload.some(p => p.name === 'Projected');

    return (
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-2 shadow-md">
        <p className="text-xs text-gray-400">{date}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>:
            </span>
            <span className="font-medium">
              {entry.name.includes('Price') ? `$${entry.value}` : entry.value}
            </span>
          </div>
        ))}
        {hasProjection && (
          <div className="mt-1 text-xs text-gray-400">
            * Projected values are estimates
          </div>
        )}
      </div>
    );
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
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as TimeframeOption)} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="bg-[#1A1A1A] p-1">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            {isEnhanced && (
              <>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="6M">6M</TabsTrigger>
              </>
            )}
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>

          <div className="text-sm text-gray-400">
            {countryName && <span className="mr-2">{countryName}</span>}
            Last Price: ${chartData.find(point => point.value !== null)?.value.toFixed(2)}
          </div>
        </div>
      </Tabs>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {isEnhanced ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333333"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) => {
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
                yAxisId="left"
                stroke="#666666"
                axisLine={{ stroke: "#333333" }}
                tick={{ fill: "#666666" }}
                domain={["auto", "auto"]}
              />
              {showSentiment && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F59E0B"
                  axisLine={{ stroke: "#333333" }}
                  tick={{ fill: "#F59E0B" }}
                  domain={[0, 100]}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorPrice)"
                name="Price"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3B82F6" }}
                animationDuration={500}
              />
              {showProjection && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="projectedPrice"
                  stroke="#10B981"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Projected"
                  activeDot={{ r: 4, fill: "#10B981" }}
                />
              )}
              {showSentiment && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#F59E0B"
                  name="Sentiment"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : (
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
                tickFormatter={(date: string) => {
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
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
