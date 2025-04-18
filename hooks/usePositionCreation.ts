"use client";

import { useState } from "react";
import { useContract } from "./useContract";
import { usePositions } from "./usePositions";
import { useDemoMode } from "./useDemoMode";
import { useToast } from "@/components/ui/use-toast";
import { generateId } from "@/lib/utils";

/**
 * Hook for creating new positions with proper handling for both contract and demo modes
 */
export function usePositionCreation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleOpenPosition } = useContract();
  const { addPosition } = usePositions();
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();

  const createPosition = async (
    countryId: string,
    countryName: string,
    direction: "long" | "short",
    size: number,
    leverage: number,
    entryPrice: number,
    markPrice: number
  ) => {
    setIsProcessing(true);

    try {
      // If in demo mode, create a demo position without blockchain interaction
      if (isDemoMode) {
        // Create a demo position with a unique ID
        const demoPosition = {
          id: `demo-${generateId()}`,
          country: {
            id: countryId,
            name: countryName,
          },
          direction: direction,
          size: size,
          leverage: leverage,
          entryPrice: entryPrice,
          markPrice: markPrice,
          openTime: new Date(),
          fundingRate: 0.01, // Default funding rate
          nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        };

        // Add the position to the store
        addPosition(demoPosition);

        toast({
          title: "Demo Position Created",
          description: `Successfully opened a ${direction} position on ${countryName} in demo mode.`,
          variant: "success",
        });

        return { success: true, position: demoPosition };
      } else {
        // Use the contract method when not in demo mode
        const result = await handleOpenPosition(
          countryId,
          direction,
          leverage,
          size.toString()
        );

        if (result && !result.error) {
          toast({
            title: "Position Created",
            description: `Successfully opened a ${direction} position on ${countryName}.`,
            variant: "success",
          });
          return { success: true, position: result };
        } else {
          throw new Error(result?.message || "Failed to create position");
        }
      }
    } catch (error: any) {
      console.error("Error creating position:", error);
      toast({
        title: "Error Creating Position",
        description:
          error.message || "Failed to create position. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createPosition,
    isProcessing,
  };
}
