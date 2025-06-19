import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CountryData } from "@/app/dashboard/trading-platform";

interface CountryCardProps {
  country: CountryData;
}

export default function CountryCard({ country }: CountryCardProps) {
  const getCountryCode = (id: string): string => {
    const codeMap: Record<string, string> = {
      usa: "us",
      uk: "gb",
      korea: "kr",
      india: "in",
      japan: "jp",
      china: "cn",
      brazil: "br",
      canada: "ca",
      australia: "au",
      mexico: "mx",
      russia: "ru",
      germany: "de",
    };

    return codeMap[id.toLowerCase()] || id.toLowerCase();
  };

  const countryCode = getCountryCode(country.id);
  // Use a reliable flag API
  const flagUrl = `https://flagcdn.com/w160/${countryCode}.png`;

  return (
    <div className="block w-full">
      <div className="w-full max-w-[336px] h-[274px] p-6 bg-[#1d1f22] rounded-3xl flex flex-col justify-between items-start mx-auto">
        <div className="self-stretch flex justify-between items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-[35px] h-[35px] relative bg-white rounded-full overflow-hidden flex-shrink-0 border border-gray-800">
              <Image
                className="w-full h-full object-cover"
                src={flagUrl}
                alt={`${country.name} flag`}
                width={35}
                height={35}
                priority
              />
            </div>
            <div className="text-white text-lg font-medium font-['Inter'] truncate">
              {country.name}
            </div>
          </div>
          <div
            className={`px-2 py-1 ${
              country.trend === "up"
                ? "bg-[#068621] outline-[#54bb54]"
                : "bg-[#861506] outline-[#bb5454]"
            } rounded-full outline outline-1 outline-offset-[-1px] flex justify-center items-center flex-shrink-0`}
          >
            <div className="text-white text-sm font-medium font-['Inter']">
              {country.trend === "up" ? "+" : ""}
              {country.changePercent}%
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-3 py-2">
          <div className="self-stretch flex justify-between items-center gap-1.5">
            <div className="text-white text-base font-semibold font-['Inter']">
              Country Score :
            </div>
            <div className="text-white text-base font-semibold font-['Inter']">
              {country.countryScore.toLocaleString()}
            </div>
          </div>
          <div className="self-stretch flex justify-between items-center gap-1.5">
            <div className="text-[#555555] text-base font-normal font-['Inter']">
              24H Volume :
            </div>
            <div className="text-white text-base font-normal font-['Inter']">
              {country.volume24h}
            </div>
          </div>
          <div className="self-stretch flex justify-between items-center gap-1.5">
            <div className="text-[#555555] text-base font-normal font-['Inter']">
              Index Price :
            </div>
            <div className="text-white text-base font-normal font-['Inter']">
              {country.indexPrice}
            </div>
          </div>
          <div className="self-stretch flex justify-between items-center gap-1.5">
            <div className="text-[#555555] text-base font-normal font-['Inter']">
              Market Sentiment :
            </div>
            <div className="text-white text-base font-normal font-['Inter']">
              {country.sentiment}
            </div>
          </div>
        </div>

        <div className="self-stretch flex justify-end items-center">
          <Link href={`/country/${country.id}`}>
            <button className="px-[26px] py-2.5 bg-[#155dee] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center gap-2 hover:bg-[#2468ff] transition-colors duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform transform">
              <span className="text-white text-base font-medium font-['Inter'] leading-tight">
                Trade Now
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
