"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"

interface UnrealizedPnLProps {
  position: any
}

export default function UnrealizedPnL({ position }: UnrealizedPnLProps) {
  const [pnl, setPnl] = useState(0)
  const [pnlPercent, setPnlPercent] = useState(0)

  useEffect(() => {
    // Calculate initial PnL
    calculatePnL(position.markPrice)

    // Simulate real-time PnL updates
    const interval = setInterval(() => {
      // Random price movement
      const change = (Math.random() - 0.5) * 0.5
      const newPrice = Number.parseFloat((position.markPrice + change).toFixed(2))

      calculatePnL(newPrice)
    }, 3000)

    return () => clearInterval(interval)
  }, [position])

  const calculatePnL = (currentPrice: number) => {
    const entryPrice = position.entryPrice
    const size = position.size * position.leverage

    let newPnl = 0

    if (position.direction === "long") {
      newPnl = size * ((currentPrice - entryPrice) / entryPrice)
    } else {
      newPnl = size * ((entryPrice - currentPrice) / entryPrice)
    }

    const newPnlPercent = (newPnl / position.size) * 100

    setPnl(newPnl)
    setPnlPercent(newPnlPercent)
  }

  return (
    <div className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
      <div>
        {pnl >= 0 ? "+" : ""}
        {formatCurrency(pnl)}
      </div>
      <div className="text-xs">
        ({pnl >= 0 ? "+" : ""}
        {pnlPercent.toFixed(2)}%)
      </div>
    </div>
  )
}
