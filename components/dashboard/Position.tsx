"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useOpenPosition } from "@/app/country/[id]/page";

// Mock fetcher function - replace with your actual fetcher
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PLACEHOLDER_FLAG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDQtMDVUMTU6MTM6MzMtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDQtMDVUMTU6MTM6MzMtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA0LTA1VDE1OjEzOjMzLTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0wNVQxNToxMzozMy0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+O7+8OAAAAO1JREFUWIXtlj0OwjAMhT+gA2PnHoAzcAUWzsEFWLgMN2BhQYIDwMbWjbEDQ0YUKUQNrdQ/qZH8pEhR3Pd+tmMnRkRwySOn6v8BfDxABkyBHrAJ1TbA3OZ0k98bYAGIw1rYnFQAc6AERF73wAZYAiOgC7RszQxgB9S2LgHmwDEFwMACeMk/eQA2wNTOewE4ACd7XwEjoJMCoAQe8lueBxqgZ3PqwF4eKIEHMEgB0AA3+d9+DZzlvgkPcJL7BzgDoxQAB7lf+znQAKPYAKF9YGjv28DV5oQGiH4K/v8LYgOYN6JN6NhX0Af4AIUzSBGAH0UdAAAAAElFTkSuQmCC";

// Mock data for positions
const mockPositions = [
  {
    id: 1,
    countryId: "ID",
    country: "Indonesia",
    side: "LONG",
    size: "1000000000",
    entryPrice: "85.50",
    currentPrice: "87.20",
    pnl: 1.99,
    pnlUsd: "+1,700.00",
    status: "OPEN",
    createdAt: "2025-01-15T10:30:00Z",
    leverage: "5x",
    liquidationPrice: "80.25",
    margin: "17,000.00",
  },
  {
    id: 2,
    countryId: "IN",
    country: "India",
    side: "SHORT",
    size: "500000000",
    entryPrice: "92.80",
    currentPrice: "91.15",
    pnl: 1.78,
    pnlUsd: "+825.00",
    status: "OPEN",
    createdAt: "2025-01-14T15:45:00Z",
    leverage: "3x",
    liquidationPrice: "98.50",
    margin: "15,460.00",
  },
  {
    id: 3,
    countryId: "SG",
    country: "Singapore",
    side: "LONG",
    size: "750000000",
    entryPrice: "78.90",
    currentPrice: "77.60",
    pnl: -1.65,
    pnlUsd: "-975.00",
    status: "OPEN",
    createdAt: "2025-01-13T09:20:00Z",
    leverage: "4x",
    liquidationPrice: "73.25",
    margin: "14,775.00",
  },
  {
    id: 4,
    countryId: "MY",
    country: "Malaysia",
    side: "LONG",
    size: "300000000",
    entryPrice: "89.30",
    currentPrice: "91.85",
    pnl: 2.85,
    pnlUsd: "+765.00",
    status: "OPEN",
    createdAt: "2025-01-12T14:15:00Z",
    leverage: "2x",
    liquidationPrice: "84.65",
    margin: "13,395.00",
  },
];

