import Image from "next/image";

const Feature = () => {
  return (
    <section className="py-10 md:py-20 mt-20 md:mt-40 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8 bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-[68px] font-medium font-['Inter'] leading-tight md:leading-[75.14px]">
          Stay Ahead of the Market with Real-Time Data
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Live Leaderboard - Full width on mobile */}
        <div className="mb-8 bg-gradient-to-r from-black/0 to-black/20 rounded-2xl shadow outline outline-1 outline-[#323232] p-4 md:p-6 gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-[#f1f1ef] text-2xl sm:text-3xl md:text-[40px] font-medium font-['Inter'] leading-tight">
                Live
                <br />
                Leaderboard
              </div>
              <div className="mt-4 text-[#777777] text-sm md:text-base font-medium font-['Inter'] leading-7">
                See how top traders are performing. Check out profit/loss
                rankings and accuracy rates of traders who have successfully
                predicted country trends.
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-[#1d1f22] rounded-2xl shadow outline outline-1 outline-[#202327] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-base md:text-lg font-medium">
                    Leaderboard
                  </span>
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
                    ></path>
                  </svg>
                </div>
                <div className="text-[#676767] text-sm mb-2">
                  You are ranked 167th in Indonesia
                </div>
                <div className="divide-y divide-[#323232]">
                  {[
                    {
                      rank: 1,
                      name: "0xMeiline",
                      amount: "$250,000",
                      img: 1,
                    },
                    { rank: 2, name: "0xClara", amount: "$12,000", img: 2 },
                    { rank: 3, name: "0xEdward", amount: "$10,000", img: 3 },
                    {
                      rank: 167,
                      name: "0xCeline",
                      amount: "$1,000",
                      img: 4,
                      isUser: true,
                    },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 text-xs sm:text-sm"
                    >
                      <span
                        className={`${
                          user.isUser
                            ? "text-white font-semibold"
                            : "text-[#697485]"
                        }`}
                      >
                        Rank #{user.rank}
                      </span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <Image
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                          src={`https://i.pravatar.cc/150?img=${user.img}`}
                          alt={`User ${user.img}`}
                          width={32}
                          height={32}
                        />
                        <span
                          className={`${
                            user.isUser
                              ? "text-white font-medium"
                              : "text-white"
                          } text-xs sm:text-sm`}
                        >
                          {user.name}
                        </span>
                      </div>
                      <span className="text-[#16b264] text-xs sm:text-sm">
                        {user.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two column cards on larger screens, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Countryscore Data */}
          <div className="flex flex-col h-full bg-[#202122]/60 rounded-2xl shadow outline outline-1 outline-[#323232] p-4 md:p-6 gap-6">
            <div>
              <div className="bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-[#f1f1ef] text-xl sm:text-2xl md:text-[32px] font-medium font-['Inter'] leading-tight">
                Live Countryscore Data
              </div>
              <div className="mt-4 text-[#777777] text-sm md:text-base font-medium font-['Inter'] leading-7">
                Track real-time GDP, inflation, and other key indicators for
                each country. See live updates for global economic performance
                and make smarter predictions.
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm bg-[#202327] rounded-xl p-4">
                <div className="text-white text-xs mb-2">Live Countryscore</div>
                <svg viewBox="0 0 300 100" className="w-full h-20 sm:h-24">
                  <polyline
                    fill="none"
                    stroke="#70E000"
                    strokeWidth="3"
                    points="0,80 40,60 80,65 120,20 160,40 200,10 240,30 280,20"
                  />
                  {[
                    [0, 80],
                    [40, 60],
                    [80, 65],
                    [120, 20],
                    [160, 40],
                    [200, 10],
                    [240, 30],
                    [280, 20],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill="#70E000" />
                  ))}
                </svg>
                <div className="flex justify-between text-[#697485] text-[7px] sm:text-[8px] mt-2">
                  {[
                    "28 Apr",
                    "29 Apr",
                    "30 Apr",
                    "1 May",
                    "2 May",
                    "3 May",
                    "4 May",
                    "5 May",
                  ].map((date) => (
                    <span key={date}>{date}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="flex flex-col h-full bg-[#202122]/60 rounded-2xl shadow outline outline-1 outline-[#323232] p-4 md:p-6 gap-6">
            <div>
              <div className="bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-[#f1f1ef] text-xl sm:text-2xl md:text-[32px] font-medium font-['Inter'] leading-tight">
                Market Trends
              </div>
              <div className="mt-4 text-[#777777] text-sm md:text-base font-medium font-['Inter'] leading-7">
                Interactive charts showing GDP progress, currency exchange
                rates, and market forecasts for the countries you&apos;re
                interested in.
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm bg-[#202326] rounded-2xl shadow outline outline-1 outline-[#202327] p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                    src="https://flagcdn.com/w80/us.png"
                    alt="USA Flag"
                    width={32}
                    height={32}
                  />
                  <span className="text-white text-base sm:text-lg font-medium">
                    USA
                  </span>
                  <span className="px-2 py-1 bg-[#068621] rounded-full text-white text-xs ml-auto">
                    +2.5%
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { label: "Countryscore:", value: "1,839" },
                    { label: "24H Volume:", value: "$1,200,000" },
                    { label: "Index Price:", value: "$1,000,000" },
                    { label: "Market Sentiment:", value: "Bullish" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-xs sm:text-sm"
                    >
                      <span className="text-[#555]">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-4 sm:px-6 py-2 bg-[#155dee] rounded-full text-white font-medium text-sm sm:text-base">
                  Trade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
