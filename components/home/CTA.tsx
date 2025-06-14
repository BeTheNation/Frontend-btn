"use client";

import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();
  return (
    <section className="mt-20 md:mt-40 py-8 md:py-16 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        {/* Background glow effect */}
        <div className="absolute top-60 w-[1078px] h-[543px] bg-[radial-gradient(ellipse_62.33%_62.33%_at_50.00%_50.00%,_rgba(21,_94,_239,_0.60)_0%,_rgba(255,_175,_41,_0.60)_100%)] rounded-full blur-[150px]"></div>

        {/* Content with border and subtle glass effect */}
        <div className="relative bg-[#111214]/40 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#323232] p-6 md:p-8 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div className="text-center mb-6 md:mb-[40px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-[68px] font-medium font-['Inter'] leading-tight md:leading-[75.14px]">
            Join The Economic Revolution Today.
          </div>

          <p className="text-[#8b8b8b] mb-6 md:mb-10 max-w-[1027px] mx-auto text-sm md:text-base">
            Unlock the power of perpetual contracts based on a country&apos;s
            progress, with predictions driven by key indicators such as GDP,
            inflation, currency exchange, and more. Trade long or short, with no
            expiration on your positions.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="justify-center text-white text-base sm:text-sm md:text-md lg:text-lg font-sm font-['Inter'] leading-loose px-4 sm:px-6 lg:px-[28px] py-3 md:py-[12px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[100px] shadow-[-12px_-12px_24px_0px_rgba(21,94,239,0.24)] shadow-[12px_12px_24px_0px_rgba(255,175,41,0.24)] outline outline-[2px] outline-[#155dee] inline-flex justify-center items-center gap-[13px] overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto cursor-pointer hover:bg-gradient-to-br hover:from-[#3074fc] hover:to-[#1243d6] transition-colors duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98] transition-transform transform"
          >
            Sign Up Now!
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
