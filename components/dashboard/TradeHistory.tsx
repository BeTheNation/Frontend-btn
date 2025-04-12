"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { formatCurrency } from "@/lib/utils";

export default function TradeHistory() {
  const { trades, isLoading } = useTradeHistory();
  const [filterType, setFilterType] = useState("all");

  // Memoize filtered trades to prevent unnecessary recalculations
  const filteredTrades = useMemo(() => {
    if (filterType === "all") return trades;
    return trades.filter((trade) => trade.type === filterType);
  }, [trades, filterType]);

  // Memoize event handlers
  const handleFilterChange = useCallback((value) => {
    setFilterType(value);
  }, []);

  const handleExport = useCallback(() => {
    if (!filteredTrades.length) return;

    const dataStr = JSON.stringify(filteredTrades, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `trade-history-${filterType}-${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [filteredTrades, filterType]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium">Loading trade history...</div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-lg font-medium">No trading history yet</div>
        <div className="mb-8 text-sm text-muted-foreground">
          Start trading to see your history here
        </div>
        <Link href="/trade">
          <Button>Start Trading</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-semibold">Trade History</div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              <SelectItem value="open">Open Positions</SelectItem>
              <SelectItem value="close">Closed Positions</SelectItem>
              <SelectItem value="liquidation">Liquidations</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!filteredTrades.length}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-xs uppercase">
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-left font-medium">Country</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Direction</th>
                <th className="px-4 py-2 text-left font-medium">Size</th>
                <th className="px-4 py-2 text-left font-medium">Leverage</th>
                <th className="px-4 py-2 text-left font-medium">Entry Price</th>
                <th className="px-4 py-2 text-left font-medium">Exit Price</th>
                <th className="px-4 py-2 text-left font-medium">PnL</th>
                <th className="px-4 py-2 text-left font-medium">Funding Fee</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-b">
                  <td className="px-4 py-3 text-sm">
                    {new Date(trade.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={trade.country.flagUrl}
                        alt={trade.country.name}
                        className="h-4 w-6 rounded"
                      />
                      <span>{trade.country.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        trade.type === "open"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : trade.type === "close"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        trade.direction === "long"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {trade.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(trade.size)}
                  </td>
                  <td className="px-4 py-3 text-sm">{trade.leverage}x</td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : "—"}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      trade.pnl > 0
                        ? "text-green-600 dark:text-green-400"
                        : trade.pnl < 0
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }`}
                  >
                    {trade.pnl > 0 ? "+" : ""}
                    {formatCurrency(trade.pnl)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      trade.fundingFee > 0
                        ? "text-green-600 dark:text-green-400"
                        : trade.fundingFee < 0
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }`}
                  >
                    {trade.fundingFee > 0 ? "+" : ""}
                    {formatCurrency(trade.fundingFee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
