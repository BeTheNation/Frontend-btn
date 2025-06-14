import Image from "next/image";

type HeaderProps = {
  flagCode: string;
  name: string;
  countryScore: string;
  openTrades: number;
  volumes: string;
  fundingPercent: string;
  fundingCooldown: string;
};

const Header = ({
  flagCode,
  name,
  countryScore,
  openTrades,
  volumes,
  fundingPercent,
  fundingCooldown,
}: HeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 px-4 sm:px-9 py-4 sm:py-[18.86px] bg-[#1d1f22] rounded-xl shadow-[0px_0.7857142686843872px_1.5714285373687744px_0px_rgba(16,24,40,0.06)] shadow-[0px_0.7857142686843872px_2.357142925262451px_0px_rgba(16,24,40,0.10)] outline outline-[0.79px] outline-offset-[-0.79px] outline-[#323232] transition-all duration-200 hover:shadow-lg">
      {/* Flag Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-[50px] h-[50px] sm:w-[62.29px] sm:h-[62.29px] relative">
          <div className="absolute inset-0 rounded-full overflow-hidden bg-[#d7d7d7]">
            <Image
              src={`https://flagcdn.com/w160/${flagCode.toLowerCase()}.png`}
              alt={`${name} flag`}
              width={80}
              height={80}
              className="w-full h-full object-cover scale-110"
              priority
            />
          </div>
        </div>

        {/* Country Info Section */}
        <div className="flex flex-col gap-[8px] sm:gap-[13px]">
          <div className="text-white text-xl sm:text-[25.14px] font-medium font-['Inter'] leading-snug">
            {name}
          </div>
          <div className="text-[#70e000] text-lg sm:text-xl font-medium font-['Inter'] leading-snug">
            {countryScore}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0">
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
              {openTrades}
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
              {volumes}
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
                {fundingPercent}{" "}
              </span>
              <span className="text-white text-sm font-medium font-['Inter'] leading-tight">
                {fundingCooldown}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
