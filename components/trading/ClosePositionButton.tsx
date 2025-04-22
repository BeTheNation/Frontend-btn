"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePositions } from "@/hooks/usePositions";
import { useToast } from "@/components/ui/use-toast";

interface ClosePositionButtonProps {
  positionId: string;
}

export function ClosePositionButton({ positionId }: ClosePositionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { closePosition, isLoading, isClosingPosition } = usePositions();
  const { toast } = useToast();

  const handleConfirmClose = async () => {
    // Prevent double submission
    if (isClosing) return;

    // Validate positionId
    if (!positionId) {
      console.error("Attempted to close position with empty ID");
      toast({
        title: "Invalid position",
        description: "Cannot close position with invalid ID",
        variant: "destructive",
      });
      setOpen(false);
      return;
    }

    // Check if position exists in the state before proceeding
    // This extra validation can prevent errors with demo positions
    if (positionId.startsWith("demo-")) {
      console.log(`Attempting to close demo position: ${positionId}`);
    }

    setIsClosing(true);

    try {
      // Call the closePosition function which handles all error cases
      const result = await closePosition(positionId);

      // Check if the operation was successful
      if (result && result.success) {
        toast({
          title: "Position closed",
          description: "Your position has been closed successfully",
        });
      } else if (result && result.code === "POSITION_NOT_FOUND") {
        toast({
          title: "Position already closed",
          description: "This position has already been closed or doesn't exist",
        });
      } else if (result && result.code === "DEMO_POSITION_ERROR") {
        toast({
          title: "Demo position error",
          description:
            "This position may have already been closed or doesn't exist in the demo store",
        });
      } else if (!result) {
        // Handle the case where result is undefined or null
        console.warn("No result returned from closePosition");
        toast({
          title: "Position close status unknown",
          description:
            "The operation completed but the status is unknown. Please check your positions list.",
        });
      }
      // Other error cases are handled within the closePosition function
    } catch (error: any) {
      // This should only happen for truly unexpected errors not handled by the hook
      console.error("Unexpected error in ClosePositionButton:", error);
      toast({
        title: "Error closing position",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={
          isClosing ||
          isLoading ||
          (isClosingPosition && isClosingPosition !== positionId)
        }
        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
      >
        {isClosingPosition === positionId ? "Closing..." : "Close"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Position</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this position? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isClosing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmClose}
              disabled={isClosing || isLoading || isClosingPosition !== null}
            >
              {isClosing ? "Closing..." : "Close Position"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
