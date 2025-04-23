import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HistoryData {
  country: string;
  countryCode: string;
  time: string;
  entryPrice: string;
  marketPrice: string;
  pnl: {
    amount: string;
    percentage: string;
    isProfit: boolean;
  };
  status: string;
}

const historyData: HistoryData[] = [
  {
    country: "USA",
    countryCode: "us",
    time: "01-05-2025 09:04",
    entryPrice: "$1,200",
    marketPrice: "$1,400",
    pnl: {
      amount: "$100",
      percentage: "2.01",
      isProfit: true
    },
    status: "Closed"
  },
  {
    country: "Germany",
    countryCode: "de",
    time: "01-05-2025 09:04",
    entryPrice: "$1,200",
    marketPrice: "$1,400",
    pnl: {
      amount: "$100",
      percentage: "2.01",
      isProfit: true
    },
    status: "Closed"
  },
  {
    country: "Japan",
    countryCode: "jp",
    time: "01-05-2025 09:04",
    entryPrice: "$1,200",
    marketPrice: "$1,400",
    pnl: {
      amount: "-$100",
      percentage: "2.01",
      isProfit: false
    },
    status: "Closed"
  },
  {
    country: "Russia",
    countryCode: "ru",
    time: "01-05-2025 09:04",
    entryPrice: "$1,200",
    marketPrice: "$1,400",
    pnl: {
      amount: "$100",
      percentage: "2.01",
      isProfit: true
    },
    status: "Closed"
  }
];

export default function HistoryTable() {
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
      <div className="w-full flex flex-col">
        {historyData.map((item, index) => (
          <motion.div 
            key={index} 
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
            <motion.div 
              className="flex-1 h-[63px] px-9 py-1.5 flex items-center gap-4"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div 
                className="w-[38px] h-[38px] relative rounded-full overflow-hidden bg-white"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image 
                  className="w-full h-full object-cover" 
                  src={`https://flagcdn.com/w160/${item.countryCode}.png`}
                  alt={`${item.country} flag`}
                  width={38}
                  height={38}
                  priority
                />
              </motion.div>
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">{item.country}</div>
            </motion.div>
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">{item.time}</div>
            </div>
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">{item.entryPrice}</div>
            </div>
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-white text-xl font-normal font-['Inter'] leading-tight">{item.marketPrice}</div>
            </div>
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <motion.div 
                className={`${item.pnl.isProfit ? 'text-[#00e431]' : 'text-[#f10000]'} text-xl font-normal font-['Inter'] leading-tight`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {item.pnl.amount} {item.pnl.isProfit ? '+' : '-'}{item.pnl.percentage}%
              </motion.div>
            </div>
            <div className="flex-1 h-[63px] px-6 py-1.5 flex justify-center items-center">
              <div className="text-[#f10000] text-xl font-normal font-['Inter'] leading-tight">{item.status}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 