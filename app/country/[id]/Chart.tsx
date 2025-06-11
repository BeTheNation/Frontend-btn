const Chart = ({ countryScore }: { countryScore: number }) => {
  return (
    <div className="lg:col-span-2 w-full h-[300px] sm:h-[400px] lg:h-[520px] p-4 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-4 sm:gap-5 overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">
          Live Countryscore
        </div>
        <div className="justify-start text-[#70e000] text-xl font-medium font-['Inter'] leading-snug">
          {countryScore}
        </div>
      </div>
      <div className="self-stretch flex-1 inline-flex justify-start items-start">
        <div className="flex-1 self-stretch relative">
          {/* Chart grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-0 border-t border-[#323232] opacity-70"
              />
            ))}
          </div>

          {/* Line Chart SVG */}
          <svg
            className="absolute inset-0 w-full h-full z-10"
            preserveAspectRatio="none"
            viewBox="0 0 800 400"
          >
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#70E000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#70E000" stopOpacity="0" />
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

            {/* Data points - Responsive sizing */}
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
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#70E000"
                className="sm:r-3 lg:r-4"
              />
            ))}
          </svg>

          {/* X-axis labels - Responsive padding */}
          <div className="absolute bottom-0 left-0 w-full px-2 sm:px-4 lg:px-6 flex justify-between items-center z-20">
            {/* X-axis labels would go here if needed */}
          </div>
        </div>

        {/* Y-axis section - Fully responsive */}
        <div className="w-6 sm:w-8 lg:w-[47px] self-stretch flex flex-col justify-between items-end pl-1 sm:pl-2 lg:pl-3 relative">
          {/* Vertical line - Hidden on mobile */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-px bg-[#323232]" />

          {/* Y-axis labels - Mobile optimized */}
          <div className="flex flex-col justify-between h-full py-1 sm:py-2 gap-1 sm:gap-0">
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
            ].map((value, index) => (
              <div
                key={value}
                className="text-[#697485] text-[10px] sm:text-xs font-normal font-['Inter'] leading-tight text-right whitespace-nowrap mr-2"
                style={{
                  transform: `translateY(${
                    index === 0 ? "0" : index === 8 ? "-100%" : "-50%"
                  })`,
                }}
              >
                {/* Show abbreviated values on mobile */}
                <span className="block sm:hidden">
                  {value.length > 4 ? `${value.slice(0, 2)}k` : value}
                </span>
                <span className="hidden sm:block">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
