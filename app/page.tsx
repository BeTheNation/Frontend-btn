import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111214] text-white overflow-hidden">
      {/* Hero Section - Removed secondary header with logo and Connect Wallet button */}
      <section className="relative pt-28 pb-24 px-4">
        {/* Enhanced background gradient with blue to gold/amber transition */}
        <div className="absolute inset-0 bg-[#111213] -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05071A] via-[#0A1428] to-[#1A1510] opacity-80"></div>
          <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-amber-900/20 via-amber-800/10 to-transparent"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-12xl mx-auto">
          <div className="max-w-7xl mx-auto text-center mt-[120px] mb-16">
            <h1 className="font-bold mb-8 leading-tight tracking-tight">
              <div className="self-stretch text-center mb-[40px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[68px] font-medium font-['Inter'] leading-[75.14px]">
              Trade The Future of Nations with Perpetual Prediction On CountryScore
              </div>
            </h1>
            <p className="w-flex text-center justify-center text-[#8b8b8b] text-lg font-normal font-['Inter'] leading-7">
              Unlock the power of perpetual contracts based on a country's
              progress, with predictions driven by key indicators such as GDP,
              inflation, currency rates and more. Trade long or short, with no
              time limits on your positions.
            </p>

            <div className="flex justify-center mt-[80px]">
              <Link href="/dashboard">
                <button className="justify-center text-white text-2xl font-medium font-['Inter'] leading-loose px-[26px] py-[16.25px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[100px] shadow-[-12px_-12px_24px_0px_rgba(21,94,239,0.24)] shadow-[12px_12px_24px_0px_rgba(255,175,41,0.24)] outline outline-[3px] outline-[#155dee] inline-flex justify-center items-center gap-[13px] overflow-hidden">
                  Start Trading Now
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced dashboard preview with improved effects */}
          <div className="relative mx-auto max-w-4xl mt-20 ">
            {/* Enhanced platform glow effect */}
            <div className="absolute -inset-6 -rotate-180 bg-gradient-to-b from-[#ffaf29] to-[#155dee] outline outline-1 outline-offset-[-0.50px] outline-black blur-[200px]"></div>

            {/* Platform container with improved shadows and borders */}
            <div className="w-full aspect-[16.5/14.2] bg-gradient-to-b from-[#0A1428] via-[#1A2036] to-[#1A1510] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(30,64,175,0.3)] border border-blue-900/40">
              {/* Platform image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/BeTheNation2.png"
                  alt="Trading dashboard preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-20 mt-60 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left side heading with updated typography */}
            <div className="md:w-1/4 mb-12 md:mb-0 flex flex-col">
              <h2 className="font-bold leading-tight">
                <div className="w-[394px] justify-start bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-[#f1f1ef] text-[68px] text-transparent bg-clip-text font-medium font-['Inter'] tracking-[-3%] leading-[75.14px]">Why We're Different: A New Era of Trading</div>
              </h2>
            </div>
            {/* Right side feature card grid */}
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 2: Empty space or future card */}
                <div className="bg-transparent rounded-xl hidden md:block"></div>
                {/* Card 1: Hold positions */}
                <div className="self-stretch h-[337px] p-6 bg-[#202122]/60 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-6 overflow-hidden">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-400">
  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                      </svg>

                    </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
             <div className="flex-1 justify-start text-[#f1f1ef] text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-[#f1f1ef] text-transparent bg-clip-text font-medium font-['Inter'] leading-7">Hold your position indefinitely</div>
              </div>
               <div className="self-stretch inline-flex justify-start items-center gap-4">
            <div className="flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">Say goodbye to traditional contract expirations! Our perpetual contracts allow you to trade long or short without worrying about expiry dates. Hold positions for as long</div>
                    </div>
                  </div>
                </div>
                {/* Card 3: Trade based on economic indicators */}
                <div className="self-stretch h-[337px] p-6 bg-[#202122]/60 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-6 overflow-hidden">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-400">
  <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z" clipRule="evenodd" />
                      </svg>

                    </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
             <div className="flex-1 justify-start text-[#f1f1ef] text-2xl font-medium flex-1 justify-start text-[#f1f1ef] text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-[#f1f1ef] text-transparent bg-clip-text font-medium font-['Inter'] leading-7">Trade based on key economic indicators.</div>
              </div>
               <div className="self-stretch inline-flex justify-start items-center gap-4">
            <div className="flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">Unlike traditional markets, BeTheNation.Fun lets you predict a country's future by evaluating key economic indicators such as GDP, inflation.</div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Maximize profit potential */}
                <div className="self-stretch h-[337px] p-6 bg-[#202122]/60 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-start items-start gap-6 overflow-hidden">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 text-blue-400">
  <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clipRule="evenodd" />
                      </svg>

                    </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
             <div className="flex-1 justify-start text-[#f1f1ef] text-2xl flex-1 justify-start text-[#f1f1ef] text-2xl bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/20 text-[#f1f1ef] text-transparent bg-clip-text font-medium font-['Inter'] leading-7">Maximize your potential returns</div>
              </div>
               <div className="self-stretch inline-flex justify-start items-center gap-4">
            <div className="flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">With leverage up to 5x, you can control a larger position with a smaller capital investment. Whether you're trading on economic growth or decline.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Ahead of the Market Section - Improved with full-width container and centered text */}
      <section className="py-20 mt-40 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
        <div className="self-stretch text-center mb-[24px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[68px] font-medium font-['Inter'] leading-[75.14px]">
        Stay Ahead of the Market with Real-Time Data
          </div>
        </div>
        <div className="self-stretch px-[122px] py-12 inline-flex flex-col justify-center items-start gap-8">
    <div className="self-stretch h-[337px] p-12 bg-gradient-to-r from-black/0 to-black/20 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex justify-start items-start gap-6 overflow-hidden">
        <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-6">
            <div className="bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15  text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[64px] font-medium font-['Inter'] leading-[70px]">Live<br/>Leaderboard</div>
            <div className="w-[613px] flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">See how top traders are performing. Check out profit/loss rankings and accuracy rates of traders who have successfully predicted country trends.</div>
        </div>
        <div className="w-[538px] p-6 bg-[#1d1f22] rounded-3xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#202327] inline-flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">Leaderboard</div>
                <div className="w-6 h-6 relative overflow-hidden">
                    <div className="w-0.5 h-4 left-[11px] top-[4px] absolute outline outline-2 outline-offset-[-1px] outline-[#99a3b2]" />
                </div>
                    </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="flex-1 justify-start text-[#676767] text-lg font-medium font-['Inter'] leading-7">You are ranked 167th in Indonesia</div>
                  </div>
            <div className="self-stretch relative bg-[#202122] flex flex-col justify-start items-start">
                <div className="self-stretch h-px relative">
                    <div className="w-[490px] h-px left-0 top-0 absolute bg-[#323232]" />
                </div>
                <div className="self-stretch h-px relative" />
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                    <div className="w-[244px] flex justify-between items-center">
                        <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">Rank #1</div>
                        <div className="flex justify-start items-center gap-3">
                            <img className="w-[33px] h-8 rounded-[100px]" src="https://placehold.co/33x32" />
                            <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">0xMeiline</div>
                      </div>
                    </div>
                    <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">$250,000</div>
                  </div>
                <div className="w-[372px] h-px bg-[#323232]" />
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                    <div className="w-[231px] flex justify-between items-center">
                        <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">Rank #2</div>
                        <div className="flex justify-start items-center gap-3">
                            <img className="w-[33px] h-8 rounded-[100px]" src="https://placehold.co/33x32" />
                            <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">0xClara</div>
                      </div>
                    </div>
                    <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">$12,000</div>
                </div>
                <div className="self-stretch h-px relative">
                    <div className="w-[490px] h-px left-0 top-0 absolute bg-[#323232]" />
                  </div>
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                    <div className="w-[247px] flex justify-between items-center">
                        <div className="justify-start text-[#697485] text-sm font-normal font-['Inter'] leading-tight">Rank #3</div>
                        <div className="flex justify-start items-center gap-3">
                            <img className="w-[33px] h-8 rounded-[100px]" src="https://placehold.co/33x32" />
                            <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">0xEdward</div>
                      </div>
                    </div>
                    <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">$10,000</div>
                </div>
                <div className="self-stretch h-px relative">
                    <div className="w-[490px] h-px left-0 top-0 absolute bg-[#323232]" />
                  </div>
                <div className="self-stretch py-4 inline-flex justify-between items-center">
                    <div className="w-60 flex justify-between items-center">
                        <div className="justify-start text-white text-sm font-semibold font-['Inter'] leading-tight">Rank #167</div>
                        <div className="flex justify-start items-center gap-3">
                            <img className="w-[33px] h-8 rounded-[100px]" src="https://placehold.co/33x32" />
                            <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-tight">0xCeline</div>
                        </div>
                    </div>
                    <div className="justify-start text-[#16b264] text-sm font-normal font-['Inter'] leading-tight">$1,000</div>
                </div>
                <div className="self-stretch h-px relative" />
                <div className="self-stretch h-px relative" />
                <div className="w-[1366.50px] h-[250px] left-[-738px] top-[50px] absolute opacity-25 bg-gradient-to-b from-[#155dee] to-[#ffaf29] outline outline-[0.72px] outline-offset-[-0.36px] outline-black blur-[36.01px]" />
            </div>
                    </div>
                  </div>
    <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
        <div className="flex-1 h-[337px] p-6 relative bg-[#202122]/60 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-center items-start gap-6 overflow-hidden">
            <div className="w-[284px] flex flex-col justify-start items-start gap-6">
                <div className="w-[284px] inline-flex justify-start items-center gap-4">
                    <div className="w-[290px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[32px] font-medium font-['Inter'] leading-[38px]">Live Countryscore Data</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-4">
                    <div className="flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">Track real-time GDP, inflation, and other key indicators for each country. See live updates for global economic performance and make smarter predictions.</div>
              </div>
            </div>
            <div className="w-[456.48px] h-[262px] p-[12.09px] left-[332px] top-[42px] absolute bg-[#202327] rounded-xl shadow-[0px_0.5038461685180664px_1.0076923370361328px_0px_rgba(16,24,40,0.06)] shadow-[0px_0.5038461685180664px_1.5115383863449097px_0px_rgba(16,24,40,0.10)] outline outline-[0.50px] outline-offset-[-0.50px] outline-[#323232] flex flex-col justify-start items-start gap-[10.08px] overflow-hidden">
                <div className="self-stretch inline-flex justify-start items-center gap-[8.06px]">
                    <div className="flex-1 justify-start text-white text-[9.07px] font-medium font-['Inter'] leading-[14.11px]">Live Countryscore</div>
                    <div className="w-[12.09px] h-[12.09px] relative overflow-hidden">
                        <div className="w-px h-[8.06px] left-[5.54px] top-[2.02px] absolute outline outline-1 outline-offset-[-0.50px] outline-[#99a3b2]" />
                    </div>
                </div>
                <div className="self-stretch flex-1 relative">
                    <div className="w-[432.30px] h-[213.63px] left-0 top-0 absolute inline-flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch flex-1 flex flex-col justify-between items-center">
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                            <div className="w-[432.30px] h-0 relative">
                                <div className="w-[432px] h-0 left-0 top-0 absolute outline outline-[0.50px] outline-offset-[-0.25px] outline-[#323232]"></div>
                            </div>
                        </div>
                        <div className="self-stretch px-[12.09px] inline-flex justify-between items-center">
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">00.10</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">02.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">03.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">04.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">05.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">06.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">07.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">08.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">09.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">10.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">11.00</div>
                            <div className="justify-start text-[#697485] text-[6.05px] font-normal font-['Inter'] leading-[9.07px]">12.00</div>
                        </div>
                    </div>
                    <div className="w-[432.30px] h-[200.53px] px-[10.08px] left-0 top-0 absolute inline-flex justify-between items-end">
                        <div className="w-[16.12px] self-stretch relative">
                            <div className="w-[16.12px] h-[160.22px] left-0 top-[40.31px] absolute" />
                        </div>
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[16.12px] self-stretch relative" />
                        <div className="w-[404.08px] h-[165.26px] left-[18.14px] top-[15.26px] absolute">
                            <div className="w-[404.08px] h-[156.70px] left-0 top-[8.57px] absolute bg-gradient-to-b from-[#70e000]/80 to-[#00820f]/0" />
                            <div className="w-[403.08px] h-[155.69px] left-[1.01px] top-[8.57px] absolute outline outline-[1.51px] outline-offset-[-0.76px] outline-[#70e000]" />
                  </div>
                  </div>
                </div>
            </div>
            <div className="w-[1452px] h-[550px] left-[-688px] top-[-550px] absolute opacity-25 bg-gradient-to-b from-[#155dee] to-[#ffaf29] outline outline-[0.72px] outline-offset-[-0.36px] outline-black blur-[36.01px]" />
        </div>
        <div className="flex-1 h-[337px] p-6 relative bg-[#202122]/60 rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] outline outline-1 outline-offset-[-1px] outline-[#323232] inline-flex flex-col justify-center items-start gap-6 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="w-[221px] inline-flex justify-start items-center gap-4">
                    <div className="w-[221px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[32px] font-medium font-['Inter'] leading-[38px]">Market Trends</div>
              </div>
                <div className="w-[221px] inline-flex justify-start items-center gap-4">
                    <div className="flex-1 justify-start text-[#777777] text-base font-medium font-['Inter'] leading-7">Interactive charts showing GDP progress, currency exchange rates, and market forecasts for the countries you're interested in.</div>
                </div>
            </div>
            <div className="w-[336px] h-[274px] p-6 left-[266.50px] top-[32px] absolute bg-[#202326] rounded-3xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] flex flex-col justify-between items-start">
                <div className="self-stretch inline-flex justify-end items-center gap-2.5">
                    <div className="w-[35px] h-[35px] relative bg-white rounded-[35.35px] overflow-hidden">
                        <img className="w-[52.50px] h-[35px] left-[-8px] top-0 absolute border-black" src="https://placehold.co/52x35" />
                    </div>
                    <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter']">USA</div>
                    <div className="px-1.5 py-1 bg-[#068621] rounded-[100px] outline outline-1 outline-offset-[-1px] outline-[#54bb54] flex justify-center items-center gap-2.5">
                        <div className="justify-start text-white text-sm font-medium font-['Inter']">+2.5%</div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                        <div className="flex-1 justify-start text-white text-base font-semibold font-['Inter']">Countryscore :</div>
                        <div className="justify-start text-white text-base font-semibold font-['Inter']">1,839</div>
                  </div>
                    <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                        <div className="flex-1 justify-start text-[#555555] text-base font-normal font-['Inter']">24H Volume :</div>
                        <div className="justify-start text-white text-base font-normal font-['Inter']">$1,200,000</div>
                  </div>
                    <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                        <div className="flex-1 justify-start text-[#555555] text-base font-normal font-['Inter']">Index Price :</div>
                        <div className="justify-start text-white text-base font-normal font-['Inter']">$1,000,000</div>
                  </div>
                    <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                        <div className="flex-1 justify-start text-[#555555] text-base font-normal font-['Inter']">Market Sentiment :</div>
                        <div className="justify-start text-white text-base font-normal font-['Inter']">Bullish</div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-end gap-2.5">
                    <div className="px-[26px] py-2.5 bg-[#155dee] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] inline-flex justify-center items-center gap-2 overflow-hidden">
                        <div className="justify-center text-white text-base font-medium font-['Inter'] leading-tight">Trade Now</div>
              </div>
                </div>
            </div>
            <div className="w-[1366.50px] h-[600.50px] left-[-437.50px] top-[-600px] absolute opacity-25 bg-gradient-to-b from-[#155dee] to-[#ffaf29] outline outline-[0.72px] outline-offset-[-0.36px] outline-black blur-[36.01px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Updated to match reference exactly */}
      <section className="mt-40 py-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          {/* Background glow effect */}
          <div className="absolute top-60 w-[1078px] h-[543px] bg-[radial-gradient(ellipse_62.33%_62.33%_at_50.00%_50.00%,_rgba(21,_94,_239,_0.60)_0%,_rgba(255,_175,_41,_0.60)_100%)] rounded-full blur-[150px]"></div>

          {/* Content with border and subtle glass effect */}
          <div className="relative bg-[#111214]/40 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#323232] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <div className="self-stretch text-center mb-[40px] bg-gradient-to-b from-[#f1f1ef] to-[#f1f1ef]/15 text-transparent tracking-[-3%] bg-clip-text justify-start text-[#f1f1ef] text-[68px] font-medium font-['Inter'] leading-[75.14px]">
               Join The Economic Revolution Today.
            </div>

            <p className="text-[#8b8b8b] mb-10 max-w-[1027px] mx-auto text-base">
              Unlock the power of perpetual contracts based on a country's
              progress, with predictions driven by key indicators such as GDP,
              inflation, currency exchange, and more. Trade long or short, with
              no expiration on your positions.
            </p>

            {/* CTA button with golden glow effect */}
            <Link href="/dashboard">
              <button className="justify-center text-white text-2xl font-medium font-['Inter'] leading-loose px-[28px] py-[12px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[100px] shadow-[-12px_-12px_24px_0px_rgba(21,94,239,0.24)] shadow-[12px_12px_24px_0px_rgba(255,175,41,0.24)] outline outline-[2px] outline-[#155dee] inline-flex justify-center items-center gap-[13px] overflow-hidden">
                Sign Up Now and Start Trading!
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Updated Footer matching reference design */}
      <footer className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand section - 4 columns on desktop */}
            <div className="md:col-span-4">
              <h3 className="text-xl font-bold text-white mb-4">
                BeTheNation.Fun
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
                BeTheNation.Fun lets users trade GDP-based derivatives on the
                world's leading economies, with this proof-of-concept demo.
              </p>
            </div>

            {/* Links section - 8 columns split into 2-2-2-2 on desktop */}
            <div className="md:col-span-2">
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms Of Service
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Copyright section */}
          <div className="mt-12 pt-6 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">BeTheNation.Fun © 2025</p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}