"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { TradePositionCard } from "@/components/ui/data-display/trade-position-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
import { countryFlags } from "@/lib/country-data";
import Link from "next/link";
import { Button } from "@/components/ui/inputs/button";

// Mock data for demonstration purposes
const activePositions = [
  {
    id: "pos-123456789",
    countryName: "United States",
    countryFlag: countryFlags.US,
    positionType: "long" as const,
    leverage: 5,
    entryPrice: 0.2345,
    currentPrice: 0.2418,
    pnl: 0.0365,
    pnlPercentage: 15.57,
    timestamp: "2 hours ago",
  },
  {
    id: "pos-987654321",
    countryName: "Japan",
    countryFlag: countryFlags.JP,
    positionType: "short" as const,
    leverage: 3,
    entryPrice: 0.1892,
    currentPrice: 0.1821,
    pnl: 0.0214,
    pnlPercentage: 11.28,
    timestamp: "5 hours ago",
  },
  {
    id: "pos-456789123",
    countryName: "Germany",
    countryFlag: countryFlags.DE,
    positionType: "long" as const,
    leverage: 10,
    entryPrice: 0.1456,
    currentPrice: 0.1397,
    pnl: -0.059,
    pnlPercentage: -4.05,
    timestamp: "1 day ago",
  },
];

const historicalPositions = [
  {
    id: "pos-111222333",
    countryName: "France",
    countryFlag: countryFlags.FR,
    positionType: "long" as const,
    leverage: 2,
    entryPrice: 0.1734,
    currentPrice: 0.1799,
    pnl: 0.013,
    pnlPercentage: 7.5,
    timestamp: "Closed 2 days ago",
  },
  {
    id: "pos-444555666",
    countryName: "United Kingdom",
    countryFlag: countryFlags.GB,
    positionType: "short" as const,
    leverage: 7,
    entryPrice: 0.2112,
    currentPrice: 0.2156,
    pnl: -0.0308,
    pnlPercentage: -2.08,
    timestamp: "Closed 3 days ago",
  },
];

export default function PositionsPage() {
  const [positions, setPositions] = useState(activePositions);

  const handleClosePosition = (id: string) => {
    setPositions(positions.filter((position) => position.id !== id));
    // In a real application, this would call an API to close the position
    console.log(`Closing position ${id}`);
  };

  // Calculate statistics
  const totalPositions = positions.length;
  const profitablePositions = positions.filter((pos) => pos.pnl >= 0).length;
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0).toFixed(4);

  return (
    <>
      <Header title="Your Positions" />

      <Container className="py-6">
        <div className="flex justify-end items-center mb-6">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-[#333] bg-[#1A1A1A] hover:bg-[#222] text-white"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 w-full bg-[#111] border border-[#222] p-1">
            <TabsTrigger value="active" className="flex-1">
              Active Positions
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              Position History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {positions.length > 0 ? (
              <>
                <div className="mb-6">
                  <Card className="bg-[#111] border border-[#222] p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Total Positions</p>
                        <p className="font-semibold text-white">
                          {totalPositions}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Profitable</p>
                        <p className="font-semibold text-white">
                          {profitablePositions} of {totalPositions}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Total P&L</p>
                        <p
                          className={`font-semibold ${
                            parseFloat(totalPnL) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {parseFloat(totalPnL) >= 0 ? "+" : "-"}$
                          {Math.abs(parseFloat(totalPnL))}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positions.map((position) => (
                    <TradePositionCard
                      key={position.id}
                      {...position}
                      onClose={handleClosePosition}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No Active Positions
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You don't have any active trading positions at the moment.
                  Visit the country details page to open a position.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {historicalPositions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historicalPositions.map((position) => (
                  <TradePositionCard
                    key={position.id}
                    {...position}
                    className="opacity-80"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No Position History
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your position history will appear here after you close your
                  first trading position.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
}
