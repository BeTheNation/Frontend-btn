import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/data-display/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";

interface CountryStat {
  label: string;
  value: string | number;
  tooltip?: string;
  icon?: React.ReactNode;
  valueColor?: string;
  help?: string;
}

interface CountryInfoCardProps {
  countryName: string;
  flagUrl: string;
  region?: string;
  gdpRank?: string;
  stats: CountryStat[];
  className?: string;
}

export function CountryInfoCard({
  countryName,
  flagUrl,
  region,
  gdpRank,
  stats,
  className,
}: CountryInfoCardProps) {
  return (
    <Card className={cn("bg-[#111] border-[#222] overflow-hidden", className)}>
      <CardHeader className="bg-[#0D0D0D] pt-4 pb-4 px-4 border-b border-[#222]">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <Image
              src={flagUrl || "/placeholder.svg"}
              alt={`${countryName} flag`}
              fill
              className="object-cover rounded-full border-2 border-gray-700"
            />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              {countryName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {region && (
                <Badge
                  variant="outline"
                  className="text-gray-400 bg-gray-800/50 border-gray-700"
                >
                  {region}
                </Badge>
              )}
              {gdpRank && (
                <Badge
                  variant="outline"
                  className="text-amber-400 bg-amber-900/20 border-amber-800/30"
                >
                  GDP Rank: {gdpRank}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y divide-[#222]">
          {/* Stats grid */}
          <div className="bg-[#0A0A0A] p-4 grid grid-cols-3 gap-4">
            <TooltipProvider>
              {stats.map((stat, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className="flex flex-col items-center justify-center p-3 bg-[#121212] rounded-lg border border-[#222] hover:bg-[#151515] transition-colors"
                      aria-label={`${stat.label}: ${stat.value}`}
                    >
                      <div className="text-gray-400 text-xs mb-1 flex items-center gap-1.5">
                        {stat.icon && (
                          <span className="text-gray-500">{stat.icon}</span>
                        )}
                        <span>{stat.label}</span>
                        {stat.help && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-3 h-3"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                        )}
                      </div>
                      <div
                        className={cn("font-semibold text-sm", stat.valueColor)}
                      >
                        {stat.value}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stat.tooltip || `${stat.label} for ${countryName}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
