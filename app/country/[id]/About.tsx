const About = ({ description }: { description: string }) => {
  return (
    <div className="self-stretch p-4 sm:p-6 bg-[#1d1f22] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-4 sm:gap-5 transition-all duration-200 hover:shadow-lg">
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
          {description}
        </div>
      </div>
    </div>
  );
};

export default About;
