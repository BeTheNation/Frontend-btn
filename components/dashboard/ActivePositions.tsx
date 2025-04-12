"use client";
import { Button } from "@/components/ui/button";
import { usePositions } from "@/hooks/usePositions";
import { formatCurrency } from "@/lib/utils";
import ClosePositionButton from "@/components/trading/ClosePositionButton";
import FundingFeeTimer from "@/components/trading/FundingFeeTimer";
import UnrealizedPnL from "@/components/trading/UnrealizedPnL";
import RealTimeMarkPrice from "@/components/trading/RealTimeMarkPrice";
import TPSLForm from "@/components/trading/TPSLForm";
import { useDemoMode } from "@/hooks/useDemoMode";
import { toast } from "@/components/ui/use-toast";
import { usePositionStore } from "@/store/positionStore";
import { useContract } from "@/hooks/useContract";
import { useFundingRate } from "@/hooks/useFundingRate";

export default function ActivePositions() {
  const { positions, isLoading, closePosition } = usePositions();
  const { isDemoMode, demoPositions, closeDemoPosition, updateDemoBalance } =
    useDemoMode();
  const { handleClosePosition: closeContractPosition } = useContract();
  const { addTradeToHistory } = usePositionStore();
  const { calculateAccumulatedFees } = useFundingRate();

  // Function to refresh positions - removes closed positions from the UI
  const refreshPositions = (positionId) => {
    // This will update the UI to remove the closed position
    usePositionStore.getState().closePosition(positionId);

    console.log(
      `Position ${positionId} removed from UI after being found already closed on blockchain`
    );

    toast({
      title: "Positions Updated",
      description:
        "Your positions have been refreshed to reflect the latest status.",
    });
  };

  const handleClosePosition = async (position) => {
    console.log(
      "Starting close position for:",
      position.id,
      "isDemoMode:",
      isDemoMode
    );

    try {
      // Calculate PnL and funding fee
      const isLong = position.direction === "long";
      const priceDiff = isLong
        ? position.markPrice - position.entryPrice
        : position.entryPrice - position.markPrice;

      const pnlPercent = priceDiff / position.entryPrice;
      const pnl = position.size * position.leverage * pnlPercent;

      // Calculate hours position has been open
      const hoursOpen =
        (new Date().getTime() - new Date(position.openTime).getTime()) /
        (1000 * 60 * 60);

      // Use the advanced funding fee calculation from useFundingRate hook
      const fundingFee = calculateAccumulatedFees(
        position.size,
        position.direction,
        position.leverage,
        new Date(position.openTime)
      );

      // Total PnL after funding fees
      const totalPnl = pnl + fundingFee; // fundingFee could be negative (paying) or positive (receiving)

      // Check if position is demo based on ID prefix
      const isPositionDemo =
        typeof position.id === "string" &&
        (position.id.startsWith("demo-") || position.id.startsWith("pos-"));

      console.log("Position check:", {
        id: position.id,
        isPositionDemo,
        isDemoMode,
        pnl,
        fundingFee,
        totalPnl,
      });

      // Demo positions handling
      if (isPositionDemo) {
        console.log("Handling DEMO position close:", position.id);
        try {
          // Close the position in the demo store
          await closePosition(position.id, position.markPrice, pnl, fundingFee);
          console.log("Demo position closed in store");

          // Add to trade history
          addTradeToHistory({
            id: `trade-${Date.now()}`,
            positionId: position.id,
            type: "close",
            date: new Date(),
            country: position.country,
            direction: position.direction,
            size: position.size,
            leverage: position.leverage,
            entryPrice: position.entryPrice,
            exitPrice: position.markPrice,
            pnl: pnl,
            fundingFee: fundingFee,
          });

          // Show success toast with detailed information
          toast({
            title: "Demo Position Closed",
            description: `Position closed with ${
              pnl > 0 ? "profit" : "loss"
            } of $${Math.abs(pnl).toFixed(2)}. Funding fee: ${
              fundingFee >= 0 ? "+" : ""
            }$${fundingFee.toFixed(2)}. Total: ${
              totalPnl >= 0 ? "+" : ""
            }$${totalPnl.toFixed(2)}.`,
            variant: totalPnl > 0 ? "default" : "destructive",
          });
        } catch (error) {
          console.error("Error closing demo position:", error);
          toast({
            title: "Error",
            description: `Failed to close demo position: ${error.message}`,
            variant: "destructive",
          });
          throw error; // Rethrow to be caught by the outer try/catch
        }
        return;
      }

      // Real position handling
      if (isDemoMode) {
        // We're in demo mode but trying to close a real position
        console.log(
          "Attempted to close real position in demo mode:",
          position.id
        );
        toast({
          title: "Demo Mode Active",
          description:
            "Cannot close real positions while in demo mode. Please disable demo mode first.",
          variant: "destructive",
        });
        return;
      }

      // Handle real position closing - only when not in demo mode
      console.log("Handling REAL position close:", position.id);
      try {
        // Extract the numeric part from transaction IDs (tx-1234567890)
        let positionId = position.id;
        if (typeof positionId === "string" && positionId.startsWith("tx-")) {
          positionId = positionId.substring(3); // Remove "tx-" prefix
        }

        console.log("Closing with position ID:", positionId);

        // Close the blockchain position - no try/catch needed here
        // as the contract service will handle errors
        const result = await closeContractPosition(BigInt(positionId));

        // Simply check the result object for errors or special cases
        if (result && result.error) {
          console.log("Received error result:", result);
          // Error has already been handled by the contract service
          // Just update UI if necessary
          if (
            result.message &&
            result.message.includes("Position already closed")
          ) {
            refreshPositions(position.id);
          }
          return;
        }

        // Check if position was already closed
        if (result && result.alreadyClosed) {
          console.log(
            "Position already closed on the blockchain, updating UI:",
            result.positionId
          );
          refreshPositions(position.id);
          return;
        }

        // If we get here, the transaction was successful
        // Add to local trade history
        addTradeToHistory({
          id: `trade-${Date.now()}`,
          positionId: position.id,
          type: "close",
          date: new Date(),
          country: position.country,
          direction: position.direction,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: position.markPrice,
          pnl: pnl,
          fundingFee: fundingFee,
        });

        // Close the position in the local store
        await closePosition(position.id, position.markPrice, pnl, fundingFee);

        // Update the UI balance immediately for better feedback
        if (!isDemoMode && !isPositionDemo) {
          // Calculate the return amount: margin + PnL
          const returnAmount = position.size + totalPnl;

          // Get current pending balance (if any)
          const currentPendingBalance = sessionStorage.getItem(
            "pendingBalanceUpdate"
          );
          let newBalance = 0;

          // If we already have a pending balance, use it as the base
          if (
            currentPendingBalance &&
            !isNaN(parseFloat(currentPendingBalance))
          ) {
            newBalance = parseFloat(currentPendingBalance) + returnAmount;
          } else {
            // Otherwise, try to get the current real balance from the web3 provider
            // We'll use the contract service's token data for this example
            try {
              // Import useWeb3 functionality at the top of the file
              const web3Balance =
                window.localStorage.getItem("lastKnownBalance");
              if (web3Balance && !isNaN(parseFloat(web3Balance))) {
                newBalance = parseFloat(web3Balance) + returnAmount;
              } else {
                // If we can't get the balance, just use the return amount
                newBalance = returnAmount;
              }
            } catch (err) {
              console.error("Error getting web3 balance:", err);
              newBalance = returnAmount; // Fallback
            }
          }

          // Store updated balance for UI display
          sessionStorage.setItem("pendingBalanceUpdate", newBalance.toString());
          console.log("Updated UI balance after position close:", newBalance);
        }
      } catch (error) {
        // This should never happen since contract service handles all errors
        console.error("Unexpected error in handleClosePosition:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleClosePosition:", error);
      throw error; // Rethrow so the calling component can handle it
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading positions...</div>;
  }

  // Debug logs for positions
  console.log("Positions data:", {
    isDemoMode,
    demoPositions,
    regularPositions: positions,
  });

  // Filter positions based on demo mode
  const displayPositions = isDemoMode
    ? demoPositions
    : positions.filter(
        (pos) => pos.id && !pos.id.startsWith("demo-") // Add null check for pos.id before calling startsWith
      );

  // Debug log of positions being displayed
  console.log("Displaying positions:", {
    isDemoMode,
    count: displayPositions.length,
    positionIds: displayPositions.map((p) => p.id),
  });

  if (displayPositions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-medium mb-2">No Active Positions</h3>
        <p className="text-gray-400 mb-6">
          You don't have any open positions at the moment.
        </p>
        <Button asChild>
          <a href="/dashboard">Explore Markets</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isDemoMode ? "Demo Positions" : "Active Positions"}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333333]">
              <th className="text-left py-4 px-2">Country</th>
              <th className="text-left py-4 px-2">Direction</th>
              <th className="text-left py-4 px-2">Margin</th>
              <th className="text-left py-4 px-2">Position Size</th>
              <th className="text-left py-4 px-2">Leverage</th>
              <th className="text-left py-4 px-2">Entry Price</th>
              <th className="text-left py-4 px-2">Mark Price</th>
              <th className="text-left py-4 px-2">Unrealized PnL</th>
              <th className="text-left py-4 px-2">Funding</th>
              <th className="text-left py-4 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayPositions.map((position) => (
              <tr key={position.id} className="border-b border-[#333333]">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={position.country.flagUrl || "/placeholder.svg"}
                      alt={`${position.country.name} flag`}
                      className="w-6 h-6 rounded-full"
                    />
                    {position.country.name}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span
                    className={
                      position.direction === "long"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {position.direction === "long" ? "Long" : "Short"}
                  </span>
                </td>
                <td className="py-4 px-2">{formatCurrency(position.size)}</td>
                <td className="py-4 px-2">
                  {formatCurrency(position.size * position.leverage)}
                </td>
                <td className="py-4 px-2">{position.leverage}x</td>
                <td className="py-4 px-2">${position.entryPrice}</td>
                <td className="py-4 px-2">
                  <RealTimeMarkPrice
                    initialPrice={position.markPrice}
                    countryId={position.country.id}
                  />
                </td>
                <td className="py-4 px-2">
                  <UnrealizedPnL position={position} />
                </td>
                <td className="py-4 px-2">
                  <FundingFeeTimer position={position} />
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <TPSLForm position={position} />
                    <ClosePositionButton
                      position={position}
                      onClose={() => handleClosePosition(position)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
