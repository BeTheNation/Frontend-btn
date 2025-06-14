const About = () => {
  return (
    <section className="py-10 md:py-20 mt-10 md:mt-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0 flex flex-col justify-center">
            <h2 className="font-bold leading-tight">
              <span className="block w-full text-center lg:text-left bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-transparent bg-clip-text text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-[68px] font-medium font-['Inter'] tracking-[-3%] leading-tight md:leading-[75.14px]">
                Why We&apos;re Different: A New Era of Trading
              </span>
            </h2>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Card 1 */}
              <div className="w-full h-full p-4 md:p-6 bg-[#202122]/60 rounded-2xl shadow outline outline-1 outline-[#323232] flex flex-col gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-blue-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-lg md:text-xl lg:text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-transparent bg-clip-text font-medium leading-7">
                    Hold your position indefinitely
                  </div>
                  <div className="text-[#777777] text-sm md:text-base font-medium leading-6 md:leading-7 mt-2">
                    Say goodbye to traditional contract expirations! Our
                    perpetual contracts allow you to trade long or short without
                    worrying about expiry dates. Hold positions for as long as
                    you want.
                  </div>
                </div>
              </div>

              <div className="w-full h-full p-4 md:p-6 bg-[#202122]/60 rounded-2xl shadow outline outline-1 outline-[#323232] flex flex-col gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-blue-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 2.25a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-lg md:text-xl lg:text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-transparent bg-clip-text font-medium leading-7">
                    Trade based on key economic indicators.
                  </div>
                  <div className="text-[#777777] text-sm md:text-base font-medium leading-6 md:leading-7 mt-2">
                    Unlike traditional markets, BeTheNation.Fun lets you predict
                    a country&apos;s future by evaluating key economic
                    indicators such as GDP, inflation.
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-full h-full p-4 md:p-6 bg-[#202122]/60 rounded-2xl shadow outline outline-1 outline-[#323232] flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-7 text-blue-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-lg md:text-xl lg:text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-transparent bg-clip-text font-medium leading-7">
                    Maximize your potential returns
                  </div>
                  <div className="text-[#777777] text-sm md:text-base font-medium leading-6 md:leading-7 mt-2">
                    With leverage up to 5x, you can control a larger position
                    with a smaller capital investment. Whether you&apos;re
                    trading on economic growth or decline.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
