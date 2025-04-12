"use client"

import { useState, useEffect } from "react"

interface RealTimeMarkPriceProps {
  initialPrice: number
  countryId: string
}

export default function RealTimeMarkPrice({ initialPrice, countryId }: RealTimeMarkPriceProps) {
  const [price, setPrice] = useState(initialPrice)
  const [trend, setTrend] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      // Random price movement based on country ID for consistency
      const seed = Number.parseInt(countryId) / 10
      const change = (Math.random() - 0.5 + seed) * 0.5
      const newPrice = Number.parseFloat((price + change).toFixed(2))

      setTrend(newPrice > price ? "up" : "down")
      setPrice(newPrice)
    }, 3000)

    return () => clearInterval(interval)
  }, [price, countryId])

  return (
    <div className={`flex items-center ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}`}>
      ${price}
      {trend === "up" && <span className="ml-1">▲</span>}
      {trend === "down" && <span className="ml-1">▼</span>}
    </div>
  )
}
