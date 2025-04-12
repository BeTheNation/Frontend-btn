"use client";

import { useState, useEffect } from "react";
import type { Country } from "./useCountries";

export function useCountryData(id: string) {
  const [country, setCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      try {
        // Mock data
        const mockCountry: Country = {
          id,
          name:
            id === "1"
              ? "United States"
              : id === "2"
              ? "China"
              : id === "3"
              ? "Japan"
              : "Germany",
          flagUrl: `https://flagcdn.com/w40/${
            id === "1" ? "us" : id === "2" ? "cn" : id === "3" ? "jp" : "de"
          }.png`,
          sentimentScore:
            id === "1" ? 75 : id === "2" ? 62 : id === "3" ? 82 : 68,
          markPrice:
            id === "1" ? 7500 : id === "2" ? 6200 : id === "3" ? 8200 : 6800,
          trend: Math.random() > 0.5 ? "up" : "down",
          changePercent: parseFloat((Math.random() * 4 - 2).toFixed(1)),
          volume24h: parseFloat((Math.random() * 200 + 50).toFixed(1)),
          fundingRate: parseFloat((Math.random() * 0.2 - 0.1).toFixed(3)),
          description:
            `This is a sentiment analysis for ${
              id === "1"
                ? "United States"
                : id === "2"
                ? "China"
                : id === "3"
                ? "Japan"
                : "Germany"
            }. ` +
            "It includes information about the country's overall sentiment, news impact, social media sentiment, and analyst consensus.",
          newsImpact: {
            positive: Math.floor(Math.random() * 30 + 40),
            negative: Math.floor(Math.random() * 20 + 10),
            neutral: Math.floor(Math.random() * 20 + 10),
          },
          socialMediaSentiment: Math.floor(Math.random() * 30 + 50),
          analystConsensus:
            Math.random() > 0.6
              ? "bullish"
              : Math.random() > 0.3
              ? "neutral"
              : "bearish",
          historicalSentiment: [
            { date: "2024-01-01", score: Math.floor(Math.random() * 20 + 60) },
            { date: "2024-01-02", score: Math.floor(Math.random() * 20 + 60) },
            { date: "2024-01-03", score: Math.floor(Math.random() * 20 + 60) },
            { date: "2024-01-04", score: Math.floor(Math.random() * 20 + 60) },
            { date: "2024-01-05", score: Math.floor(Math.random() * 20 + 60) },
          ],
        };

        setCountry(mockCountry);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      }
    }, 500);
  }, [id]);

  return { country, isLoading, error };
}
