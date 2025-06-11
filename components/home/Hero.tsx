"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <main className="relative pt-8 sm:pt-16 md:pt-28 pb-8 sm:pb-12 md:pb-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#111213] -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05071A] via-[#0A1428] to-[#1A1510] opacity-80"></div>
        <div className="absolute inset-x-0 bottom-0 h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-t from-amber-900/20 via-amber-800/10 to-transparent"></div>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mt-8 sm:mt-16 md:mt-[120px] mb-8 md:mb-16">
          <h1 className="font-bold mb-6 md:mb-8 leading-tight tracking-tight">
            <div className="text-center mb-6 md:mb-10 bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-[#f1f1ef] text-2xl sm:text-3xl md:text-5xl lg:text-[68px] font-medium font-['Inter'] leading-tight md:leading-[75.14px] px-4">
              First Perpetual Prediction Market Don&apos;t Bet But Trade Your
              Country
            </div>
          </h1>
          <p className="text-center text-[#8b8b8b] text-sm sm:text-base lg:text-lg font-normal font-['Inter'] leading-6 md:leading-7 max-w-3xl mx-auto px-4">
            Unlock the power of perpetual contracts based on a country&apos;s
            progress, with predictions driven by key indicators such as GDP,
            inflation, currency rates and more. Trade long or short, with no
            time limits on your positions.
          </p>

          <div className="flex justify-center mt-8 md:mt-10 lg:mt-[80px] px-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-white text-base sm:text-sm md:text-md lg:text-lg font-medium font-['Inter'] leading-loose px-4 sm:px-6 lg:px-[26px] py-3 md:py-4 lg:py-[16.25px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[100px] shadow-[-12px_-12px_24px_0px_rgba(21,94,239,0.24)] shadow-[12px_12px_24px_0px_rgba(255,175,41,0.24)] outline outline-[3px] outline-[#155dee] inline-flex justify-center items-center gap-[13px] overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto cursor-pointer hover:bg-gradient-to-br hover:from-[#3074fc] hover:to-[#1243d6] transition-colors duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98] transition-transform transform"
            >
              Start Trading Now
            </button>
          </div>
        </div>

        <div className="relative mx-auto max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mt-8 md:mt-10 lg:mt-20 px-4">
          <div className="absolute -inset-6 -rotate-180 bg-gradient-to-b from-[#ffaf29] to-[#155dee] outline outline-1 outline-offset-[-0.50px] outline-black blur-[200px]"></div>
          <div className="w-full aspect-[16.5/14.2] bg-gradient-to-b from-[#0A1428] via-[#1A2036] to-[#1A1510] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(30,64,175,0.3)] border border-blue-900/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/BeTheNation3.png"
                alt="Trading dashboard preview"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
