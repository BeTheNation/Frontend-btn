"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountryData } from "@/hooks/useCountryData";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFundingRate } from "@/hooks/useFundingRate";
import { useWeb3 } from "@/hooks/useWeb3";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, ResponsiveContainer, Area } from "recharts";
import { usePositionStore } from "@/store/positionStore";
import { useState, useCallback } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function CountryPage() {
  const { id } = useParams();
  const { country, isLoading, error } = useCountryData(id as string);
  const { fundingRate, timeUntilFunding } = useFundingRate(id as string);
  const { balance, isConnected, address } = useWeb3();
  const [tradeAmount, setTradeAmount] = useState(500);
  const [multiplier, setMultiplier] = useState(1);
  const [tradeDirection, setTradeDirection] = useState<"long" | "short">(
    "long"
  );

  // Generate chart data with realistic GDP patterns and strong uptrend
  const generateChartData = useCallback(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Generate a more pronounced uptrend with more curvature
    return months.map((month, index) => {
      // Create a stronger uptrend with more pronounced curves
      const progress = index / (months.length - 1);
      const uptrend = 100 + progress * 90; // Stronger uptrend base

      // Add more pronounced wave pattern for better visualization
      const wave = Math.sin(index / 1.2) * 20;

      // Ensure overall trend is up with more curves
      return {
        name: month,
        value: uptrend + wave + (index > 8 ? 18 : 0), // Extra boost toward end
      };
    });
  }, [id]);

  const chartData = generateChartData();

  // Generate diverse leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      user: "0xRafi",
      amount: 250000,
      avatar: "/placeholder-user.jpg",
    },
    {
      rank: 2,
      user: "0xJulia",
      amount: 12000,
      avatar: "/placeholder-user.jpg",
    },
    { rank: 3, user: "0xMark", amount: 10000, avatar: "/placeholder-user.jpg" },
    {
      rank: 167,
      user: "You",
      amount: 1000,
      avatar: "/placeholder-user.jpg",
      isCurrentUser: true,
    },
  ];

  // Generate realistic position data
  const positions = [
    {
      name: country?.name || "Thailand",
      pnl: -0.34,
      pnlPercent: -0.02,
      size: 500,
      entryPrice: 3.87,
      liquidationPrice: 8.58,
      fees: 2.5,
    },
    {
      name: "Abstract",
      pnl: 0.34,
      pnlPercent: 0.5,
      size: 100,
      entryPrice: 2.1,
      liquidationPrice: 4.2,
      fees: 1.2,
    },
  ];

  // Calculate liquidation price based on direction and multiplier
  const calculateLiquidationPrice = useCallback(() => {
    if (!country) return "5.41";

    const liquidationThreshold = 1 / multiplier;
    if (tradeDirection === "long") {
      return (country.markPrice * (1 - liquidationThreshold)).toFixed(2);
    } else {
      return (country.markPrice * (1 + liquidationThreshold)).toFixed(2);
    }
  }, [country, multiplier, tradeDirection]);

  // Format numbers with commas for better readability
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle position menu actions
  const handlePositionAction = (action: string, position: any) => {
    switch (action) {
      case "close":
        alert(`Closing position for ${position.name}`);
        break;
      case "modify":
        alert(`Modify position for ${position.name}`);
        break;
      case "details":
        alert(`Viewing details for ${position.name}`);
        break;
    }
  };

  // Handle place trade action
  const handlePlaceTrade = () => {
    if (!isConnected) {
      alert("Please connect your wallet to place a trade.");
      return;
    }

    alert(
      `Placing ${tradeDirection} trade for ${formatNumber(
        tradeAmount
      )} USD with ${multiplier}x leverage`
    );
  };

  // Generate country region based on id to ensure consistency
  const getCountryRegion = (countryId: string) => {
    const id = Number(countryId);
    // Assign appropriate regions based on country ID
    if (id === 1) return "North America";
    if (id === 2) return "East Asia";
    if (id === 3) return "Europe";
    if (id === 4) return "Europe";
    if (id === 5) return "Southeast Asia";
    return "Southeast Asia"; // Default
  };

  const getCountryGdpRank = (countryId: string) => {
    const id = Number(countryId);
    // Assign GDP ranks based on country ID
    if (id === 1) return "#1";
    if (id === 2) return "#2";
    if (id === 3) return "#4";
    if (id === 4) return "#7";
    if (id === 5) return "#21";
    return "#25"; // Default
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white p-5">
        <div className="flex justify-between items-center py-6 px-6 border-b border-[#222]">
          <div></div>
          <h1 className="text-3xl font-bold tracking-tight">Country Detail</h1>
          <div className="w-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 space-y-6">
          <Skeleton className="h-20 w-full bg-gray-800" />
          <Skeleton className="h-[300px] w-full bg-gray-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full bg-gray-800" />
            <Skeleton className="h-48 w-full bg-gray-800" />
            <Skeleton className="h-48 w-full bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] text-white p-5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Error Loading Country Data
          </h1>
          <p>{error || "An unknown error occurred"}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header - Remove title and connected user display */}
      <div className="flex justify-between items-center py-6 px-6 border-b border-[#222]">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Country Stats Overview */}
        <div className="mb-8 p-6 bg-[#191919] rounded-lg border border-[#333] shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/10 mr-5 flex-shrink-0">
                <Image
                  src={country.flagUrl || "/placeholder.svg"}
                  alt={country.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{country.name}</h2>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-gray-400">
                    {getCountryRegion(id as string)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-amber-400 font-medium">
                    GDP Rank: {getCountryGdpRank(id as string)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6 md:mt-0">
              <div className="flex items-center justify-between p-4 bg-[#151515] rounded-lg border border-[#222222]">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Open Trades</div>
                    <div className="font-bold">${formatNumber(28800)}</div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#151515] rounded-lg border border-[#222222]">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Volume</div>
                    <div className="font-bold">${formatNumber(200000)}</div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#151515] rounded-lg border border-[#222222]">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">
                      Funding/Cooldown
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-green-400 mr-2">
                        +0.300%
                      </span>
                      <span className="text-xs text-gray-300">
                        {timeUntilFunding || "00:37:40"}
                      </span>
                    </div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left and Center Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <Card className="bg-[#191919] border-[#333] shadow-lg">
              <CardHeader className="border-b border-[#333] pb-3 flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-medium">
                    Live Countryscore
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </CardHeader>
              <CardContent className="p-5 bg-[#151515] relative h-[320px]">
                <div className="absolute top-3 right-4 bg-[#191919]/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 z-10 shadow-md">
                  <div className="text-sm text-green-400 font-medium">
                    +{(country.changePercent || 3.45).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">24h</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4AFF3A"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4AFF3A"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#444"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      padding={{ left: 10, right: 10 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4AFF3A"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: "#4AFF3A" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="url(#colorGradient)"
                      stroke="none"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bottom Panels - 3 Columns with uniform height and styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* About Panel */}
              <Card className="bg-[#191919] border-[#333] shadow-lg h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 border-b border-[#333]">
                  <CardTitle className="text-lg font-medium">About</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </CardHeader>
                <CardContent className="p-5 text-sm text-gray-300 overflow-auto h-[calc(300px-56px)]">
                  <p>
                    {country.name === "China" ? (
                      <>
                        China, an East Asian country, has the world's
                        second-largest economy driven by manufacturing,
                        technology, and exports. It is a global leader in
                        electronics production and infrastructure development.
                        Beijing serves as the capital, with a strong
                        manufacturing base and growing middle class driving
                        economic growth.
                      </>
                    ) : country.name === "United States" ? (
                      <>
                        The United States, a North American country, has the
                        world's largest economy driven by technology, finance,
                        and services. It is a global leader in innovation,
                        research, and development. Washington D.C. serves as the
                        capital, with strong tech sectors and global financial
                        influence throughout the nation.
                      </>
                    ) : country.name === "Japan" ? (
                      <>
                        Japan, an East Asian island nation, has the world's
                        third-largest economy driven by automotive, electronics,
                        and robotics industries. It is known for technological
                        innovation and precision manufacturing. Tokyo serves as
                        the economic hub, with a high-tech industry and
                        international trade network.
                      </>
                    ) : country.name === "Germany" ? (
                      <>
                        Germany, a Western European country, has a robust
                        economy driven by automotive, machinery, and chemical
                        industries. It is known for engineering excellence and
                        export-oriented manufacturing. Berlin serves as the
                        capital, with a strong manufacturing prowess and
                        export-oriented economy.
                      </>
                    ) : country.name === "Thailand" ? (
                      <>
                        Thailand, a Southeast Asian country, has a diverse
                        economy driven by industries such as manufacturing,
                        agriculture, and tourism. It is one of the world's
                        largest exporters of electronics, automobiles, and
                        agricultural products like rice and rubber. Bangkok
                        serves as the economic hub, while the nation benefits
                        from a strong tourism sector.
                      </>
                    ) : (
                      <>
                        {country.name}, a {getCountryRegion(id as string)}{" "}
                        country, has a diverse economy with various sectors
                        contributing to its GDP growth. It maintains a presence
                        in global markets through trade and economic
                        partnerships, with ongoing development in multiple
                        industries supporting its economic output.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* Leaderboard Panel */}
              <Card className="bg-[#191919] border-[#333] shadow-lg h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 border-b border-[#333]">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium">
                      Leaderboard
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </CardHeader>
                <CardContent className="p-5 overflow-auto h-[calc(300px-56px)]">
                  <div className="space-y-3">
                    <div className="text-xs text-gray-400 mb-1">
                      You are ranked 167th in {country.name}
                    </div>
                    {leaderboardData.map((item) => (
                      <div
                        key={item.rank}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          item.isCurrentUser
                            ? "bg-blue-900/20 border border-blue-800/30"
                            : "hover:bg-gray-800/30"
                        } transition-colors duration-150 cursor-pointer`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-gray-400 text-xs px-1.5 py-0.5 rounded ${
                              item.rank === 1
                                ? "bg-yellow-500/20 text-yellow-300"
                                : item.rank === 2
                                ? "bg-gray-500/20 text-gray-300"
                                : item.rank === 3
                                ? "bg-amber-600/20 text-amber-400"
                                : "bg-gray-800"
                            }`}
                          >
                            #{item.rank}
                          </div>
                          <div className="h-6 w-6 rounded-full bg-gray-700 overflow-hidden">
                            <Image
                              src={item.avatar}
                              alt={`${item.user} avatar`}
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                          <div
                            className={`text-white ${
                              item.isCurrentUser ? "font-semibold" : ""
                            }`}
                          >
                            {item.user}
                          </div>
                        </div>
                        <div
                          className={`${
                            item.rank === 1 ? "text-green-500" : "text-white"
                          } font-medium`}
                        >
                          ${formatNumber(item.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Positions Panel */}
              <Card className="bg-[#191919] border-[#333] shadow-lg h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 border-b border-[#333]">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium">
                      Positions
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </CardHeader>
                <CardContent className="p-5 overflow-auto h-[calc(300px-56px)]">
                  {positions.length > 0 ? (
                    <div className="space-y-4 text-sm">
                      {positions.map((position, index) => (
                        <div
                          key={index}
                          className="p-3 bg-[#151515] rounded-lg border border-gray-700/30 space-y-2 hover:border-gray-600/50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <div className="text-white font-medium">
                              {position.name}
                            </div>
                            <div
                              className={`ml-auto ${
                                position.pnl >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              } font-medium`}
                            >
                              ${position.pnl.toFixed(2)} (
                              {position.pnlPercent >= 0 ? "+" : ""}
                              {position.pnlPercent}%)
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Position Size
                              </span>
                              <span className="text-white font-medium">
                                ${position.size.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Entry Price</span>
                              <span className="text-white font-medium">
                                {position.entryPrice.toFixed(2)}M USD
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 flex items-center">
                                Liquidation
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  className="w-3 h-3 ml-1"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 8v4M12 16h.01" />
                                </svg>
                              </span>
                              <span className="text-white font-medium">
                                {position.liquidationPrice.toFixed(2)}M USD
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Fees</span>
                              <span className="text-white font-medium">
                                ${position.fees.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 h-full flex flex-col items-center justify-center">
                      <p>You don't have any open positions yet.</p>
                      <Button
                        variant="link"
                        onClick={() => (window.location.href = `/dashboard`)}
                        className="text-blue-400 mt-2"
                      >
                        Explore Markets
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Trading Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-[#191919] border-[#333] lg:sticky lg:top-4 shadow-lg">
              <CardHeader className="border-b border-[#333] pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium">
                    Trade {country.name}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {/* Market Label and Current Price */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-medium bg-[#222] inline-block px-3 py-1 rounded-md">
                    Market
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      Current Price:
                    </span>
                    <span className="text-lg font-semibold">
                      {(country.markPrice / 1000 || 3.87).toFixed(2)}M USD
                    </span>
                  </div>
                </div>

                {/* Long/Short Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={tradeDirection === "long" ? "default" : "outline"}
                    className={`py-3 h-14 ${
                      tradeDirection === "long"
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-900/30"
                        : "bg-[#222] border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => setTradeDirection("long")}
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4 mb-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>Long</span>
                    </div>
                  </Button>
                  <Button
                    variant={tradeDirection === "short" ? "default" : "outline"}
                    className={`py-3 h-14 ${
                      tradeDirection === "short"
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/30"
                        : "bg-[#222] border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => setTradeDirection("short")}
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4 mb-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                      <span>Short</span>
                    </div>
                  </Button>
                </div>

                {/* Balance Card */}
                <div className="bg-[#151515] p-4 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Your Balance:</span>
                    <div className="flex items-center">
                      <span className="font-semibold">
                        {isConnected
                          ? `$${
                              balance
                                ? parseFloat(balance.formatted).toFixed(2)
                                : "0.00"
                            }`
                          : "$0.00"}
                      </span>
                      <Button
                        variant="link"
                        className="text-blue-400 font-semibold p-0 h-auto text-sm ml-2"
                        onClick={() =>
                          !isConnected
                            ? (window.location.href = "/dashboard")
                            : null
                        }
                      >
                        {isConnected ? "Deposit Funds" : "Connect"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Currency:</span>
                    <span className="text-sm bg-blue-900/30 text-blue-400 px-3 py-1 rounded font-medium">
                      USDC
                    </span>
                  </div>
                </div>

                {/* Amount Slider */}
                <div className="space-y-4 py-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400 font-medium">
                      Amount:
                    </label>
                    <span className="text-sm font-medium bg-gray-800 px-2 py-0.5 rounded">
                      ${formatNumber(tradeAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Slider
                      value={[tradeAmount]}
                      max={10000}
                      min={100}
                      step={100}
                      className="flex-1 mr-4"
                      onValueChange={(values) => setTradeAmount(values[0])}
                    />
                    <div
                      className="bg-blue-600 text-white text-xs font-semibold h-6 w-6 flex items-center justify-center rounded cursor-pointer"
                      onClick={() =>
                        setMultiplier(multiplier < 5 ? multiplier + 1 : 1)
                      }
                    >
                      x{multiplier}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>$100</span>
                    <span>$5,000</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Trade Details */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#222] p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">
                        Entry Price
                      </div>
                      <div className="font-semibold">
                        {(country.markPrice / 1000 || 3.87).toFixed(2)}M
                      </div>
                    </div>
                    <div className="bg-[#222] p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">
                        Liquidation at
                      </div>
                      <div className="font-semibold">
                        {calculateLiquidationPrice()}M
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#222] p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Potential Profit</span>
                      <span className="text-green-400 font-medium">
                        up to ${formatNumber(tradeAmount * multiplier * 0.5)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Loss</span>
                      <span className="text-red-400 font-medium">
                        ${formatNumber(tradeAmount)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className={`w-full py-6 text-white font-medium ${
                      !isConnected
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                    }`}
                    onClick={handlePlaceTrade}
                  >
                    {isConnected
                      ? `Place ${
                          tradeDirection === "long" ? "Buy" : "Sell"
                        } Order`
                      : "Connect Wallet to Trade"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
