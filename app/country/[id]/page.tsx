"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCountryData } from "@/hooks/useCountryData";
import { useWeb3 } from "@/hooks/useWeb3";
import { CountryPositionsList } from "@/components/trading/CountryPositionsList";
import { useContract } from "@/hooks/useContract";
import { useToast } from "@/components/ui/use-toast";
import { usePositionCreation } from "@/hooks/usePositionCreation";
import { USDCApproval } from "@/components/ui/usdc-approval";
import { motion, AnimatePresence } from "framer-motion";
import { useCountryPositions } from "@/hooks/useCountryPositions";
import { usePositionStore } from "@/store/positionStore";
import { PositionDisplay } from "@/components/trading/PositionDisplay";
import { useTradeHistoryStore } from '@/store/tradeHistoryStore';

// Sample country data - in a real app, this would come from an API
const countryData = {
  usa: {
    name: "USA",
    flagCode: "us",
    countryScore: 1839,
    volume24h: "$1,500,000",
    indexPrice: "$1,300,000",
    sentiment: "Bullish",
    changePercent: 3.2,
    trend: "up",
    markPrice: "3.87M",
    fundingRate: "0.01%",
    openInterest: "$7,500,000",
    openTrades: "$120,800",
    volumes: "$200,000",
    fundingCooldown: "00:37:40",
    fundingPercent: "0.3000%",
    description:
      "The USA is one of the largest and most influential economies globally, driven by a diverse range of sectors including technology, finance, and consumer goods. With a CountryScore of 1,839, the U.S. reflects a strong economic performance, supported by GDP growth, low unemployment, and a stable inflation rate. The market is dominated by robust stock exchanges such as the S&P 500 and NASDAQ, which are major indicators of global investor sentiment.",
    liquidationPrice: "5.41M",
  },
  brazil: {
    name: "Brazil",
    flagCode: "br",
    countryScore: 900,
    volume24h: "$600,000",
    indexPrice: "$720,000",
    sentiment: "Bearish",
    changePercent: -0.3,
    trend: "down",
    markPrice: "2.15M",
    fundingRate: "0.015%",
    openInterest: "$3,200,000",
    openTrades: "$85,000",
    volumes: "$150,000",
    fundingCooldown: "00:45:20",
    fundingPercent: "0.4500%",
    description:
      "Brazil is the largest economy in South America, known for its rich natural resources and diverse industrial base. With a CountryScore of 900, Brazil's economy shows moderate growth potential, supported by its agricultural exports, mining sector, and growing technology industry. The country faces challenges with inflation and fiscal policy, but maintains strong potential in renewable energy and sustainable development.",
    liquidationPrice: "3.22M",
  },
  germany: {
    name: "Germany",
    flagCode: "de",
    countryScore: 1200,
    volume24h: "$800,000",
    indexPrice: "$1,100,000",
    sentiment: "Bearish",
    changePercent: -1.8,
    trend: "down",
    markPrice: "2.85M",
    fundingRate: "0.012%",
    openInterest: "$4,500,000",
    openTrades: "$95,000",
    volumes: "$180,000",
    fundingCooldown: "00:42:15",
    fundingPercent: "0.3800%",
    description:
      "Germany is Europe's largest economy and a global leader in manufacturing and engineering. With a CountryScore of 1,200, Germany's economy is characterized by its strong industrial base, particularly in automotive and machinery sectors. The country faces challenges with energy transition and demographic changes, but maintains a robust export-oriented economy and high standards of living.",
    liquidationPrice: "4.27M",
  },
  japan: {
    name: "Japan",
    flagCode: "jp",
    countryScore: 1600,
    volume24h: "$1,050,000",
    indexPrice: "$950,000",
    sentiment: "Bearish",
    changePercent: 0.5,
    trend: "up",
    markPrice: "3.25M",
    fundingRate: "0.008%",
    openInterest: "$5,800,000",
    openTrades: "$110,000",
    volumes: "$220,000",
    fundingCooldown: "00:35:10",
    fundingPercent: "0.2500%",
    description:
      "Japan is the world's third-largest economy, known for its advanced technology and manufacturing sectors. With a CountryScore of 1,600, Japan's economy shows resilience despite challenges with aging population and deflation. The country leads in robotics, electronics, and automotive industries, while maintaining a strong focus on innovation and quality manufacturing.",
    liquidationPrice: "4.87M",
  },
  india: {
    name: "India",
    flagCode: "in",
    countryScore: 1050,
    volume24h: "$1,200,000",
    indexPrice: "$850,000",
    sentiment: "Bullish",
    changePercent: 2.1,
    trend: "up",
    markPrice: "2.55M",
    fundingRate: "0.018%",
    openInterest: "$4,200,000",
    openTrades: "$90,000",
    volumes: "$190,000",
    fundingCooldown: "00:48:30",
    fundingPercent: "0.5200%",
    description:
      "India is one of the world's fastest-growing major economies, driven by its large domestic market and growing technology sector. With a CountryScore of 1,050, India's economy shows strong potential in IT services, manufacturing, and consumer goods. The country faces challenges with infrastructure and income inequality, but maintains robust growth prospects and a young, dynamic workforce.",
    liquidationPrice: "3.82M",
  },
  uk: {
    name: "United Kingdom",
    flagCode: "gb",
    countryScore: 1500,
    volume24h: "$2,000,000",
    indexPrice: "$1,350,000",
    sentiment: "Bullish",
    changePercent: 4.5,
    trend: "up",
    markPrice: "3.45M",
    fundingRate: "0.009%",
    openInterest: "$6,500,000",
    openTrades: "$130,000",
    volumes: "$250,000",
    fundingCooldown: "00:33:20",
    fundingPercent: "0.2800%",
    description:
      "The United Kingdom is one of the world's leading financial centers and a major global economy. With a CountryScore of 1,500, the UK's economy is driven by its strong financial services sector, creative industries, and advanced manufacturing. Despite challenges with Brexit and global economic shifts, the country maintains a competitive edge in technology, finance, and professional services.",
    liquidationPrice: "5.17M",
  },
  china: {
    name: "China",
    flagCode: "cn",
    countryScore: 1700,
    volume24h: "$1,500,000",
    indexPrice: "$1,100,000",
    sentiment: "Bullish",
    changePercent: 2.7,
    trend: "up",
    markPrice: "3.65M",
    fundingRate: "0.011%",
    openInterest: "$7,200,000",
    openTrades: "$140,000",
    volumes: "$280,000",
    fundingCooldown: "00:36:15",
    fundingPercent: "0.3200%",
    description:
      "China is the world's second-largest economy and a global manufacturing powerhouse. With a CountryScore of 1,700, China's economy shows strong growth potential, driven by its massive domestic market and technological innovation. The country leads in manufacturing, technology, and infrastructure development, while transitioning towards a more consumption-driven economic model.",
    liquidationPrice: "5.47M",
  },
  canada: {
    name: "Canada",
    flagCode: "ca",
    countryScore: 1400,
    volume24h: "$900,000",
    indexPrice: "$1,250,000",
    sentiment: "Neutral",
    changePercent: 1.1,
    trend: "up",
    markPrice: "3.15M",
    fundingRate: "0.010%",
    openInterest: "$5,500,000",
    openTrades: "$100,000",
    volumes: "$210,000",
    fundingCooldown: "00:39:45",
    fundingPercent: "0.2900%",
    description:
      "Canada is one of the world's wealthiest nations with a highly developed economy. With a CountryScore of 1,400, Canada's economy is characterized by its abundant natural resources, strong financial sector, and advanced technology industries. The country maintains a stable economic environment with a focus on sustainable development and innovation.",
    liquidationPrice: "4.72M",
  },
  australia: {
    name: "Australia",
    flagCode: "au",
    countryScore: 1450,
    volume24h: "$850,000",
    indexPrice: "$1,150,000",
    sentiment: "Bullish",
    changePercent: 3.3,
    trend: "up",
    markPrice: "3.25M",
    fundingRate: "0.009%",
    openInterest: "$5,200,000",
    openTrades: "$95,000",
    volumes: "$200,000",
    fundingCooldown: "00:38:30",
    fundingPercent: "0.2700%",
    description:
      "Australia is a highly developed economy with a strong focus on natural resources and services. With a CountryScore of 1,450, Australia's economy is characterized by its mining sector, agricultural exports, and growing technology industry. The country maintains a stable economic environment with a high standard of living and strong ties to Asian markets.",
    liquidationPrice: "4.87M",
  },
  mexico: {
    name: "Mexico",
    flagCode: "mx",
    countryScore: 950,
    volume24h: "$500,000",
    indexPrice: "$720,000",
    sentiment: "Bearish",
    changePercent: -2.1,
    trend: "down",
    markPrice: "2.25M",
    fundingRate: "0.016%",
    openInterest: "$3,500,000",
    openTrades: "$80,000",
    volumes: "$160,000",
    fundingCooldown: "00:46:15",
    fundingPercent: "0.4800%",
    description:
      "Mexico is a major emerging market economy with strong manufacturing and export sectors. With a CountryScore of 950, Mexico's economy shows potential in automotive manufacturing, electronics, and energy. The country faces challenges with economic inequality and security, but maintains strong trade relationships and a growing middle class.",
    liquidationPrice: "3.37M",
  },
  russia: {
    name: "Russia",
    flagCode: "ru",
    countryScore: 1200,
    volume24h: "$600,000",
    indexPrice: "$1,000,000",
    sentiment: "Bearish",
    changePercent: -1.5,
    trend: "down",
    markPrice: "2.85M",
    fundingRate: "0.014%",
    openInterest: "$4,000,000",
    openTrades: "$90,000",
    volumes: "$170,000",
    fundingCooldown: "00:43:20",
    fundingPercent: "0.4200%",
    description:
      "Russia is a major global economy with significant natural resources and industrial capacity. With a CountryScore of 1,200, Russia's economy is characterized by its energy sector, military-industrial complex, and raw materials exports. The country faces challenges with economic sanctions and diversification, but maintains strong potential in technology and manufacturing.",
    liquidationPrice: "4.27M",
  },
  korea: {
    name: "South Korea",
    flagCode: "kr",
    countryScore: 1300,
    volume24h: "$750,000",
    indexPrice: "$1,080,000",
    sentiment: "Neutral",
    changePercent: 0.8,
    trend: "up",
    markPrice: "3.05M",
    fundingRate: "0.010%",
    openInterest: "$4,800,000",
    openTrades: "$100,000",
    volumes: "$190,000",
    fundingCooldown: "00:40:15",
    fundingPercent: "0.3000%",
    description:
      "South Korea is a highly developed economy known for its technology and manufacturing sectors. With a CountryScore of 1,300, South Korea's economy is driven by its electronics, automotive, and shipbuilding industries. The country maintains a strong focus on innovation and exports, with leading global companies in various sectors.",
    liquidationPrice: "4.57M",
  },
};

