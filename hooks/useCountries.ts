"use client";

import { useState, useEffect } from "react";

export interface Country {
  id: string;
  name: string;
  flagUrl: string;
  sentimentScore: number; // 0-100
  markPrice: number;
  trend: "up" | "down";
  changePercent: number;
  volume24h: number;
  fundingRate: number;
  description?: string;
  population?: number;
  gdpPerCapita?: number;
  growthRate?: number;
  inflation?: number;
  historicalSentiment?: {
    date: string;
    score: number;
  }[];
  newsImpact?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  socialMediaSentiment?: number; // 0-100
  analystConsensus?: "bullish" | "neutral" | "bearish";
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCountries: Country[] = [
        {
          id: "1",
          name: "United States",
          flagUrl: "https://flagcdn.com/w40/us.png",
          sentimentScore: 75,
          markPrice: 7500,
          trend: "up",
          changePercent: 2.1,
          volume24h: 120.5,
          fundingRate: 0.01,
          newsImpact: {
            positive: 65,
            negative: 20,
            neutral: 15,
          },
          socialMediaSentiment: 72,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 70 },
            { date: "2024-01-02", score: 72 },
            { date: "2024-01-03", score: 75 },
          ],
        },
        {
          id: "2",
          name: "China",
          flagUrl: "https://flagcdn.com/w40/cn.png",
          sentimentScore: 62,
          markPrice: 6200,
          trend: "down",
          changePercent: -1.2,
          volume24h: 98.2,
          fundingRate: -0.005,
          newsImpact: {
            positive: 45,
            negative: 35,
            neutral: 20,
          },
          socialMediaSentiment: 58,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 65 },
            { date: "2024-01-02", score: 63 },
            { date: "2024-01-03", score: 62 },
          ],
        },
        {
          id: "3",
          name: "Japan",
          flagUrl: "https://flagcdn.com/w40/jp.png",
          sentimentScore: 82,
          markPrice: 8200,
          trend: "up",
          changePercent: 3.5,
          volume24h: 45.7,
          fundingRate: 0.008,
          newsImpact: {
            positive: 75,
            negative: 15,
            neutral: 10,
          },
          socialMediaSentiment: 80,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 78 },
            { date: "2024-01-02", score: 80 },
            { date: "2024-01-03", score: 82 },
          ],
        },
        {
          id: "4",
          name: "Germany",
          flagUrl: "https://flagcdn.com/w40/de.png",
          sentimentScore: 68,
          markPrice: 6800,
          trend: "down",
          changePercent: -0.8,
          volume24h: 32.1,
          fundingRate: -0.002,
          newsImpact: {
            positive: 55,
            negative: 25,
            neutral: 20,
          },
          socialMediaSentiment: 65,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 70 },
            { date: "2024-01-02", score: 69 },
            { date: "2024-01-03", score: 68 },
          ],
        },
        {
          id: "5",
          name: "United Kingdom",
          flagUrl: "https://flagcdn.com/w40/gb.png",
          sentimentScore: 70,
          markPrice: 7000,
          trend: "up",
          changePercent: 0.4,
          volume24h: 28.6,
          fundingRate: 0.003,
          newsImpact: {
            positive: 60,
            negative: 20,
            neutral: 20,
          },
          socialMediaSentiment: 68,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 68 },
            { date: "2024-01-02", score: 69 },
            { date: "2024-01-03", score: 70 },
          ],
        },
        {
          id: "6",
          name: "India",
          flagUrl: "https://flagcdn.com/w40/in.png",
          sentimentScore: 78,
          markPrice: 7800,
          trend: "up",
          changePercent: 1.2,
          volume24h: 42.3,
          fundingRate: 0.015,
          newsImpact: {
            positive: 70,
            negative: 15,
            neutral: 15,
          },
          socialMediaSentiment: 75,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 75 },
            { date: "2024-01-02", score: 76 },
            { date: "2024-01-03", score: 78 },
          ],
        },
      ];

      setCountries(mockCountries);
      setIsLoading(false);
    }, 500);
  }, []);

  return { countries, isLoading };
}
