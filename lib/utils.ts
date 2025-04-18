export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function formatPercentage(value: number, decimalPlaces: number = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimalPlaces)}%`
}

export function formatLiquidationPrice(direction: "long" | "short", entryPrice: number, leverage: number): string {
  const liquidationThreshold = 0.8; // 80% of margin
  const movePercentage = liquidationThreshold / leverage;
  
  let liquidationPrice: number;
  if (direction === "long") {
    liquidationPrice = entryPrice * (1 - movePercentage);
  } else {
    liquidationPrice = entryPrice * (1 + movePercentage);
  }
  
  return formatCurrency(liquidationPrice);
}

export function calculatePnL(
  direction: "long" | "short",
  entryPrice: number,
  currentPrice: number,
  size: number,
  leverage: number
): { amount: number; percentage: number } {
  let pnlAmount = 0;
  const positionSize = size * leverage;

  if (direction === "long") {
    pnlAmount = positionSize * ((currentPrice - entryPrice) / entryPrice);
  } else {
    pnlAmount = positionSize * ((entryPrice - currentPrice) / entryPrice);
  }
  
  const pnlPercentage = (pnlAmount / size) * 100;
  
  return {
    amount: pnlAmount,
    percentage: pnlPercentage
  };
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
