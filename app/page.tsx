import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        {/* Background gradient elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] bg-green-400/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Trade The Future of Nations with
              <br />
              Perpetual Prediction On CountryScore
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Predict country GDP performance and earn rewards. Trade with
              leverage in the world's first decentralized country prediction
              market.
            </p>

            <div className="flex justify-center mt-8">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg">
                  Start Trading Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/Chart Mockup */}
          <div className="relative mx-auto max-w-3xl mt-16">
            <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#0F1A2A] to-[#0A0F1A] rounded-xl border border-gray-800 overflow-hidden shadow-[0_0_80px_rgba(0,100,255,0.3)]">
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
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why We're Different: A New Era of Trading
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
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
              <h3 className="text-xl font-semibold mb-3 text-white">
                Trade based on key economic indicators
              </h3>
              <p className="text-gray-400">
                Access comprehensive economic data, including GDP growth,
                inflation rates, and more to make informed trading decisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-teal-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Hold your position indefinitely
              </h3>
              <p className="text-gray-400">
                With our perpetual contracts, you can maintain your position as
                long as you want, giving you flexibility to maximize your
                returns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Maximize your potential returns
              </h3>
              <p className="text-gray-400">
                Use leverage trading to amplify your gains when your predictions
                are right, with advanced tools to manage your risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Ahead of the Market Section */}
      <section className="py-20 px-4 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Ahead of the Market with Real-Time Data
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data Feature 1 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Live Comparative Data
              </h3>
              <p className="text-gray-400">
                Compare economic indicators across countries in real-time to
                identify the best trading opportunities.
              </p>
            </div>

            {/* Data Feature 2 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-teal-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-teal-400"
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
              <h3 className="text-xl font-semibold mb-3 text-white">
                Market Trends
              </h3>
              <p className="text-gray-400">
                Access historical performance data and predictive analytics to
                spot emerging trends before they become mainstream.
              </p>
            </div>

            {/* Data Feature 3 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Leaderboard
              </h3>
              <p className="text-gray-400">
                See how your trading strategy stacks up against other traders
                and learn from top performers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Just 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Select Your Country
              </h3>
              <p className="text-gray-400">
                Browse our extensive catalog of countries and choose the one you
                want to trade based on economic indicators.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-teal-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-teal-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Choose Your Position
              </h3>
              <p className="text-gray-400">
                Decide whether to go long or short on the country's economic
                performance based on your analysis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Set Leverage and Amount
              </h3>
              <p className="text-gray-400">
                Customize your trade by selecting your leverage multiplier and
                the amount you want to invest.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
              <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-purple-400">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Review & Execute
              </h3>
              <p className="text-gray-400">
                Confirm your trade details, including potential profit and loss
                scenarios, then execute your trade with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Traders Said Section */}
      <section className="py-20 px-4 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Traders Said
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/john.jpg"
                    alt="Trader"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">John Anderson</h4>
                  <p className="text-gray-400 text-sm">Professional Trader</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The real-time economic data has completely changed how I
                approach country-based trading. I've seen a 32% increase in my
                portfolio since I started using this platform."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-teal-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/sarah.jpg"
                    alt="Trader"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Sarah Miller</h4>
                  <p className="text-gray-400 text-sm">Investment Analyst</p>
                </div>
              </div>
              <p className="text-gray-300">
                "I love the leverage trading capabilities. Being able to
                maximize returns while having tight control over risk parameters
                has been a game-changer for my trading strategy."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/david.jpg"
                    alt="Trader"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">David Chen</h4>
                  <p className="text-gray-400 text-sm">Crypto Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The demo mode let me practice my strategies without risk. When
                I switched to real trading, I already had a proven system that
                consistently generates profits."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join The Economic Revolution Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start trading on the future of nations and be part of the next
            generation of economic prediction markets.
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 font-medium py-6 px-10 rounded-lg text-lg">
              Sign Up Now and Start Trading
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
