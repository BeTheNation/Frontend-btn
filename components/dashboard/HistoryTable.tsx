"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTradeHistoryStore } from '@/components/dashboard/tradeHistoryStore';
import useSWR from 'swr';
import { fetcher } from '@/src/services/fetcher';

// Base64 encoded placeholder flag image
const PLACEHOLDER_FLAG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDQtMDVUMTU6MTM6MzMtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDQtMDVUMTU6MTM6MzMtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA0LTA1VDE1OjEzOjMzLTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY2ZjI5ZWFmLTJlZDYtNDFhZC1hZDY2LTNiOWM2Y2JhNzRiYiIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0wNVQxNToxMzozMy0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+O7+8OAAAAO1JREFUWIXtlj0OwjAMhT+gA2PnHoAzcAUWzsEFWLgMN2BhQYIDwMbWjbEDQ0YUKUQNrdQ/qZH8pEhR3Pd+tmMnRkRwySOn6v8BfDxABkyBHrAJ1TbA3OZ0k98bYAGIw1rYnFQAc6AERF73wAZYAiOgC7RszQxgB9S2LgHmwDEFwMACeMk/eQA2wNTOewE4ACd7XwEjoJMCoAQe8lueBxqgZ3PqwF4eKIEHMEgB0AA3+d9+DZzlvgkPcJL7BzgDoxQAB7lf+znQAKPYAKF9YGjv28DV5oQGiH4K/v8LYgOYN6JN6NhX0Af4AIUzSBGAH0UdAAAAAElFTkSuQmCC";

export default function HistoryTable() {
  const historyData = useTradeHistoryStore((state) => state.history);
  const [tradeHistory, setTradeHistory] = useState<any[]>([])
  const { data, error, isLoading } = useSWR(`http://localhost:1000/api/v1/trade-history/663fabc9e25a4f7e9e2d4b55`, fetcher)
  useEffect(() => {
    if (data) {
      setTradeHistory(data.data)
    // console.log(data.data) /
    }
  }, [data])

  return (
    <div className="w-full bg-[#1d1f22] rounded-[40px] flex flex-col">
      {/* Table Header */}
      <div className="w-full px-2 py-[7px] flex items-center">
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-start items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">Country</div>
        </div>
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">Time</div>
        </div>
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">Entry Price</div>
        </div>
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">Market Price</div>
        </div>
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">PnL</div>
        </div>
        <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
          <div className="text-white text-xl font-normal font-['Inter'] leading-tight">Status</div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#313131]"></div>

      {/* Table Body */}
      {tradeHistory.length === 0 ? (
        <div className="text-center text-[#888] py-8">No trade history yet.</div>
      ) : (
        tradeHistory.map((item, index) => (
          <motion.div 
            key={item._id || index}
            className="w-full px-2 py-[7px] flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1],
              delay: index * 0.02
            }}
            whileHover={{ 
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            {/* Country Column */}
            <div className="flex-1 h-[63px] px-9 py-1.5 flex items-center gap-4">
              <div className="w-[38px] h-[38px] relative rounded-full overflow-hidden bg-[#2d2d2e] flex items-center justify-center">
                <Image 
                  src={`https://flagcdn.com/w160/${item.countryCode.toLowerCase()}.png`}
                  alt={`${item.country} flag`}
                  width={38}
                  height={38}
                  className="w-full h-full object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_FLAG;
                  }}
                />
              </div>
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">
                {item.country}
              </div>
            </div>

            {/* Time Column */}
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">
                {item.time}
              </div>
            </div>

            {/* Entry Price Column */}
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">
                {item.entryPrice}
              </div>
            </div>

            {/* Market Price Column */}
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">
                {item.marketPrice}
              </div>
            </div>

            {/* PnL Column */}
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <motion.div 
                className={`${item.pnl.isProfit ? 'text-[#00e431]' : 'text-[#f10000]'} text-xl font-normal font-['Inter'] leading-tight`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {item.pnl.amount} {item.pnl.isProfit ? '+' : '-'}{item.pnl.percentage}%
              </motion.div>
            </div>

            {/* Status Column */}
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className={`text-xl font-normal font-['Inter'] leading-tight ${
                item.status === 'Open' ? 'text-[#00e431]' : 
                item.status === 'Closed' ? 'text-[#f10000]' : 'text-white'
              }`}>
                {item.status}
              </div>
            </div>
          </motion.div> 
        ))
      )}
    </div>
  );
} 