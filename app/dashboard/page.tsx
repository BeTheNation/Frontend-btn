"use client";

import CountryList from "@/components/dashboard/CountryList";
import ActivePositions from "@/components/dashboard/ActivePositions";
import TradeHistory from "@/components/dashboard/TradeHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BalanceDisplay from "@/components/ui/balance-display";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <BalanceDisplay />
        </div>
      </div>

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="markets">
          <CountryList />
        </TabsContent>

        <TabsContent value="positions">
          <ActivePositions />
        </TabsContent>

        <TabsContent value="history">
          <TradeHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
