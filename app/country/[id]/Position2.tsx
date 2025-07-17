"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatUnits } from "viem";

const TradingPositionsDashboard = ({ myPositions, closePosition }: any) => {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [closeAmount, setCloseAmount] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    console.log("myPositions:", myPositions);
  }, []);

  const handleClosePosition = (position: any) => {
    setSelectedPosition(position);
    setCloseAmount("");
    setShowCloseModal(true);
  };

  const getOpenPositionTime = (time: string) => {
    const timestamp = Number(time) * 1000;
    const options = {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    } as const;
    const formatted2 = new Date(timestamp).toLocaleString("en-US", options);
    return formatted2;
  };

  const handleConfirmClose = async () => {
    setIsClosing(true);
    const amountToClose =
      Number(selectedPosition.size) * (Number(closeAmount) / 100);
    try {
      await closePosition(
        selectedPosition.positionId,
        amountToClose,
        closeAmount
      );
      // console.log(`Closing ${closeAmount}% of position 0x${paddedPositionId}`);
      setIsClosing(false);
      setShowCloseModal(false);
      setSelectedPosition(null);
      setCloseAmount("");
    } catch (error) {
      setIsClosing(false);
      console.error("Error closing position:", error);
    }
  };

  const handleCloseModal = () => {
    setShowCloseModal(false);
    setSelectedPosition(null);
    setCloseAmount("");
  };

  return (
    <div className="min-h-screen bg-[#111315]">
      <div className="w-full md:max-w-md mx-auto space-y-4 py-4">
        <div className="bg-[#1d1f22] bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-[#323232] outline-opacity-50 transition-all duration-500 hover:shadow-3xl hover:outline-[#404040] hover:outline-opacity-70 -mt-4">
          <div
            className="p-4 sm:p-6 cursor-pointer transition-all duration-300 rounded-t-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#99a3b2] transition-all duration-300" />
                <h2 className="text-white text-lg font-medium font-['Inter'] leading-7 transition-all duration-300">
                  Active Positions
                </h2>
              </div>
              <div
                className={`transition-all duration-500 ease-out transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                } hover:scale-110 active:scale-95`}
              >
                <ChevronDown className="w-5 h-5 text-[#99a3b2] transition-all duration-300" />
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-700 ease-out ${
              isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#323232] border-opacity-50">
              <div className="pt-4">
                <div className="space-y-4">
                  {myPositions.length > 0 ? (
                    myPositions.map((position: any, index: number) => (
                      <div
                        key={index}
                        className="bg-[#2a2d31] bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-[#323232] border-opacity-50 hover:border-[#404040] hover:border-opacity-70 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] hover:bg-[#2f3236] hover:bg-opacity-80"
                        style={{
                          boxShadow:
                            "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {position.direction === 0 ? (
                                <TrendingUp className="w-4 h-4 text-[#16b264] drop-shadow-sm" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-[#ef4444] drop-shadow-sm" />
                              )}
                              <span className="text-white font-medium text-sm transition-all duration-300">
                                {position.countryId.toUpperCase()}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                                position.direction === 0
                                  ? "bg-[#16b264] bg-opacity-20 border border-[#16b264] border-opacity-30"
                                  : "bg-[#ef4444] bg-opacity-20 border border-[#ef4444] border-opacity-30"
                              }`}
                            >
                              {position.direction === 0 ? "LONG" : "SHORT"}
                            </span>
                            <span className="px-2 py-1 bg-[#323232] bg-opacity-50 backdrop-blur-sm text-[#697485] text-xs rounded-full border border-[#323232] border-opacity-30 transition-all duration-300">
                              {position.leverage}X
                            </span>
                          </div>
                          <button
                            onClick={() => handleClosePosition(position)}
                            className="px-3 py-1 bg-[#ef4444] bg-opacity-20 backdrop-blur-sm text-white cursor-pointer text-xs font-medium rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-[#ef4444] border-opacity-30"
                          >
                            Close Position
                          </button>
                        </div>

                        {/* PnL Display */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex justify-between items-center gap-2">
                            <div
                              className={`text-lg font-semibold transition-all duration-300 ${
                                position.pnl >= 0
                                  ? "text-[#16b264]"
                                  : "text-[#ef4444]"
                              }`}
                            >
                              {/* {position.pnl >= 0 ? "+" : ""}${position.pnl} */}
                              $1000
                            </div>
                            <div
                              className={`text-sm transition-all duration-300 ${
                                position.pnlPercentage >= 0
                                  ? "text-[#16b264]"
                                  : "text-[#ef4444]"
                              }`}
                            >
                              {/* {position.pnlPercentage >= 0 ? "+" : ""}
                              {position.pnlPercentage}% */}
                              (+300%)
                            </div>
                          </div>
                        </div>

                        {/* Position Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Size:
                              </span>
                              <span className="text-white transition-all duration-300">
                                {formatUnits(position.size, 18)} ETH
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Entry:
                              </span>
                              <span className="text-white transition-all duration-300">
                                ${position.entryPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Margin:
                              </span>
                              <span className="text-white transition-all duration-300">
                                $0
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Current:
                              </span>
                              <span className="text-white transition-all duration-300">
                                {/* ${position.currentPrice} */} $123
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Open:
                              </span>
                              <span className="text-white transition-all duration-300">
                                {getOpenPositionTime(position.openTime)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485] transition-all duration-300">
                                Market Value:
                              </span>
                              <span className="text-white transition-all duration-300">
                                $129
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 bg-[#323232] bg-opacity-50 backdrop-blur-sm rounded-full mb-4 opacity-50 transition-all duration-300">
                        <Activity className="w-12 h-12 text-[#697485]" />
                      </div>
                      <p className="text-[#697485] font-medium text-lg mb-2 transition-all duration-300">
                        No Active Positions
                      </p>
                      <p className="text-[#697485] text-sm transition-all duration-300">
                        Start trading to see your positions here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Position Modal - Imported from PositionTab */}
        <AnimatePresence>
          {showCloseModal && selectedPosition && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
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
                    <div className="flex items-center gap-2">
                      {selectedPosition.direction === 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {selectedPosition.countryId.toUpperCase()}
                      </div>
                      <div className="text-sm text-[#888]">
                        {selectedPosition.direction === 0 ? "LONG" : "SHORT"} •{" "}
                        {selectedPosition.leverage}X
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
                  {/* Closing percentage buttons */}
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
                        selectedPosition.pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedPosition.pnl >= 0 ? "+" : ""}$
                      {selectedPosition.pnl}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Closing at:</span>
                    <span className="text-white">
                      ${selectedPosition.currentPrice}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-[#262a33] hover:bg-[#3a3d43] rounded-xl border border-[#2a2d33] text-white font-medium transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmClose}
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
      </div>
    </div>
  );
};

export default TradingPositionsDashboard;
