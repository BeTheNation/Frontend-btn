import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Country Sentiment Prediction Market
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Predict the direction of countries' sentiment and earn rewards. Trade
          with leverage and participate in the global sentiment prediction
          market.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Launch App
            </Button>
          </Link>
          <Link href="https://docs.example.com" target="_blank">
            <Button variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="card">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
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
          <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
          <p className="text-gray-400">
            Advanced analysis of news, social media, and analyst sentiment
          </p>
        </div>

        <div className="card">
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
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
          <h3 className="text-xl font-semibold mb-2">Predict Markets</h3>
          <p className="text-gray-400">
            Take positions on sentiment trends of countries worldwide
          </p>
        </div>

        <div className="card">
          <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
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
          <h3 className="text-xl font-semibold mb-2">Trade with Leverage</h3>
          <p className="text-gray-400">
            Amplify your predictions with up to 5x leverage
          </p>
        </div>
      </div>
    </div>
  );
}
