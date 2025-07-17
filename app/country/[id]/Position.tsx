"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  X,
  Activity,
} from "lucide-react";
import { formatUnits } from "viem";

const TradingPositionsDashboard = ({ myPositions, closePosition }: any) => {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [closePercentage, setClosePercentage] = useState(100);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.log("myPositions:", myPositions);
  }, []);

  const handleClosePosition = (position: any) => {
    setSelectedPosition(position);
    setShowCloseModal(true);
  };

  const handleConfirmClose = async () => {
    await closePosition(selectedPosition.positionId);
    console.log(
      `Closing ${closePercentage}% of position ${selectedPosition.id}`
    );
    setShowCloseModal(false);
    setSelectedPosition(null);
    setClosePercentage(100);
  };

  const ClosePositionModal = () => {
    if (!showCloseModal || !selectedPosition) return null;

    // const partialPnl = (selectedPosition.pnl * closePercentage) / 100;
    // const partialSize = (selectedPosition.size * closePercentage) / 100;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1d1f22] rounded-xl p-6 max-w-md w-full border border-[#323232]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg font-semibold">Close Position</h3>
            <button
              onClick={() => setShowCloseModal(false)}
              className="text-[#697485] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Position Summary */}
            <div className="bg-[#2a2d31] rounded-lg p-4 border border-[#323232]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-medium">
                    {selectedPosition.symbol}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium text-white ${
                        selectedPosition.type === "LONG"
                          ? "bg-[#16b264] bg-opacity-20 "
                          : "bg-[#ef4444] bg-opacity-20 "
                      }`}
                    >
                      {selectedPosition.type}
                    </span>
                    <span className="text-[#697485] text-xs">
                      {selectedPosition.leverage}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      selectedPosition.pnl >= 0
                        ? "text-[#16b264]"
                        : "text-[#ef4444]"
                    }`}
                  >
                    {selectedPosition.pnl >= 0 ? "+" : ""}$
                    {selectedPosition.pnl}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedPosition.pnlPercentage >= 0
                        ? "text-[#16b264]"
                        : "text-[#ef4444]"
                    }`}
                  >
                    {selectedPosition.pnlPercentage >= 0 ? "+" : ""}
                    {selectedPosition.pnlPercentage}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#697485]">Size: </span>
                  <span className="text-white">
                    {selectedPosition.size
                      ? formatUnits(BigInt(selectedPosition.size), 18)
                      : "0"}
                  </span>
                </div>
                <div>
                  <span className="text-[#697485]">Entry: </span>
                  <span className="text-white">
                    ${selectedPosition.entryPrice}
                  </span>
                </div>
                <div>
                  <span className="text-[#697485]">Current: </span>
                  <span className="text-white">
                    ${selectedPosition.currentPrice}
                  </span>
                </div>
                <div>
                  <span className="text-[#697485]">Margin: </span>
                  <span className="text-white">${selectedPosition.margin}</span>
                </div>
              </div>
            </div>

            {/* Close Percentage Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">
                  Close Percentage
                </label>
                <span className="text-[#16b264] text-sm font-medium">
                  {closePercentage}%
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={closePercentage}
                  onChange={(e) => setClosePercentage(Number(e.target.value))}
                  className="w-full h-2 bg-[#323232] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #16b264 0%, #16b264 ${closePercentage}%, #323232 ${closePercentage}%, #323232 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#697485] mt-1">
                <span>1%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick Percentage Buttons */}
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setClosePercentage(percent)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    closePercentage === percent
                      ? "bg-[#16b264] text-white"
                      : "bg-[#323232] text-[#697485] hover:bg-[#3a3d42] hover:text-white"
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Close Summary */}
            <div className="bg-[#2a2d31] rounded-lg p-4 border border-[#323232]">
              <div className="text-sm text-[#697485] mb-2">Closing Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#697485]">Size to Close:</span>
                  {/* <span className="text-white">{partialSize.toFixed(4)}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-[#697485]">Estimated PnL:</span>
                  <span
                    className={`font-medium `}
                    // ${
                    //   partialPnl >= 0 ? "text-[#16b264]" : "text-[#ef4444]"
                    // }
                  >
                    {/* {partialPnl >= 0 ? "+" : ""}${partialPnl.toFixed(2)} */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#697485]">Remaining Size:</span>
                  <span className="text-white">
                    {/* {(selectedPosition.size - partialSize).toFixed(4)} */}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-3 px-4 bg-[#323232] text-white rounded-lg font-medium hover:bg-[#3a3d42] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 py-3 px-4 bg-[#ef4444] text-white rounded-lg font-medium hover:bg-[#dc2626] transition-colors"
              >
                Close Position
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111315]">
      <div className="w-full md:max-w-md mx-auto space-y-4 py-4">
        <div className="bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] transition-all duration-200 hover:shadow-lg -mt-4">
          <div
            className="p-4 sm:p-6 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#99a3b2]" />
                <h2 className="text-white text-lg font-medium font-['Inter'] leading-7">
                  Active Positions
                </h2>
              </div>
              <div
                className={`transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown className="w-5 h-5 text-[#99a3b2]" />
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#323232]">
              <div className="pt-4">
                <div className="space-y-4">
                  {myPositions.length > 0 ? (
                    myPositions.map((position: any, index: number) => (
                      <div
                        key={index}
                        className="bg-[#2a2d31] rounded-lg p-4 border border-[#323232] hover:border-[#404040] transition-all duration-200"
                      >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {position.type === "LONG" ? (
                                <TrendingUp className="w-4 h-4 text-[#16b264]" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-[#ef4444]" />
                              )}
                              <span className="text-white font-medium text-sm">
                                {position.countryId.toUpperCase()}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                position.direction === 0
                                  ? "bg-[#16b264] bg-opacity-20"
                                  : "bg-[#ef4444] bg-opacity-20"
                              }`}
                            >
                              {position.direction === 0 ? "LONG" : "SHORT"}
                            </span>
                            <span className="px-2 py-1 bg-[#323232] text-[#697485] text-xs rounded">
                              {position.leverage}X
                            </span>
                          </div>
                          <button
                            onClick={() => handleClosePosition(position)}
                            className="px-3 py-1 bg-[#ef4444] bg-opacity-20 text-white text-xs font-medium rounded hover:bg-opacity-30 transition-colors"
                          >
                            Close
                          </button>
                        </div>

                        {/* PnL Display */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex justify-between items-center gap-2">
                            <div
                              className={`text-lg font-semibold ${
                                position.pnl >= 0
                                  ? "text-[#16b264]"
                                  : "text-[#ef4444]"
                              }`}
                            >
                              {position.pnl >= 0 ? "+" : ""}${position.pnl}
                            </div>
                            <div
                              className={` ${
                                position.pnlPercentage >= 0
                                  ? "text-[#16b264]"
                                  : "text-[#ef4444]"
                              }`}
                            >
                              {position.pnlPercentage >= 0 ? "+" : ""}
                              {position.pnlPercentage}%
                            </div>
                          </div>
                        </div>

                        {/* Position Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[#697485]">Size:</span>
                              <span className="text-white">
                                {position.size}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485]">Entry:</span>
                              <span className="text-white">
                                ${position.entryPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485]">Margin:</span>
                              <span className="text-white">
                                {/* ${position.margin} */}$0
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[#697485]">Current:</span>
                              <span className="text-white">
                                ${position.currentPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485]">Open Time:</span>
                              <span className="text-white">
                                {position.openTime}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#697485]">
                                Market Value:
                              </span>
                              <span className="text-white">
                                {/* $
                                {(
                                  position.size * position.currentPrice
                                ).toFixed(2)} */}{" "}
                                $129
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Activity className="w-12 h-12 text-[#697485] mb-4 opacity-50" />
                      <p className="text-[#697485] font-medium text-lg mb-2">
                        No Active Positions
                      </p>
                      <p className="text-[#697485] text-sm">
                        Start trading to see your positions here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <ClosePositionModal />
      </div>
    </div>
  );
};

export default TradingPositionsDashboard;
