import Link from "next/link";

const BackButton = () => {
  return (
    <Link href="/dashboard" className="block mb-4 sm:mb-8">
      <div className="inline-flex justify-start items-center gap-[12px] sm:gap-[23px]">
        <div className="w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] p-[9.67px] bg-[#1d1f22] rounded-[9.67px] flex justify-center items-center hover:bg-[#1a1a1a] transition-colors duration-200 hover:scale-[1.03] active:scale-[0.98]">
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
        <div className="text-right justify-start text-[#d6d6d6] text-base sm:text-xl font-medium font-['Inter'] leading-tight">
          Back To Dashboard
        </div>
      </div>
    </Link>
  );
};

export default BackButton;
