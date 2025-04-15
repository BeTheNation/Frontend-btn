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
  currentGdp?: number;
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
          currentGdp: 25.46,
          population: 331.9,
          gdpPerCapita: 76742,
          growthRate: 2.5,
          inflation: 3.1,
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
          currentGdp: 17.96,
          population: 1412,
          gdpPerCapita: 12720,
          growthRate: 5.2,
          inflation: 2.0,
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
          currentGdp: 4.23,
          population: 125.7,
          gdpPerCapita: 33676,
          growthRate: 1.3,
          inflation: 2.9,
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
          currentGdp: 4.07,
          population: 83.2,
          gdpPerCapita: 48970,
          growthRate: 0.2,
          inflation: 2.3,
        },
        {
          id: "5",
          name: "Brazil",
          flagUrl: "https://flagcdn.com/w40/br.png",
          sentimentScore: 58,
          markPrice: 5800,
          trend: "up",
          changePercent: 1.8,
          volume24h: 25.6,
          fundingRate: 0.007,
          newsImpact: {
            positive: 50,
            negative: 30,
            neutral: 20,
          },
          socialMediaSentiment: 55,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 54 },
            { date: "2024-01-02", score: 56 },
            { date: "2024-01-03", score: 58 },
          ],
          currentGdp: 1.92,
          population: 214.3,
          gdpPerCapita: 8957,
          growthRate: 2.9,
          inflation: 4.5,
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
          currentGdp: 3.38,
          population: 1408,
          gdpPerCapita: 2400,
          growthRate: 6.8,
          inflation: 5.6,
        },
        {
          id: "7",
          name: "South Africa",
          flagUrl: "https://flagcdn.com/w40/za.png",
          sentimentScore: 52,
          markPrice: 5200,
          trend: "down",
          changePercent: -2.3,
          volume24h: 18.5,
          fundingRate: -0.009,
          newsImpact: {
            positive: 40,
            negative: 45,
            neutral: 15,
          },
          socialMediaSentiment: 48,
          analystConsensus: "bearish",
          historicalSentiment: [
            { date: "2024-01-01", score: 55 },
            { date: "2024-01-02", score: 53 },
            { date: "2024-01-03", score: 52 },
          ],
          currentGdp: 0.406,
          population: 60.4,
          gdpPerCapita: 6720,
          growthRate: 0.8,
          inflation: 5.4,
        },
        {
          id: "8",
          name: "Australia",
          flagUrl: "https://flagcdn.com/w40/au.png",
          sentimentScore: 72,
          markPrice: 7200,
          trend: "up",
          changePercent: 0.9,
          volume24h: 23.7,
          fundingRate: 0.004,
          newsImpact: {
            positive: 65,
            negative: 20,
            neutral: 15,
          },
          socialMediaSentiment: 70,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 70 },
            { date: "2024-01-02", score: 71 },
            { date: "2024-01-03", score: 72 },
          ],
          currentGdp: 1.69,
          population: 25.7,
          gdpPerCapita: 65790,
          growthRate: 1.9,
          inflation: 3.6,
        },
        {
          id: "9",
          name: "Mexico",
          flagUrl: "https://flagcdn.com/w40/mx.png",
          sentimentScore: 60,
          markPrice: 6000,
          trend: "down",
          changePercent: -0.5,
          volume24h: 22.1,
          fundingRate: -0.001,
          newsImpact: {
            positive: 50,
            negative: 30,
            neutral: 20,
          },
          socialMediaSentiment: 58,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 62 },
            { date: "2024-01-02", score: 61 },
            { date: "2024-01-03", score: 60 },
          ],
          currentGdp: 1.32,
          population: 129.9,
          gdpPerCapita: 10170,
          growthRate: 3.1,
          inflation: 4.8,
        },
        {
          id: "10",
          name: "France",
          flagUrl: "https://flagcdn.com/w40/fr.png",
          sentimentScore: 65,
          markPrice: 6500,
          trend: "up",
          changePercent: 0.6,
          volume24h: 28.4,
          fundingRate: 0.005,
          newsImpact: {
            positive: 60,
            negative: 25,
            neutral: 15,
          },
          socialMediaSentiment: 63,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 64 },
            { date: "2024-01-02", score: 64 },
            { date: "2024-01-03", score: 65 },
          ],
          currentGdp: 2.78,
          population: 65.5,
          gdpPerCapita: 42420,
          growthRate: 0.9,
          inflation: 2.4,
        },
        {
          id: "11",
          name: "South Korea",
          flagUrl: "https://flagcdn.com/w40/kr.png",
          sentimentScore: 80,
          markPrice: 8000,
          trend: "up",
          changePercent: 2.7,
          volume24h: 35.8,
          fundingRate: 0.012,
          newsImpact: {
            positive: 75,
            negative: 15,
            neutral: 10,
          },
          socialMediaSentiment: 78,
          analystConsensus: "bullish",
          historicalSentiment: [
            { date: "2024-01-01", score: 77 },
            { date: "2024-01-02", score: 79 },
            { date: "2024-01-03", score: 80 },
          ],
          currentGdp: 1.71,
          population: 51.7,
          gdpPerCapita: 33060,
          growthRate: 1.5,
          inflation: 2.8,
        },
        {
          id: "12",
          name: "Saudi Arabia",
          flagUrl: "https://flagcdn.com/w40/sa.png",
          sentimentScore: 67,
          markPrice: 6700,
          trend: "down",
          changePercent: -1.5,
          volume24h: 30.2,
          fundingRate: -0.003,
          newsImpact: {
            positive: 55,
            negative: 30,
            neutral: 15,
          },
          socialMediaSentiment: 65,
          analystConsensus: "neutral",
          historicalSentiment: [
            { date: "2024-01-01", score: 69 },
            { date: "2024-01-02", score: 68 },
            { date: "2024-01-03", score: 67 },
          ],
          currentGdp: 1.11,
          population: 35.3,
          gdpPerCapita: 31430,
          growthRate: 0.8,
          inflation: 3.2,
        },
      ];

      setCountries(mockCountries);
      setIsLoading(false);
    }, 500);
  }, []);

  return { countries, isLoading };
}
