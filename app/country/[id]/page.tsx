"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";
import { parseUnits } from "viem";

import {
  USDC_ADDRESSES,
  USDC_ABI,
  MockUSDC_ABI,
} from "@/lib/contracts/constants";
import { usePositionsStore } from "@/components/trading/PositionsContext";
import { useTradeHistoryStore } from "@/components/dashboard/tradeHistoryStore";

// Sample country data - in a real app, this would come from an API
const countryData = {
  usa: {
    name: "USA",
    flagCode: "us",
    countryScore: 1839,
    volume24h: "1,500,000", //PTT 1,500,000
    indexPrice: "$1,300,000", //PTT 1,300,000
    sentiment: "Bullish",
    changePercent: 3.2,
    trend: "up",
    markPrice: "3.87M",
    fundingRate: "0.01%",
    openInterest: "$7,500,000", //PTT 7,500,000
    openTrades: "$120,800", //PTT 120,000
    volumes: "$200,000", //PTT 200,000
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

// Add these type definitions before the ClosePositionModal component
interface ClosePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    size: string;
    leverage: string;
    isLong: boolean;
  };
  country: {
    name: string;
    markPrice: string;
  };
}

type StepType = 1 | 2 | 3 | 4;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ClosePositionModal({
  isOpen,
  onClose,
  position,
  country,
}: ClosePositionModalProps) {
  const [step, setStep] = useState<StepType>(1);
  const [previousBalance] = useState(1000.0);

  const steps = {
    1: {
      title: "Close Position",
      subtitle: "Are you sure you want to close this position?",
    },
    2: {
      title: "Confirm PnL",
      subtitle: "Review your position's performance",
    },
    3: {
      title: "Updated Balance",
      subtitle: "Your new balance after closing position",
    },
    4: {
      title: "Trade History",
      subtitle: "Position successfully closed",
    },
  } as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1f22] rounded-xl p-6 w-[400px]">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((number) => (
            <div key={number} className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step === number
                    ? "bg-[#155dee] text-white"
                    : step > number
                    ? "bg-[#155dee] text-white"
                    : "bg-[#2d2d2e] text-gray-400"
                }`}
              >
                {number}
              </div>
              {number < 4 && (
                <div
                  className={`h-0.5 flex-1 ${
                    step > number ? "bg-[#155dee]" : "bg-[#2d2d2e]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-white text-xl font-semibold mb-2">
            {steps[step].title}
          </h2>
          <p className="text-gray-400 text-sm">{steps[step].subtitle}</p>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Position</span>
              <span className="text-white">
                {country.name} {position.isLong ? "LONG" : "SHORT"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Size</span>
              <span className="text-white">${position.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Price</span>
              <span className="text-white">{country.markPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mark Price</span>
              <span className="text-white">{country.markPrice}</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <div className="text-[#16b264] text-2xl font-bold">+$0.00</div>
              <div className="text-[#16b264]">(+0.0%)</div>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray-400">Trading Fees</span>
              <span className="text-white">-$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Net PnL</span>
              <span className="text-[#16b264]">+$0.00</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center mb-6">
            <div className="text-white text-3xl font-bold mb-2">$1,234.56</div>
            <div className="text-gray-400">
              Previous: ${previousBalance.toFixed(2)}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <div>
                <div className="text-white">
                  {country.name} {position.isLong ? "LONG" : "SHORT"}
                </div>
                <div className="text-gray-400 text-sm">
                  Closed at {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#16b264]">+$0.00</div>
                <div className="text-gray-400 text-sm">0.0%</div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#2d2d2e] text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-full bg-[#155dee] text-white"
              >
                Continue
              </button>
            </>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-full bg-[#155dee] text-white"
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => setStep(4)}
              className="w-full py-3 rounded-full bg-[#155dee] text-white"
            >
              View History
            </button>
          )}
          {step === 4 && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#155dee] text-white"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CountryPage() {
  const { id } = useParams();
  const country = countryData[id as keyof typeof countryData];
  const { addTrade, updateTrade } = useTradeHistoryStore();
  const [tradeId, setTradeId] = useState<string>("");

  const [position, setPosition] = useState({
    size: "",
    leverage: "1",
    isLong: true,
  });

  const [showPosition, setShowPosition] = useState(false);
  const [closeStep, setCloseStep] = useState<1 | 2 | 3 | 4 | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const { address } = useAccount();
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address,
    token: "0xb8e29BB907E0cb9aBfbAa9233EfE44dF07364a2A",
  });

  const { triggerRefresh } = usePositionsStore();

  // Use the hook unconditionally
  const { refetch: refetchPositionFromHook } = useReadContract({
    address: USDC_ADDRESSES[50002],
    abi: MockUSDC_ABI,
    functionName: "getPosition",
    args: [] as const,
    account: address, // Use account instead of enabled
  });

  // Create a wrapper function that conditionally calls the hook's refetch
  const refetchPosition = () => {
    if (address) {
      return refetchPositionFromHook();
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (hash && !isConfirming) {
      const savedSize = position.size; // Save the size before resetting
      setPosition({
        size: savedSize, // Keep the size
        leverage: "1",
        isLong: true,
      });
      setShowPosition(true);

      document
        .querySelector("#positions-panel")
        ?.scrollIntoView({ behavior: "smooth" });

      const timer = setTimeout(() => {
        refetchBalance().catch((err) =>
          console.error("Failed to refresh balance:", err)
        );
        triggerRefresh();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [hash, isConfirming, refetchBalance, triggerRefresh, position.size]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        refetchBalance();
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [address, refetchBalance]);

  const handlePlaceTrade = async () => {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("Country ID is required");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      const decimals = 6; // USDC decimals

      // Use parseUnits for USDC
      const sizeInWei = parseUnits(
        (Number(position.size) * Number(position.leverage)).toString(),
        decimals
      );
      console.log("Approving", sizeInWei, "tokens");

      // Generate unique trade ID
      const newTradeId = `trade-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setTradeId(newTradeId);

      // Add trade to history immediately when placing
      addTrade({
        id: newTradeId,
        country: country.name,
        countryCode: id as string,
        time: new Date().toLocaleTimeString(),
        entryPrice: country.markPrice,
        marketPrice: country.markPrice,
        pnl: {
          amount: "$0.00",
          percentage: "0.0",
          isProfit: true,  token: "0x2904921988f84BBD764D585e6f0249869FDEb25C",
        },
        status: "Open",
      });

      // 1. Approve contract to use USDC
      const approvalTx = await writeContract({
        address: USDC_ADDRESSES[50002],
        abi: USDC_ABI,
        functionName: "approve",
        args: [USDC_ADDRESSES[50002], sizeInWei],
      });
      console.log("Approval TX:", approvalTx);

      // Wait for approval confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2. Open Position
      const tradeTx = await writeContract({
        address: USDC_ADDRESSES[50002],
        abi: MockUSDC_ABI,
        functionName: "openPosition",
        args: [
          id,
          position.isLong ? 0 : 1,
          Number(position.leverage),
          sizeInWei,
        ],
        value: sizeInWei,
      });
      console.log("Trade TX:", tradeTx);

      // Refresh position data explicitly
      refetchPosition().catch((err) =>
        console.error("Failed to refresh position:", err)
      );
      refetchBalance().catch((err: Error) =>
        console.error("Failed to refresh balance:", err)
      );
      triggerRefresh();
    } catch (error) {
      console.error("Error placing trade:", error);
      if (error instanceof Error) {
        alert("Failed to trade: " + error.message);
      } else {
        alert("Failed to trade: " + JSON.stringify(error));
      }
    }
  };

  const isProcessing = isPending || isConfirming;

  const handleCloseStepContinue = () => {
    if (closeStep === 1) {
      // Update the existing trade's status to Closed
      if (tradeId) {
        updateTrade(tradeId, {
          status: "Closed",
          marketPrice: country.markPrice,
          time: new Date().toLocaleTimeString(),
          pnl: {
            amount: "$0.00",
            percentage: "0.0",
            isProfit: true,
          },
        });
      }
      setCloseStep(2 as StepType);
    } else if (closeStep === 2) {
      setCloseStep(3 as StepType);
    } else if (closeStep === 3) {
      setCloseStep(4 as StepType);
    } else if (closeStep === 4) {
      setCloseStep(null);
      setShowPosition(false);
      setTradeId(""); // Clear the trade ID
    }
  };

  if (!country) {
    return <div>Country not found</div>;
  }

  return (
    <>
      <div className="container mx-auto p-2 sm:p-6 bg-[#111214] min-h-screen">
        {/* Back to Dashboard button - more compact on mobile */}
        <Link href="/dashboard" className="block mb-4 sm:mb-8">
          <div className="inline-flex justify-start items-center gap-2 sm:gap-[23px]">
            <div className="w-[40px] h-[40px] sm:w-[58px] sm:h-[58px] p-2 sm:p-[9.67px] bg-[#1d1f22] rounded-[9.67px] flex justify-center items-center">
              {/* ... existing back arrow SVG ... */}
            </div>
            <div className="text-right justify-start text-[#d6d6d6] text-base sm:text-xl font-medium font-['Inter'] leading-tight">
              Back To Dashboard
            </div>
          </div>
        </Link>

        <div className="space-y-4 sm:space-y-6">
          {/* Country Header Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 px-3 sm:px-9 py-3 sm:py-[18.86px] bg-[#1d1f22] rounded-xl shadow-[0px_0.7857142686843872px_1.5714285373687744px_0px_rgba(16,24,40,0.06)] shadow-[0px_0.7857142686843872px_2.357142925262451px_0px_rgba(16,24,40,0.10)] outline outline-[0.79px] outline-offset-[-0.79px] outline-[#323232] transition-all duration-200 hover:shadow-lg">
            {/* Flag Section */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-[62.29px] sm:h-[62.29px] relative">
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

            {/* Country Info */}
            <div className="flex flex-col gap-2 sm:gap-[13px] flex-grow">
              <div className="text-white text-lg sm:text-[25.14px] font-medium font-['Inter'] leading-snug">
                {country.name}
              </div>
              <div className="text-[#70e000] text-base sm:text-xl font-medium font-['Inter'] leading-snug">
                {country.countryScore}
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex flex-col sm:flex-row flex-1 justify-center gap-2 sm:gap-8 w-full">
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

          {/* Grid Layout - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Chart Panel - Full width on mobile */}
            <div className="md:col-span-2 w-full h-[400px] sm:h-[520px] p-3 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 overflow-hidden transition-all duration-200 hover:shadow-lg">
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
                        // "28 April",
                        // "29 April",
                        // "30 April",
                        // "1 May",
                        // "2 May",
                        // "3 May",
                        // "4 May",
                        // "5 May",
                        // "6 May",
                        // "7 May",
                        // "8 May",
                        // "9 May",
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

            {/* Trading Panel - Full width on mobile */}
            <div className="self-stretch p-3 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-6 transition-all duration-200 hover:shadow-lg">
              <div className="self-stretch px-2.5 py-2 bg-[#2d2d2e] rounded-[100px] flex">
                <div className="self-stretch h-[61px] flex-1 flex items-center relative">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ease-in-out flex ${
                      position.isLong ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`h-full w-1/2 ${
                        position.isLong ? "bg-[#16b264]" : "bg-[#FF4B4B]"
                      } rounded-[100px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)]`}
                    />
                  </div>
                  <div
                    className={`flex-1 z-10 px-[18.86px] py-[15px] flex justify-center items-center gap-[18.86px] cursor-pointer transition-colors duration-300 ${
                      position.isLong ? "text-white" : "text-[#545454]"
                    }`}
                    onClick={() => setPosition({ ...position, isLong: true })}
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
                      position.isLong ? "text-white" : "text-[#545454]"
                    }`}
                    onClick={() => setPosition({ ...position, isLong: false })}
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
                            {walletBalance
                              ? `${Number(walletBalance.formatted).toFixed(
                                  4
                                )} ${walletBalance.symbol}`
                              : "Loading..."}
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
                  <div className="self-stretch h-[63px] px-3 sm:px-[22px] py-1.5 bg-[#2d2e2e] rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] inline-flex justify-end items-center gap-1">
                    <input
                      type="number" 
                      value={position.size}
                      onChange={(e) => setPosition({ ...position, size: e.target.value })}
                      className="flex-1 bg-transparent text-left outline-none border-none text-white text-base sm:text-xl font-bold font-['Inter'] leading-tight w-full min-w-0"
                      placeholder="Enter amount"
                    />
                    <div className="text-[#d6d6d6] text-base sm:text-xl font-bold font-['Inter'] leading-tight whitespace-nowrap">
                      USDC
                    </div>
                  </div>
                  <div className="self-stretch py-6 relative inline-flex justify-start items-center gap-3">
                    <div className="flex-1 h-1 bg-[#2d2e2e] rounded-full relative">
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#155dee] to-[#45b3ff] rounded-full transition-all duration-200"
                        style={{
                          width: `${
                            ((Number(position.leverage) - 1) / 4) * 100
                          }%`,
                        }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={position.leverage}
                        onChange={(e) =>
                          setPosition({ ...position, leverage: e.target.value })
                        }
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
                              value <= Number(position.leverage)
                                ? "bg-white shadow-[0_0_8px_rgba(21,93,238,0.5)]"
                                : "bg-[#404040]"
                            }`}
                          />
                        </div>
                      ))}
                      <div
                        className="absolute -top-3 -ml-3 z-10 transition-all duration-200"
                        style={{
                          left: `${
                            ((Number(position.leverage) - 1) / 4) * 100
                          }%`,
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#155dee] to-[#45b3ff] shadow-[0_0_10px_rgba(21,93,238,0.5)] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="w-12 flex justify-center items-center">
                      <div className="text-center text-[#717171] text-xl font-medium font-['Inter'] leading-normal bg-[#2d2e2e] px-3 py-1 rounded-full">
                        x{position.leverage}
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
                            ${Number(position.size) * Number(position.leverage)}{" "}
                            at {country.markPrice}
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
                      position.size && !isProcessing
                        ? "bg-[#155dee]"
                        : "bg-gray-600"
                    } rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12)] inline-flex justify-center items-center gap-1`}
                    disabled={!position.size || isProcessing}
                    onClick={handlePlaceTrade}
                  >
                    <div className="text-center justify-center text-white text-xl font-medium font-['Inter'] leading-normal">
                      {isProcessing ? "Processing..." : "Place Trade"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid - Stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* About Panel */}
          <div className="self-stretch p-3 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 transition-all duration-200 hover:shadow-lg">
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
          <div className="self-stretch h-auto sm:h-[407px] p-3 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5 transition-all duration-200 hover:shadow-lg">
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
            className="self-stretch p-3 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-5"
          >
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
                Positions
              </div>
              {showPosition && closeStep === null && (
                <div
                  className="w-[116px] h-10 px-[10.75px] py-1 rounded-[67.21px] shadow-[0px_0.6720554232597351px_1.3441108465194702px_0px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#155dee] flex justify-center items-center gap-[2.69px] cursor-pointer"
                  onClick={() => setCloseStep(1)}
                >
                  <div className="text-center justify-center text-[#155dee] text-base font-semibold font-['Inter'] leading-none">
                    Close
                  </div>
                </div>
              )}
            </div>
            {showPosition && closeStep === null ? (
              <div className="self-stretch flex-1 flex flex-col justify-start items-start">
                <div className="self-stretch h-px relative">
                  <div className="w-[449px] h-px left-0 top-0 absolute bg-[#323232]" />
                </div>
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                  <div className="w-[71px] flex justify-between items-center">
                    <div className="w-4 h-[15px] bg-[#155dee] rounded-[100px]" />
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      {country.name}
                    </div>
                  </div>
                  <div className="justify-start text-[#b21616] text-sm font-normal font-['Inter'] leading-tight">
                    -$0.24 (-0.0%)
                  </div>
                </div>
                <div className="self-stretch py-3.5 inline-flex justify-between items-center">
                  <div className="w-[101px] flex justify-between items-center">
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      Position Size
                    </div>
                  </div>
                  <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">
                    ${position.size}
                  </div>
                </div>
                <div className="self-stretch py-3.5 inline-flex justify-between items-center">
                  <div className="w-[101px] flex justify-between items-center">
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      Entry Price
                    </div>
                  </div>
                  <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">
                    {country.markPrice}
                  </div>
                </div>
                <div className="self-stretch py-3.5 inline-flex justify-between items-center">
                  <div className="w-[101px] flex justify-between items-center">
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      Liquidation Price
                    </div>
                  </div>
                  <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">
                    {country.liquidationPrice}
                  </div>
                </div>
                <div className="self-stretch py-3.5 inline-flex justify-between items-center">
                  <div className="w-[101px] flex justify-between items-center">
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      Fees
                    </div>
                  </div>
                  <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">
                    $2.50
                  </div>
                </div>
                <div className="self-stretch h-px relative">
                  <div className="w-[449px] h-px left-0 top-0 absolute bg-[#323232]" />
                </div>
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                  <div className="w-[101px] flex justify-between items-center">
                    <div className="w-4 h-[15px] bg-[#155dee] rounded-[100px]" />
                    <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">
                      Abstract
                    </div>
                  </div>
                  <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">
                    $0.24 (+0.5%)
                  </div>
                </div>
              </div>
            ) : closeStep ? (
              <div className="self-stretch flex-1">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-8">
                  {[1, 2, 3, 4].map((number) => (
                    <div key={number} className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          closeStep === number
                            ? "bg-[#155dee] text-white"
                            : closeStep > number
                            ? "bg-[#155dee] text-white"
                            : "bg-[#2d2d2e] text-gray-400"
                        }`}
                      >
                        {number}
                      </div>
                      {number < 4 && (
                        <div
                          className={`h-0.5 flex-1 ${
                            closeStep > number ? "bg-[#155dee]" : "bg-[#2d2d2e]"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="mb-6">
                  {closeStep === 1 && (
                    <>
                      <div className="text-center mb-6">
                        <h2 className="text-white text-xl font-semibold mb-2">
                          Close Position
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Are you sure you want to close this position?
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Position</span>
                          <span className="text-white">
                            {country.name} {position.isLong ? "LONG" : "SHORT"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Size</span>
                          <span className="text-white">${position.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entry Price</span>
                          <span className="text-white">
                            {country.markPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mark Price</span>
                          <span className="text-white">
                            {country.markPrice}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {closeStep === 2 && (
                    <>
                      <div className="text-center mb-6">
                        <h2 className="text-white text-xl font-semibold mb-2">
                          Confirm PnL
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Review your position&apos;s performance
                        </p>
                      </div>
                      <div className="text-center mb-6">
                        <div className="text-[#16b264] text-2xl font-bold">
                          +$0.00
                        </div>
                        <div className="text-[#16b264]">(+0.0%)</div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Trading Fees</span>
                          <span className="text-white">-$0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Net PnL</span>
                          <span className="text-[#16b264]">+$0.00</span>
                        </div>
                      </div>
                    </>
                  )}

                  {closeStep === 3 && (
                    <>
                      <div className="text-center mb-6">
                        <h2 className="text-white text-xl font-semibold mb-2">
                          Updated Balance
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Your new balance after closing position
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-3xl font-bold mb-2">
                          $1,234.56
                        </div>
                        <div className="text-gray-400">Previous: $1,000.00</div>
                      </div>
                    </>
                  )}

                  {closeStep === 4 && (
                    <>
                      <div className="text-center mb-6">
                        <h2 className="text-white text-xl font-semibold mb-2">
                          Trade History
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Position successfully closed
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-white">
                            {country.name} {position.isLong ? "LONG" : "SHORT"}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Closed at {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#16b264]">+$0.00</div>
                          <div className="text-gray-400 text-sm">0.0%</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  {closeStep === 1 && (
                    <>
                      <button
                        onClick={() => setCloseStep(null)}
                        className="flex-1 py-3 rounded-full bg-[#2d2d2e] text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCloseStepContinue}
                        className="flex-1 py-3 rounded-full bg-[#155dee] text-white"
                      >
                        Continue
                      </button>
                    </>
                  )}
                  {closeStep === 2 && (
                    <button
                      onClick={handleCloseStepContinue}
                      className="w-full py-3 rounded-full bg-[#155dee] text-white"
                    >
                      Continue
                    </button>
                  )}
                  {closeStep === 3 && (
                    <button
                      onClick={handleCloseStepContinue}
                      className="w-full py-3 rounded-full bg-[#155dee] text-white"
                    >
                      View History
                    </button>
                  )}
                  {closeStep === 4 && (
                    <button
                      onClick={handleCloseStepContinue}
                      className="w-full py-3 rounded-full bg-[#155dee] text-white"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No open positions
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