const PositionCard = ({
  position,
  onClose,
}: {
  position: any;
  onClose: () => void;
}) => {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeAmount, setCloseAmount] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClosePosition = async () => {
    setIsClosing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsClosing(false);
    setShowCloseModal(false);
    onClose();
  };

  return (
    <>
      <motion.div
        className="bg-[#1d1f22] rounded-[20px] p-6 border border-[#2a2d33] hover:border-[#3a3d43] transition-all duration-200"
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] relative rounded-full overflow-hidden bg-[#2d2d2e] flex items-center justify-center">
              <Image
                src={`https://flagcdn.com/w160/${position.countryId.toLowerCase()}.png`}
                alt={`${position.country} flag`}
                width={38}
                height={38}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_FLAG;
                }}
              />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">
                {position.country}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    position.side === "LONG"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {position.side}
                </span>
                <span className="text-xs text-[#888] bg-[#262a33] px-2 py-1 rounded-full">
                  {position.leverage}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#888]">Opened</div>
            <div className="text-sm text-white font-medium">
              {formatTime(position.createdAt)}
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Size</span>
              <span className="text-sm text-white font-medium">
                ${formatUnits(position.size, 6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Entry Price</span>
              <span className="text-sm text-white font-medium">
                ${position.entryPrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Current Price</span>
              <span className="text-sm text-white font-medium">
                ${position.currentPrice}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Margin</span>
              <span className="text-sm text-white font-medium">
                ${position.margin}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Liq. Price</span>
              <span className="text-sm text-red-400 font-medium">
                ${position.liquidationPrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#888]">Status</span>
              <span className="text-sm text-green-400 font-medium">
                {position.status}
              </span>
            </div>
          </div>
        </div>

        {/* PnL Section */}
        <div className="bg-[#111214] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-[#888] mb-1">Unrealized PnL</div>
              <div
                className={`text-2xl font-bold ${
                  position.pnl > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {position.pnlUsd}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#888] mb-1">PnL %</div>
              <div
                className={`text-xl font-bold ${
                  position.pnl > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {position.pnl > 0 ? "+" : ""}
                {position.pnl.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/country/${position.countryId}`)}
          >
            Add Position
          </motion.button>
          <motion.button
            onClick={() => setShowCloseModal(true)}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close Position
          </motion.button>
        </div>
      </motion.div>

      {/* Close Position Modal */}
      <AnimatePresence>
        {showCloseModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCloseModal(false)}
          >
            <motion.div
              className="bg-[#1d1f22] rounded-[20px] p-6 border border-[#2a2d33] max-w-md w-full"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-bold mb-4">
                Close Position
              </h3>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-[30px] h-[30px] relative rounded-full overflow-hidden bg-[#2d2d2e] flex items-center justify-center">
                    <Image
                      src={`https://flagcdn.com/w160/${position.countryId.toLowerCase()}.png`}
                      alt={`${position.country} flag`}
                      width={30}
                      height={30}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_FLAG;
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {position.country}
                    </div>
                    <div className="text-sm text-[#888]">
                      {position.side} • {position.leverage}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#888] block mb-2">
                  Close Amount (%)
                </label>
                <input
                  type="number"
                  value={closeAmount}
                  onChange={(e) => setCloseAmount(e.target.value)}
                  placeholder="100"
                  max="100"
                  min="1"
                  className="w-full bg-[#111214] border border-[#2a2d33] rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
                {/* Closing percentage button */}
                <div className="flex gap-3 mt-3">
                  <motion.button
                    className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCloseAmount("25")}
                  >
                    25%
                  </motion.button>
                  <motion.button
                    className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCloseAmount("50")}
                  >
                    50%
                  </motion.button>
                  <motion.button
                    className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCloseAmount("100")}
                  >
                    100%
                  </motion.button>
                </div>
              </div>

              <div className="mb-6 p-3 bg-[#111214] rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#888]">Estimated PnL:</span>
                  <span
                    className={
                      position.pnl > 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {position.pnlUsd}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Closing at:</span>
                  <span className="text-white">${position.currentPrice}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleClosePosition}
                  disabled={isClosing || !closeAmount}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 rounded-xl text-white font-medium transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isClosing ? "Closing..." : "Close Position"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function PositionTab() {
  const [positions, setPositions] = useState(mockPositions);
  const [filter, setFilter] = useState("all");
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { openPosition, setOpenPosition } = useOpenPosition();

  // Mock SWR hook - replace with your actual implementation
  // const { data, error, isLoading } = useSWR(
  //   isConnected && address ? `/api/positions/${address}` : null,
  //   fetcher
  // );

  useEffect(() => {
    console.log("Open position:", openPosition);
    if (openPosition) {
      setPositions(openPosition);
    }
  }, [openPosition]);

  const filteredPositions = positions.filter((position) => {
    if (filter === "all") return true;
    if (filter === "long") return position.side === "LONG";
    if (filter === "short") return position.side === "SHORT";
    if (filter === "profitable") return position.pnl > 0;
    if (filter === "losing") return position.pnl < 0;
    return true;
  });

  const totalPnl = positions.reduce(
    (sum, pos) => sum + parseFloat(pos.pnlUsd.replace(/[+,$]/g, "")),
    0
  );
  const totalMargin = positions.reduce(
    (sum, pos) => sum + parseFloat(pos.margin.replace(/[,$]/g, "")),
    0
  );

  const handleClosePosition = (positionId: number) => {
    setPositions((prev) => prev.filter((pos) => pos.id !== positionId));
  };

  if (!isConnected) {
    return (
      <div className="w-full bg-[#1d1f22] rounded-[40px] p-8 text-center">
        <div className="text-[#888] mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[#444]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg">
            Please connect your wallet to view your positions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-[#1d1f22] rounded-[20px] p-6 border border-[#2a2d33]">
        <h2 className="text-white text-xl font-bold mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {positions.length}
            </div>
            <div className="text-sm text-[#888]">Open Positions</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                totalPnl >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ${totalPnl.toFixed(2)}
            </div>
            <div className="text-sm text-[#888]">Total PnL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              ${totalMargin.toLocaleString()}
            </div>
            <div className="text-sm text-[#888]">Total Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalMargin > 0
                ? ((totalPnl / totalMargin) * 100).toFixed(2)
                : "0.00"}
              %
            </div>
            <div className="text-sm text-[#888]">ROI</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-3 flex-wrap">
        {[
          { key: "all", label: "All Positions" },
          { key: "long", label: "Long" },
          { key: "short", label: "Short" },
          { key: "profitable", label: "Profitable" },
          { key: "losing", label: "Losing" },
        ].map(({ key, label }) => (
          <motion.button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl border transition-colors ${
              filter === key
                ? "bg-[#155dee] border-[#155dee] text-white"
                : "bg-[#1d1f22] border-[#2a2d33] text-[#888] hover:border-[#3a3d43] hover:text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Positions Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-[#888] text-lg">Loading positions...</div>
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#888] text-lg mb-4">
            {filter === "all"
              ? "No open positions yet."
              : `No ${filter} positions found.`}
          </div>
          <p className="text-[#555] text-sm">
            {filter === "all"
              ? "Start trading to see your positions here."
              : "Adjust your filter to see more positions."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((position, index) => (
            <PositionCard
              key={index}
              position={position}
              onClose={() => handleClosePosition(position.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
