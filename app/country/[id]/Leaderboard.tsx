"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
  DollarSign,
  Trophy,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { fetcher } from "@/src/services/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { RPC_URL } from "@/lib/contracts/constants";
import Link from "next/link";

// https://backendd.betheback.my.id/api/v1/country/ID/trade

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] transition-all duration-200 hover:shadow-lg">
      <div
        className="p-4 sm:p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-[#99a3b2]" />
            <h2 className="text-white text-lg font-medium font-['Inter'] leading-7">
              {title}
            </h2>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[#99a3b2] transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#99a3b2] transition-transform duration-200" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#323232]">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};

const NewsSection = () => {
  const { id } = useParams();
  const countryId = typeof id === "string" ? id.toUpperCase() : "";
  const [news, setNews] = useState([]);
  const { data, error, isLoading } = useSWR(
    countryId ? `${RPC_URL}/api/v1/country/${countryId}/trade` : null,
    fetcher
  );
  useEffect(() => {
    if (data) {
      setNews(data.data.news.data);
    }
  }, [data]);

  return (
    <div className="space-y-4">
      {news.length > 0 &&
        news.map((item: any, index) => (
          <Link
            href={item.url}
            target="blank"
            key={index}
            className="group cursor-pointer"
          >
            <div className="flex justify-between items-start gap-4 p-3 rounded-lg hover:bg-[#2a2d31] transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[#16b264] bg-opacity-20 text-[#16b264] text-xs font-medium rounded">
                    {item.category}
                  </span>
                  <span className="text-[#697485] text-xs">
                    {item.publishedAt}
                  </span>
                </div>
                <h3 className="text-white text-sm font-medium mb-1 group-hover:text-[#16b264] transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-[#697485] text-xs leading-relaxed line-clamp-5">
                  {item.description}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#697485] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </Link>
        ))}
    </div>
  );
};

const StatisticsSection = () => {
  const stats = [
    {
      label: "Total Portfolio Value",
      value: "$1,000",
      change: "+5.2%",
      positive: true,
      icon: DollarSign,
    },
    {
      label: "Active Positions",
      value: "12",
      change: "+2",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Total Traders",
      value: "15,847",
      change: "+247",
      positive: true,
      icon: Users,
    },
    {
      label: "Your Best Rank",
      value: "#143",
      change: "24 positions up",
      positive: true,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 bg-[#2a2d31] rounded-lg border border-[#323232]"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="w-5 h-5 text-[#99a3b2]" />
            <span
              className={`text-xs font-medium ${
                stat.positive ? "text-[#16b264]" : "text-[#ef4444]"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-white text-xl font-semibold mb-1">
            {stat.value}
          </div>
          <div className="text-[#697485] text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const LeaderboardSection = () => {
  return (
    <div className="space-y-4">
      <div className="text-[#676767] text-lg font-medium font-['Inter'] leading-7">
        You are ranked 167th in Indonesia
      </div>

      <div className="space-y-0">
        {/* Rank #1 */}
        <div className="py-4 flex justify-between items-center border-b border-[#323232]">
          <div className="flex justify-between items-center flex-1 pr-4">
            <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
              Rank #1
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[33px] h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">SM</span>
              </div>
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                0xMeiline
              </div>
            </div>
          </div>
          <div className="text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
            $250,000
          </div>
        </div>

        {/* Rank #2 */}
        <div className="py-4 flex justify-between items-center border-b border-[#323232]">
          <div className="flex justify-between items-center flex-1 pr-4">
            <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
              Rank #2
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[33px] h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">JC</span>
              </div>
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                0xClara
              </div>
            </div>
          </div>
          <div className="text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
            $12,000
          </div>
        </div>

        {/* Rank #3 */}
        <div className="py-4 flex justify-between items-center border-b border-[#323232]">
          <div className="flex justify-between items-center flex-1 pr-4">
            <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
              Rank #3
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[33px] h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">DE</span>
              </div>
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                0xEdward
              </div>
            </div>
          </div>
          <div className="text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
            $10,000
          </div>
        </div>

        {/* Your Rank */}
        <div className="py-4 flex justify-between items-center bg-[#2a2d31] -mx-4 px-4 rounded-lg">
          <div className="flex justify-between items-center flex-1 pr-4">
            <div className="text-white text-sm font-semibold font-['Inter'] leading-tight">
              Rank #167
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[33px] h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">YU</span>
              </div>
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                0xCeline
              </div>
            </div>
          </div>
          <div className="text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
            $1,000
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#111315]">
      <div className="max-w-md mx-auto space-y-4">
        {/* News Section */}
        <CollapsibleSection
          title="Latest News"
          icon={Calendar}
          defaultOpen={true}
        >
          <NewsSection />
        </CollapsibleSection>

        {/* Statistics Section */}
        <CollapsibleSection
          title="Portfolio Statistics"
          icon={TrendingUp}
          defaultOpen={false}
        >
          <StatisticsSection />
        </CollapsibleSection>

        {/* Leaderboard Section */}
        <CollapsibleSection
          title="Leaderboard"
          icon={Trophy}
          defaultOpen={false}
        >
          <LeaderboardSection />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Dashboard;
