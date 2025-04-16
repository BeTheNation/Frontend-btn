import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - Removed secondary header with logo and Connect Wallet button */}
      <section className="relative pt-28 pb-24 px-4">
        {/* Enhanced background gradient with blue to gold/amber transition */}
        <div className="absolute inset-0 bg-black -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05071A] via-[#0A1428] to-[#1A1510] opacity-80"></div>
          <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-amber-900/20 via-amber-800/10 to-transparent"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-bold mb-8 leading-tight tracking-tight">
              <div className="text-4xl md:text-5xl text-white mb-2">
                Trade The Future of Nations with
              </div>
              <div className="text-3xl md:text-4xl text-gray-400 mb-2">
                Eternal Predictions Active
              </div>
              <div className="text-3xl md:text-4xl text-gray-400">
                CountryScore
              </div>
            </h1>
            <p className="text-base text-gray-400/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlock the power of perpetual contracts based on a country's
              progress, with predictions driven by key indicators such as GDP,
              inflation, currency rates and more. Trade long or short, with no
              time limits on your positions.
            </p>

            <div className="flex justify-center mt-12">
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium py-3 px-8 rounded-3xl border-2 border-amber-500/40 transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-800/30 hover:scale-105">
                  Start Trading Now
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced dashboard preview with improved effects */}
          <div className="relative mx-auto max-w-4xl mt-20">
            {/* Enhanced platform glow effect */}
            <div className="absolute -inset-6 bg-gradient-to-b from-blue-800/10 via-blue-600/10 to-amber-500/10 rounded-[30px] blur-2xl -z-10"></div>

            {/* Platform container with improved shadows and borders */}
            <div className="w-full aspect-[16/9] bg-gradient-to-b from-[#0A1428] via-[#1A2036] to-[#1A1510] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(30,64,175,0.3)] border border-blue-900/40">
              {/* Platform image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/BeTheNation.Fun.png"
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
      <section className="py-20 px-4 relative bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left side heading with updated typography */}
            <div className="md:w-1/3 mb-12 md:mb-0 flex flex-col">
              <h2 className="font-bold leading-tight">
                <div className="text-3xl md:text-5xl text-white">Why We're</div>
                <div className="text-3xl md:text-5xl text-white mb-2">
                  Different: A
                </div>
                <div className="text-3xl md:text-5xl text-gray-500">
                  New Era of
                </div>
                <div className="text-3xl md:text-5xl text-gray-500">
                  Trading
                </div>
              </h2>
            </div>

            {/* Right side feature card grid */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Hold positions */}
                <div className="bg-[#1E3A70]/30 p-6 md:p-8 rounded-xl border border-[#2B4D8F]/40 relative backdrop-blur-sm">
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className="h-10 w-10 rounded-md bg-amber-500/30 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white pr-12">
                    Hold your position indefinitely
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Say goodbye to traditional contract expiration! Our
                    perpetual contracts allow you to trade long or short without
                    worrying about expiration dates. Hold positions for as long
                    as you want, adjusting to market trends as they develop.
                  </p>
                </div>

                {/* Card 2: Empty space or future card */}
                <div className="bg-transparent rounded-xl hidden md:block"></div>

                {/* Card 3: Trade based on economic indicators */}
                <div className="bg-[#1E3A70]/30 p-6 md:p-8 rounded-xl border border-[#2B4D8F]/40 relative backdrop-blur-sm">
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className="h-10 w-10 rounded-md bg-blue-500/30 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white pr-12">
                    Trade based on key economic indicators
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Unlike traditional markets, BeTheNation.Fun allows you to
                    predict the future of a country by evaluating key economic
                    indicators such as GDP, inflation, currency exchange rates,
                    and market capitalization.
                  </p>
                </div>

                {/* Card 4: Maximize profit potential */}
                <div className="bg-[#1E3A70]/30 p-6 md:p-8 rounded-xl border border-[#2B4D8F]/40 relative backdrop-blur-sm">
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className="h-10 w-10 rounded-md bg-pink-500/30 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-pink-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white pr-12">
                    Maximize your profit potential
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    With up to 5x leverage, you can control larger positions
                    with a smaller capital investment. Whether you're trading on
                    economic growth or decline, leverage increases your chances
                    of profiting from accurate predictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Ahead of the Market Section - Improved with full-width container and centered text */}
      <section className="py-20 px-4 relative bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Stay Ahead of the Market with
            <br />
            <span className="text-gray-500">Real-Time Data</span>
          </h2>
        </div>
      </section>

      {/* Live Leaderboard Section - Complete redesign with better card layouts */}
      <section className="py-16 px-4 relative bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Leaderboard title and description */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Live
                <br />
                Leaderboard
              </h2>
              <p className="text-sm text-gray-400 mb-8 max-w-lg">
                See how top traders are performing. Check out profit/loss
                rankings and accuracy rates of traders who have successfully
                predicted country trends.
              </p>

              {/* Leaderboard card with real user avatars */}
              <div className="bg-[#14182D]/90 rounded-xl overflow-hidden border border-blue-900/20">
                <div className="p-5 border-b border-blue-900/10">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <Image
                        src="/placeholder-user.jpg"
                        width={24}
                        height={24}
                        alt="User"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      You are ranked 167th in Indonesia
                    </span>
                  </div>
                </div>

                {/* Leaderboard rankings */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-gray-300 text-xs mb-4">
                    <span className="w-20">Rank #1</span>
                    <div className="flex items-center flex-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <Image
                          src="/placeholder-user.jpg"
                          width={24}
                          height={24}
                          alt="0xMeiline"
                          className="object-cover"
                        />
                      </div>
                      <span>0xMeiline</span>
                    </div>
                    <span className="text-green-500 font-medium">$250,000</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300 text-xs mb-4">
                    <span className="w-20">Rank #2</span>
                    <div className="flex items-center flex-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <Image
                          src="/placeholder-user.jpg"
                          width={24}
                          height={24}
                          alt="0xClara"
                          className="object-cover"
                        />
                      </div>
                      <span>0xClara</span>
                    </div>
                    <span className="text-green-500 font-medium">$12,000</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300 text-xs mb-4">
                    <span className="w-20">Rank #3</span>
                    <div className="flex items-center flex-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <Image
                          src="/placeholder-user.jpg"
                          width={24}
                          height={24}
                          alt="0xEdward"
                          className="object-cover"
                        />
                      </div>
                      <span>0xEdward</span>
                    </div>
                    <span className="text-green-500 font-medium">$10,000</span>
                  </div>

                  {/* Current user rank */}
                  <div className="pt-4 border-t border-blue-900/10">
                    <div className="flex items-center justify-between text-gray-300 text-xs">
                      <span className="w-20">Rank #167</span>
                      <div className="flex items-center flex-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src="/placeholder-user.jpg"
                            width={24}
                            height={24}
                            alt="You"
                            className="object-cover"
                          />
                        </div>
                        <span>0xRafi</span>
                      </div>
                      <span className="text-green-500 font-medium">$1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Country data cards */}
            <div className="grid grid-cols-1 gap-8">
              {/* Live Countryscore Data card */}
              <div className="bg-[#14182D]/90 p-6 rounded-xl border border-blue-900/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Live Countryscore Data
                  </h3>
                  <span className="text-xs text-gray-400">Updated live</span>
                </div>

                {/* Chart section with years */}
                <div className="bg-[#0D1325] rounded-lg p-2 mb-5 h-40 relative">
                  {/* SVG line chart with gradient */}
                  <div className="absolute inset-0 flex items-center">
                    <svg
                      className="w-full h-32"
                      viewBox="0 0 400 100"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22C55E"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#22C55E"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {/* Area fill below line */}
                      <path
                        d="M0 80 C20 70, 40 90, 60 75 C80 60, 100 50, 120 55 C140 60, 160 40, 180 35 C200 30, 220 40, 240 45 C260 50, 280 65, 300 60 C320 55, 340 40, 360 25 C380 10, 400 5, 400 5 L400 100 L0 100 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line */}
                      <path
                        d="M0 80 C20 70, 40 90, 60 75 C80 60, 100 50, 120 55 C140 60, 160 40, 180 35 C200 30, 220 40, 240 45 C260 50, 280 65, 300 60 C320 55, 340 40, 360 25 C380 10, 400 5, 400 5"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Year markers */}
                  <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4 text-[10px] text-gray-500">
                    <span>2019</span>
                    <span>2020</span>
                    <span>2021</span>
                    <span>2022</span>
                    <span>2023</span>
                    <span>2024</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Track real-time GDP, inflation, and other key indicators for
                  each country. See live updates for global economic performance
                  and make smarter predictions.
                </p>
              </div>

              {/* Market Trends card */}
              <div className="bg-[#14182D]/90 p-6 rounded-xl border border-blue-900/20">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-semibold text-white">
                    Market Trends
                  </h3>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    +2.5%
                  </span>
                </div>

                {/* Country info with flag */}
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full mr-3 bg-blue-500/20 flex items-center justify-center overflow-hidden">
                    <div className="text-sm font-bold">🇺🇸</div>
                  </div>
                  <span className="text-white font-medium">USA</span>
                </div>

                {/* Market metrics in a grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Countryscore:</p>
                    <p className="text-sm font-medium text-white">1,839</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">24H Volume:</p>
                    <p className="text-sm font-medium text-white">$1,200,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Index Price:</p>
                    <p className="text-sm font-medium text-white">$1,000,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Market Sentiment:
                    </p>
                    <p className="text-sm font-medium text-white">Bullish</p>
                  </div>
                </div>

                {/* Trade button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                  Trade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Updated to match reference exactly */}
      <section className="py-20 px-4 relative bg-black">
        <div className="max-w-3xl mx-auto text-center">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-amber-900/10 blur-3xl rounded-full opacity-30"></div>

          {/* Content with border and subtle glass effect */}
          <div className="relative bg-[#0A0E1A]/70 backdrop-blur-sm rounded-2xl border border-blue-900/20 p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Join The Economic Revolution
            </h2>
            <p className="text-2xl text-gray-400 mb-6">Today.</p>

            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-base">
              Unlock the power of perpetual contracts based on a country's
              progress, with predictions driven by key indicators such as GDP,
              inflation, currency exchange, and more. Trade long or short, with
              no expiration on your positions.
            </p>

            {/* CTA button with golden glow effect */}
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-3 px-8 rounded-full border border-amber-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                Sign Up Now and Start Trading!
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Updated Footer matching reference design */}
      <footer className="bg-black py-16 px-4">
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
                  LinkedIn
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
