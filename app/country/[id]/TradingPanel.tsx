interface TradePosition {
  size: string;
  leverage: string;
  isLong: boolean;
  entryPrice: number;
  isOpen?: boolean;
}

type TradingPanelProps = {
  setPosition: React.Dispatch<React.SetStateAction<TradePosition>>;
  position: {
    isLong: boolean;
    size: string;
    leverage: string;
    entryPrice: number;
  };
  mounted: boolean;
  address: `0x${string}` | undefined;
  walletBalance: any;
  country: {
    markPrice: string;
    liquidationPrice: string;
  };
  isProcessing: boolean;
  transactionStep: string;
  handlePlaceTrade: () => void;
};

const TradingPanel = ({
  setPosition,
  position,
  mounted,
  address,
  walletBalance,
  country,
  isProcessing,
  transactionStep,
  handlePlaceTrade,
}: TradingPanelProps) => {
  return (
    <div className="self-stretch p-4 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-4 sm:gap-6 transition-all duration-200 hover:shadow-lg">
      <div className="self-stretch px-2.5 py-2 bg-[#2d2d2e] rounded-[100px] flex">
        <div className="self-stretch h-[40px] sm:h-[45px] flex-1 flex items-center relative">
          {" "}
          {/* Made even smaller for mobile */}
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
            className={`flex-1 z-10 px-[8px] sm:px-[12px] py-[6px] sm:py-[10px] flex justify-center items-center gap-[8px] sm:gap-[12px] cursor-pointer transition-colors duration-300 ${
              position.isLong
                ? "text-white"
                : "text-white hover:bg-[#343333] rounded-[100px] transition-colors duration-300"
            }`} /* Even smaller padding for mobile */
            onClick={() => setPosition({ ...position, isLong: true })}
          >
            <div className="flex items-center gap-1 sm:gap-1.5">
              {" "}
              {/* Smaller gap for mobile */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5" /* Even smaller icon for mobile */
              >
                <path
                  fillRule="evenodd"
                  d="M12 20.25a.75.75 0 01-.75-.75V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 11-1.06 1.06l-5.47-5.47V19.5a.75.75 0 01-.75.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base sm:text-lg font-medium font-['Inter'] leading-snug">
                Long
              </span>{" "}
              {/* Smaller text for mobile */}
            </div>
          </div>
          <div
            className={`flex-1 z-10 px-[8px] sm:px-[12px] py-[6px] sm:py-[10px] flex justify-center items-center gap-[8px] sm:gap-[12px] cursor-pointer transition-colors duration-300 ${
              position.isLong
                ? "text-white hover:bg-[#343333] rounded-[100px] transition-colors duration-300"
                : "text-[#545454]"
            }`}
            onClick={() => setPosition({ ...position, isLong: false })}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {" "}
              {/* Smaller gap for mobile */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-6 sm:h-6 text-white" /* Smaller icon for mobile */
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 01.75.75v13.19l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 111.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base sm:text-xl font-['Inter'] leading-snug text-white">
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
                <div className="flex-1 justify-start min-w-0">
                  {" "}
                  {/* Add min-w-0 */}
                  <span className="text-[#666666] text-sm sm:text-base font-medium font-['Inter'] leading-snug">
                    Balance :{" "}
                  </span>
                  <span className="text-white text-sm sm:text-base font-medium font-['Inter'] leading-snug break-all">
                    {" "}
                    {/* Add break-all */}
                    {!mounted
                      ? "Loading..."
                      : address
                      ? walletBalance
                        ? `${Number(walletBalance.formatted).toFixed(4)} ${
                            walletBalance.symbol
                          }`
                        : "Loading..."
                      : "Connect Wallet"}
                  </span>
                </div>
              </div>
              <div className="flex justify-start items-center gap-[12.57px]">
                <div className="justify-start text-[#666666] text-sm sm:text-base font-medium font-['Inter'] leading-snug cursor-pointer whitespace-nowrap">
                  {" "}
                  {/* Add whitespace-nowrap */}
                  Deposit Funds
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-[50px] sm:h-[63px] px-3 sm:px-[22px] py-1.5 bg-[#2d2e2e] rounded-[100px] shadow-[inset_1px_2px_2px_0px_rgba(0,0,0,0.08)] inline-flex justify-end items-center gap-1">
            <input
              type="number"
              value={position.size}
              onChange={(e) =>
                setPosition({ ...position, size: e.target.value })
              }
              placeholder="0.00"
              className={`flex-1 bg-transparent text-left outline-none border-none ${
                position.size ? "text-white" : "text-red-500"
              } text-lg sm:text-xl font-bold font-['Inter'] leading-tight min-w-0`}
            />
            <div className="text-[#d6d6d6] text-lg sm:text-xl font-bold font-['Inter'] leading-tight whitespace-nowrap">
              USDC
            </div>
          </div>
          <div className="self-stretch py-4 sm:py-6 relative inline-flex justify-start items-center gap-3">
            <div className="flex-1 h-1 bg-[#2d2e2e] rounded-full relative">
              <div
                className="absolute h-full bg-gradient-to-r from-[#155dee] to-[#45b3ff] rounded-full transition-all duration-200"
                style={{
                  width: `${((Number(position.leverage) - 1) / 4) * 100}%`,
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
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                      value <= Number(position.leverage)
                        ? "bg-white shadow-[0_0_8px_rgba(21,93,238,0.5)]"
                        : "bg-[#404040]"
                    }`}
                  />
                </div>
              ))}
              <div
                className="absolute -top-2 sm:-top-3 -ml-2 sm:-ml-3 z-10 transition-all duration-200"
                style={{
                  left: `${((Number(position.leverage) - 1) / 4) * 100}%`,
                }}
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-[#155dee] to-[#45b3ff] shadow-[0_0_10px_rgba(21,93,238,0.5)] flex items-center justify-center">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="w-8 sm:w-12 flex justify-center items-center">
              <div className="text-center text-[#717171] text-base sm:text-xl font-medium font-['Inter'] leading-normal bg-[#2d2e2e] px-2 sm:px-3 py-1 rounded-full">
                x{position.leverage}
              </div>
            </div>
          </div>
          <div className="self-stretch inline-flex justify-center items-center">
            <div className="w-full py-4 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
              <div className="w-full sm:w-[202px] flex justify-center items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-[100px] flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#16b2644D] rounded-[100px] flex items-center justify-center">
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
                <div className="flex-1 sm:w-[181px] inline-flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-[#697485] text-xs sm:text-sm font-medium font-['Inter'] leading-tight">
                    Size - Entry Price
                  </div>
                  <div className="self-stretch justify-start text-white text-xs sm:text-sm font-medium font-['Inter'] leading-tight break-all">
                    ${position.size} ($
                    {Number(position.size) * Number(position.leverage)}{" "}
                    leveraged) at {country.markPrice}
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[132px] py-4 flex justify-start items-center gap-8">
                <div className="flex-1 flex justify-start items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-[100px] flex items-center justify-center">
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
                    <div className="self-stretch justify-start text-[#697485] text-xs sm:text-sm font-medium font-['Inter'] leading-tight">
                      Liquidated at
                    </div>
                    <div className="self-stretch justify-start text-white text-xs sm:text-sm font-medium font-['Inter'] leading-tight">
                      {country.liquidationPrice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className={`self-stretch h-[60px] px-4 py-2 ${
              position.size && !isProcessing && transactionStep === "idle"
                ? "bg-[#155dee] cursor-pointer hover:bg-[#0f4bbd] active:bg-[#155dee] transition-colors duration-300"
                : "bg-gray-600"
            } rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12)] inline-flex justify-center items-center gap-1`}
            disabled={
              !position.size || isProcessing || transactionStep !== "idle"
            }
            onClick={handlePlaceTrade}
          >
            <div className="text-center justify-center text-white text-xl font-medium font-['Inter'] leading-normal">
              {transactionStep === "approving"
                ? "Approving USDC..."
                : transactionStep === "trading"
                ? "Opening Position..."
                : transactionStep === "success"
                ? "Success!"
                : transactionStep === "error"
                ? "Failed - Try Again"
                : isProcessing
                ? "Processing..."
                : "Place Trade"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