export default function CountryPage() {
  const params = useParams();
  const countryId = typeof params.id === "string" ? params.id : "usa";
  const router = useRouter();
  const { isConnected, balance } = useWeb3();
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState(500);
  const { toast } = useToast();
  const { createPosition, isProcessing } = usePositionCreation();
  const [needsUSDCApproval, setNeedsUSDCApproval] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  // Initialize country data first
  const [country, setCountry] = useState(countryData.usa);

  // Update country when countryId changes
  useEffect(() => {
    // In a real app, fetch the country data based on the ID
    if (countryId && countryData[countryId as keyof typeof countryData]) {
      setCountry(countryData[countryId as keyof typeof countryData]);
    }
  }, [countryId]);

  // Calculate position size based on leverage and amount
  const positionSize = amount * leverage;

  // Convert string price to number for calculations
  const currentPrice = country?.markPrice
    ? parseFloat(country.markPrice as string)
    : 0;

  // Format the balance for display
  const formattedBalance =
    isConnected && balance ? parseFloat(balance.formatted).toFixed(2) : "0.00";

  // Convert formatted balance to number for validation
  const numericBalance =
    isConnected && balance ? parseFloat(balance.formatted) : 0;

  // Check if the amount exceeds the balance
  const isAmountValid = amount <= numericBalance;

  // Now that all required variables are defined, we can safely use the hook
  const { refresh: refreshPositions } = useCountryPositions(
    countryId,
    currentPrice
  );

  // Load positions when the component mounts
  useEffect(() => {
    refreshPositions();
  }, [refreshPositions]);

  // Add this timer ref to store the polling timeout
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling when component unmounts
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, []);

  const addTrade = useTradeHistoryStore((state) => state.addTrade);

  // Handle submitting a new trade
  const handlePlaceTrade = async () => {
    if (!isConnected || !isAmountValid || isProcessing) return;

    try {
      // If USDC approval is needed, don't proceed with the trade
      if (needsUSDCApproval) {
        toast({
          title: "USDC Approval Required",
          description: "Please approve USDC spending before opening a position",
          variant: "destructive",
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Processing Trade",
        description: "Your transaction is being processed...",
      });

      // Create a new position
      const result = await createPosition(
        countryId,
        country.name,
        direction,
        amount,
        leverage,
        currentPrice,
        currentPrice
      ).catch((error) => {
        console.error("Error caught in handlePlaceTrade:", error);
        return {
          success: false,
          error: error?.message || "Failed to process transaction",
          code: error?.code || "TRANSACTION_ERROR",
        };
      });

      // If position was successfully created
      if (result?.success) {
        // Create position object for display
        const positionData = {
          id: result.position?.id || `pos-${Date.now()}`,
          country: {
            id: countryId,
            name: country.name,
            flagUrl: `https://flagcdn.com/w160/${country.flagCode.toLowerCase()}.png`
          },
          direction: direction,
          size: amount,
          leverage: leverage,
          entryPrice: currentPrice,
          markPrice: currentPrice,
          openTime: new Date(),
          fundingRate: 0.01,
          nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
          txHash: result.txHash,
          unrealizedPnL: 0,
          liquidationPrice: direction === 'long' 
            ? currentPrice * (1 - 0.8 / leverage)
            : currentPrice * (1 + 0.8 / leverage)
        };

        // Show position display
        setCurrentPosition(positionData);
        setShowPosition(true);

        // ADD TRADE TO HISTORY
        const now = new Date();
        const time = now.toLocaleString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
        }).replace(',', '');
        addTrade({
          country: country.name,
          countryCode: country.flagCode,
          time,
          entryPrice: `$${currentPrice}`,
          marketPrice: `$${currentPrice}`,
          pnl: {
            amount: '$0',
            percentage: '0.00',
            isProfit: true,
          },
          status: 'Closed',
        });

        // Show success toast
        toast({
          title: "Trade Placed Successfully",
          description: `Your ${direction} position has been opened.`,
          variant: "default",
        });

        // Set up polling to refresh positions while waiting for confirmation
        let pollCount = 0;
        const maxPolls = 10;
        const pollInterval = 8000;

        const pollForPositionUpdate = () => {
          if (pollCount >= maxPolls) {
            console.log("Polling completed after reaching maximum attempts");
            return;
          }

          pollingTimerRef.current = setTimeout(async () => {
            console.log(`Polling for position update (${pollCount + 1}/${maxPolls})...`);
            await refreshPositions();
            pollCount++;
            pollForPositionUpdate();
          }, pollInterval);
        };

        // Start polling
        pollForPositionUpdate();

        // Scroll to positions panel after a delay
        setTimeout(() => {
          document.getElementById("positions-panel")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 1000);

        return;
      }

      // Handle specific error codes
      if (result?.code === "USDC_APPROVAL_REQUIRED") {
        setNeedsUSDCApproval(true);
        toast({
          title: "USDC Approval Required",
          description: "Please approve USDC spending before opening a position",
          variant: "destructive",
        });
        return;
      }

      // For all other errors, show a toast
      toast({
        title: "Trade Failed",
        description: result?.error || "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Unhandled exception in handlePlaceTrade:", error);
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to place trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle successful USDC approval
  const handleApprovalSuccess = () => {
    setNeedsUSDCApproval(false);
    toast({
      title: "USDC Approved",
      description:
        "You can now place your trade. Proceeding with transaction...",
      variant: "default",
    });

    // Add a short delay before retrying the trade to ensure the UI updates first
    setTimeout(() => {
      // Retry the trade now that we have approval
      handlePlaceTrade();
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 bg-[#111214] min-h-screen">
      {/* Back to Dashboard button */}
      <Link href="/dashboard" className="block mb-8">
        <div className="inline-flex justify-start items-center gap-[23px]">
          <div className="w-[58px] h-[58px] p-[9.67px] bg-[#1d1f22] rounded-[9.67px] flex justify-center items-center">
            <svg
              width="24.72"
              height="42.9"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scale-[1.2]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0274 21.1391C13.7253 20.8369 13.5557 20.4272 13.5557 20C13.5557 19.5728 13.7253 19.1631 14.0274 18.8609L23.1414 9.74689C23.2901 9.59301 23.4678 9.47027 23.6644 9.38584C23.861 9.3014 24.0724 9.25696 24.2863 9.2551C24.5002 9.25324 24.7124 9.294 24.9104 9.37501C25.1084 9.45602 25.2882 9.57565 25.4395 9.72692C25.5908 9.87819 25.7104 10.0581 25.7914 10.2561C25.8724 10.4541 25.9132 10.6662 25.9113 10.8801C25.9095 11.0941 25.865 11.3055 25.7806 11.502C25.6962 11.6986 25.5734 11.8764 25.4195 12.025L17.4445 20L25.4195 27.975C25.713 28.2789 25.8754 28.6858 25.8717 29.1083C25.8681 29.5307 25.6986 29.9348 25.3999 30.2335C25.1012 30.5322 24.6971 30.7016 24.2747 30.7053C23.8523 30.709 23.4453 30.5466 23.1414 30.2531L14.0274 21.1391Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="text-right justify-start text-[#d6d6d6] text-xl font-medium font-['Inter'] leading-tight">
            Back To Dashboard
          </div>
        </div>
      </Link>

      <div className="space-y-6">
        {/* Header Panel */}
        <div className="flex items-center justify-between gap-6 px-9 py-[18.86px] bg-[#1d1f22] rounded-xl shadow-[0px_0.7857142686843872px_1.5714285373687744px_0px_rgba(16,24,40,0.06)] shadow-[0px_0.7857142686843872px_2.357142925262451px_0px_rgba(16,24,40,0.10)] outline outline-[0.79px] outline-offset-[-0.79px] outline-[#323232] transition-all duration-200 hover:shadow-lg">
          {/* Flag Section */}
          <div className="flex-shrink-0 w-[62.29px] h-[62.29px] relative">
            <div className="absolute inset-0 rounded-full overflow-hidden bg-[#d7d7d7]">
              <Image
                src={`https://flagcdn.com/w160/${country.flagCode.toLowerCase()}.png`}
                alt={`${country.name} flag`}
                width={80}
                height={80}
                className="w-full h-full object-cover scale-110"
                priority
              />
            </div>
          </div>

          {/* Country Info Section */}
          <div className="flex flex-col gap-[13px] flex-grow">
            <div className="text-white text-[25.14px] font-medium font-['Inter'] leading-snug">
              {country.name}
            </div>
            <div className="text-[#70e000] text-xl font-medium font-['Inter'] leading-snug">
              {country.countryScore}
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-1 justify-end gap-8">
            {/* Open Trades */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ffe5664D] rounded-[100px] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00004 14.6666H10C13.3334 14.6666 14.6667 13.3333 14.6667 9.99992V5.99992C14.6667 2.66659 13.3334 1.33325 10 1.33325H6.00004C2.66671 1.33325 1.33337 2.66659 1.33337 5.99992V9.99992C1.33337 13.3333 2.66671 14.6666 6.00004 14.6666Z"
                    stroke="#ffa200"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.88666 9.66683L6.47332 7.72016C6.70666 7.4335 7.13332 7.38683 7.42666 7.62016L8.63332 8.62016C8.92666 8.8535 9.35332 8.80683 9.58666 8.52683L11.1133 6.66683"
                    stroke="#ffa200"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                  Open Trades
                </div>
                <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                  {country.openTrades}
                </div>
              </div>
            </div>

            {/* Volumes */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#60b6fb4D] rounded-[100px] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.66671 14.6667H9.33337C12.6667 14.6667 14 13.3334 14 10V6.66671C14 3.33337 12.6667 2.00004 9.33337 2.00004H6.66671C3.33337 2.00004 2.00004 3.33337 2.00004 6.66671V10C2.00004 13.3334 3.33337 14.6667 6.66671 14.6667Z"
                    stroke="#072ac8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 6.66663H5.5"
                    stroke="#072ac8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 9.33337H5.5"
                    stroke="#072ac8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                  Volumes
                </div>
                <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                  {country.volumes}
                </div>
              </div>
            </div>

            {/* Funding/Cooldown */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ff45454D] rounded-[100px] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6667 8C14.6667 11.68 11.68 14.6667 8 14.6667C4.32 14.6667 1.33333 11.68 1.33333 8C1.33333 4.32 4.32 1.33333 8 1.33333C11.68 1.33333 14.6667 4.32 14.6667 8Z"
                    stroke="#ff4545"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 5.33333V8.66666"
                    stroke="#ff4545"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.99667 10.6667H8.00267"
                    stroke="#ff4545"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                  Funding/Cooldown
                </div>
                <div>
                  <span className="text-[#16b264] text-sm font-medium font-['Inter'] leading-tight">
                    {country.fundingPercent}{" "}
                  </span>
                  <span className="text-white text-sm font-medium font-['Inter'] leading-tight">
                    {country.fundingCooldown}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart Panel */}
          <div className="md:col-span-2 w-full h-[520px] p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
                Live Countryscore
              </div>
              <div className="justify-start text-[#70e000] text-xl font-medium font-['Inter'] leading-snug">
                {country.countryScore}
              </div>
            </div>
            <div className="self-stretch flex-1 inline-flex justify-start items-start">
              <div className="flex-1 self-stretch relative">
                <div className="w-full h-[424px] left-0 top-0 absolute inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex-1 flex flex-col justify-between items-center">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="self-stretch h-0 relative">
                        <div className="w-full h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                      </div>
                    ))}
                  </div>

                  {/* Line Chart SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="greenGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#70E000"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#70E000"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Area under the line */}
                    <path
                      d="M40,280 L100,200 L160,240 L220,180 L280,220 L340,160 L400,190 L460,150 L520,180 L580,140 L640,170 L700,130 L760,150 L760,350 L40,350 Z"
                      fill="url(#greenGradient)"
                    />

                    {/* Main line */}
                    <path
                      d="M40,280 L100,200 L160,240 L220,180 L280,220 L340,160 L400,190 L460,150 L520,180 L580,140 L640,170 L700,130 L760,150"
                      stroke="#70E000"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Data points */}
                    {[
                      [40, 280],
                      [100, 200],
                      [160, 240],
                      [220, 180],
                      [280, 220],
                      [340, 160],
                      [400, 190],
                      [460, 150],
                      [520, 180],
                      [580, 140],
                      [640, 170],
                      [700, 130],
                      [760, 150],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#70E000" />
                    ))}
                  </svg>

                  <div className="self-stretch px-6 inline-flex justify-between items-center">
                    {[
                      "28 April",
                      "29 April",
                      "30 April",
                      "1 May",
                      "2 May",
                      "3 May",
                      "4 May",
                      "5 May",
                      "6 May",
                      "7 May",
                      "8 May",
                      "9 May",
                    ].map((date) => (
                      <div
                        key={date}
                        className="justify-start text-[#697485] text-xs font-normal font-['Inter'] leading-[18px]"
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full h-[398px] px-5 left-0 top-0 absolute inline-flex justify-between items-end">
                  {[...Array(13)].map((_, i) => (
                    <div key={i} className="w-8 self-stretch relative">
                      {i === 0 && (
                        <div className="w-8 h-[420px] left-0 top-[29px] absolute" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[47px] self-stretch flex justify-between items-start">
                <div className="w-[398px] h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#323232]"></div>
                <div className="w-[30px] self-stretch inline-flex flex-col justify-start items-start gap-[27px]">
                  {[
                    "2500",
                    "2300",
                    "2000",
                    "1800",
                    "1600",
                    "1400",
                    "1200",
                    "1100",
                    "900",
                  ].map((value) => (
                    <div
                      key={value}
                      className="self-stretch justify-start text-[#697485] text-xs font-normal font-['Inter'] leading-[18px]"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="self-stretch p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-6 transition-all duration-200 hover:shadow-lg">
            <div className="self-stretch px-2.5 py-2 bg-[#2d2d2e] rounded-[100px] flex">
              <div className="self-stretch h-[61px] flex-1 flex items-center relative">
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out flex ${
                    direction === "long" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`h-full w-1/2 ${
                      direction === "long" ? "bg-[#16b264]" : "bg-[#FF4B4B]"
                    } rounded-[100px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)]`}
                  />
                </div>
                <div
                  className={`flex-1 z-10 px-[18.86px] py-[15px] flex justify-center items-center gap-[18.86px] cursor-pointer transition-colors duration-300 ${
                    direction === "long" ? "text-white" : "text-[#545454]"
                  }`}
                  onClick={() => setDirection("long")}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 20.25a.75.75 0 01-.75-.75V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 11-1.06 1.06l-5.47-5.47V19.5a.75.75 0 01-.75.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xl font-medium font-['Inter'] leading-snug">
                      Long
                    </span>
                  </div>
                </div>
                <div
                  className={`flex-1 z-10 px-[18.86px] py-[15px] flex justify-center items-center gap-[18.86px] cursor-pointer transition-colors duration-300 ${
                    direction === "short" ? "text-white" : "text-[#545454]"
                  }`}
                  onClick={() => setDirection("short")}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v13.19l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 111.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xl font-medium font-['Inter'] leading-snug">
                      Short
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch flex-1 bg-[#1d1f22] rounded shadow-[0px_0.7857142686843872px_1.5714285373687744px_0px_rgba(16,24,40,0.06)] shadow-[0px_0.7857142686843872px_2.357142925262451px_0px_rgba(16,24,40,0.10)] flex flex-col justify-between items-start">
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  <div className="self-stretch inline-flex justify-start items-center gap-[12.57px]">
                    <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-snug">
                      Market
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-start gap-[19px]">
                    <div className="flex-1 flex justify-start items-center gap-[12.57px]">
                      <div className="flex-1 justify-start">
                        <span className="text-[#666666] text-base font-medium font-['Inter'] leading-snug">
                          Balance :{" "}
                        </span>
                        <span className="text-white text-base font-medium font-['Inter'] leading-snug">
                          ${isConnected && balance ? formattedBalance : "0.00"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-[12.57px]">
                      <div className="justify-start text-[#666666] text-base font-medium font-['Inter'] leading-snug cursor-pointer">
                        Deposit Funds
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-[63px] px-[22px] py-1.5 bg-[#2d2e2e] rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] inline-flex justify-end items-center gap-1">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className={`flex-1 bg-transparent text-left outline-none border-none ${
                      isAmountValid ? "text-white" : "text-red-500"
                    } text-xl font-bold font-['Inter'] leading-tight`}
                  />
                  <div className="text-[#d6d6d6] text-xl font-bold font-['Inter'] leading-tight">
                    nUSDC
                  </div>
                </div>
                <div className="self-stretch py-6 relative inline-flex justify-start items-center gap-3">
                  <div className="flex-1 h-1 bg-[#2d2e2e] rounded-full relative">
                    <div
                      className="absolute h-full bg-gradient-to-r from-[#155dee] to-[#45b3ff] rounded-full transition-all duration-200"
                      style={{ width: `${((leverage - 1) / 4) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={leverage}
                      onChange={(e) => setLeverage(parseInt(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                    />
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        className="absolute top-1/2 -translate-y-1/2 -ml-1 z-10"
                        style={{ left: `${((value - 1) / 4) * 100}%` }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            value <= leverage
                              ? "bg-white shadow-[0_0_8px_rgba(21,93,238,0.5)]"
                              : "bg-[#404040]"
                          }`}
                        />
                      </div>
                    ))}
                    <div
                      className="absolute -top-3 -ml-3 z-10 transition-all duration-200"
                      style={{ left: `${((leverage - 1) / 4) * 100}%` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#155dee] to-[#45b3ff] shadow-[0_0_10px_rgba(21,93,238,0.5)] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="w-12 flex justify-center items-center">
                    <div className="text-center text-[#717171] text-xl font-medium font-['Inter'] leading-normal bg-[#2d2e2e] px-3 py-1 rounded-full">
                      x{leverage}
                    </div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-center items-center">
                  <div className="w-56 py-4 flex justify-center items-center gap-8">
                    <div className="w-[202px] flex justify-center items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-[100px] flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#16b2644D] rounded-[100px] flex items-center justify-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33333 8 1.33333C4.32 1.33333 1.33333 4.32 1.33333 8C1.33333 11.68 4.32 14.6667 8 14.6667Z"
                              stroke="#16b264"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.33333 8L7.33333 10L10.6667 6.66667"
                              stroke="#16b264"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="w-[181px] inline-flex flex-col justify-start items-start">
                        <div className="self-stretch justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                          Size - Entry Price
                        </div>
                        <div className="self-stretch justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                          ${positionSize} at {country.markPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[132px] py-4 flex justify-start items-center gap-8">
                    <div className="flex-1 flex justify-start items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-[100px] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 inline-flex flex-col justify-start items-start">
                        <div className="self-stretch justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                          Liquidated at
                        </div>
                        <div className="self-stretch justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                          {country.liquidationPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={`self-stretch h-[60px] px-4 py-2 ${
                    isConnected &&
                    isAmountValid &&
                    !isProcessing &&
                    !needsUSDCApproval
                      ? "bg-[#155dee]"
                      : "bg-gray-600"
                  } rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12)] inline-flex justify-center items-center gap-1 ${
                    !isConnected ||
                    !isAmountValid ||
                    isProcessing ||
                    needsUSDCApproval
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    !isConnected ||
                    !isAmountValid ||
                    isProcessing ||
                    needsUSDCApproval
                  }
                  onClick={handlePlaceTrade}
                >
                  <div className="text-center justify-center text-white text-xl font-medium font-['Inter'] leading-normal">
                    {!isConnected
                      ? "Connect Wallet to Trade"
                      : !isAmountValid
                      ? "Insufficient Balance"
                      : isProcessing
                      ? "Processing..."
                      : needsUSDCApproval
                      ? "Approve USDC First"
                      : "Place Trade"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Panel */}
          <div className="self-stretch p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 transition-all duration-200 hover:shadow-lg">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
                About
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-[#99a3b2]"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6a2 2 0 11-4 0 2 2 0 014 0zM12 12a2 2 0 11-4 0 2 2 0 014 0zM12 18a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-[#676767] text-lg font-medium font-['Inter'] leading-7">
                {country.description}
              </div>
            </div>
          </div>

          {/* Leaderboard Panel */}
          <div className="self-stretch h-[407px] p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 transition-all duration-200 hover:shadow-lg">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
                Leaderboard
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-[#99a3b2]"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6a2 2 0 11-4 0 2 2 0 014 0zM12 12a2 2 0 11-4 0 2 2 0 014 0zM12 18a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-[#676767] text-lg font-medium font-['Inter'] leading-7">
                You are ranked 167th in Indonesia
              </div>
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start">
              <div className="self-stretch h-px relative">
                <div className="w-[399px] h-px left-0 top-0 absolute bg-[#323232]" />
              </div>
              <div className="self-stretch h-px relative" />
              <div className="self-stretch py-4 inline-flex justify-between items-center">
                <div className="w-[244px] flex justify-between items-center">
                  <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                    Rank #1
                  </div>
                  <div className="flex justify-start items-center gap-3">
                    <Image
                      className="w-[33px] h-8 rounded-[100px]"
                      src="/sarah.jpg"
                      alt="Profile 1"
                      width={33}
                      height={32}
                    />
                    <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                      0xMeiline
                    </div>
                  </div>
                </div>
                <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
                  $250,000
                </div>
              </div>
              <div className="self-stretch h-px bg-[#323232]" />
              <div className="self-stretch py-4 inline-flex justify-between items-center">
                <div className="w-[231px] flex justify-between items-center">
                  <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                    Rank #2
                  </div>
                  <div className="flex justify-start items-center gap-3">
                    <Image
                      className="w-[33px] h-8 rounded-[100px]"
                      src="/john.jpg"
                      alt="Profile 2"
                      width={33}
                      height={32}
                    />
                    <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                      0xClara
                    </div>
                  </div>
                </div>
                <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
                  $12,000
                </div>
              </div>
              <div className="self-stretch h-px relative">
                <div className="w-[399px] h-px left-0 top-0 absolute bg-[#323232]" />
              </div>
              <div className="self-stretch py-4 inline-flex justify-between items-center">
                <div className="w-[247px] flex justify-between items-center">
                  <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">
                    Rank #3
                  </div>
                  <div className="flex justify-start items-center gap-3">
                    <Image
                      className="w-[33px] h-8 rounded-[100px]"
                      src="/david.jpg"
                      alt="Profile 3"
                      width={33}
                      height={32}
                    />
                    <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                      0xEdward
                    </div>
                  </div>
                </div>
                <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
                  $10,000
                </div>
              </div>
              <div className="self-stretch h-px relative">
                <div className="w-[399px] h-px left-0 top-0 absolute bg-[#323232]" />
              </div>
              <div className="self-stretch py-4 inline-flex justify-between items-center">
                <div className="w-60 flex justify-between items-center">
                  <div className="justify-start text-white text-sm font-semibold font-['Inter'] leading-tight">
                    Rank #167
                  </div>
                  <div className="flex justify-start items-center gap-3">
                    <Image
                      className="w-[33px] h-8 rounded-[100px]"
                      src="/placeholder-user.jpg"
                      alt="Profile 4"
                      width={33}
                      height={32}
                    />
                    <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">
                      0xCeline
                    </div>
                  </div>
                </div>
                <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
                  $1,000
                </div>
              </div>
              <div className="self-stretch h-px relative" />
              <div className="self-stretch h-px relative" />
            </div>
          </div>

          {/* Positions Panel */}
          <div
            id="positions-panel"
            className="self-stretch p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5"
          >
            {showPosition && currentPosition ? (
              <PositionDisplay 
                position={currentPosition} 
                onClose={() => setShowPosition(false)}
              />
            ) : (
              <>
                <div className="self-stretch inline-flex justify-start items-center gap-4">
                  <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
                    Positions
                  </div>
                </div>
                <CountryPositionsList
                  countryId={countryId}
                  currentPrice={currentPrice}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

