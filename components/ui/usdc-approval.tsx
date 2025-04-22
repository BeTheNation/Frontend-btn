"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { parseEther } from "viem";
import { useContractWrite, useNetwork, useAccount, useContractRead } from "wagmi";
import {
  getContractAddress,
  getUSDCAddress,
} from "@/lib/contracts/PredictionMarket";
import { handleContractFunctionExecutionError } from "@/lib/viem-error-decoder";
import { ethers } from "ethers";

interface USDCApprovalProps {
  amount: string;
  onSuccess?: () => void;
  contractAddress?: string;
}

export function USDCApproval({
  amount,
  onSuccess,
  contractAddress,
}: USDCApprovalProps) {
  const { toast } = useToast();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState<bigint>(BigInt(0));

  // Get the default contract address if one is not provided
  const resolvedContractAddress = contractAddress || 
    (chain?.id ? getContractAddress(chain.id) : undefined);

  // Get USDC address
  const usdcAddress = chain?.id ? getUSDCAddress(chain.id) : undefined;

  // Use contractRead to get the current allowance
  const { data: allowanceData, refetch: refetchAllowance } = useContractRead({
    address: usdcAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: [address as `0x${string}`, resolvedContractAddress as `0x${string}`],
    enabled: !!address && !!resolvedContractAddress && !!usdcAddress,
  });

  useEffect(() => {
    if (allowanceData) {
      setCurrentAllowance(BigInt(allowanceData.toString()));
    }
  }, [allowanceData]);

  // Contract write function for approve
  const { writeAsync: approve } = useContractWrite({
    address: usdcAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "approve",
  });

  const getApprovalAmount = () => {
    try {
      // Convert the amount to a BigInt
      const amountBigInt = parseEther(amount);
      // Add a 20% buffer to the amount
      const buffer = (amountBigInt * BigInt(20)) / BigInt(100);
      return amountBigInt + buffer;
    } catch (error) {
      console.error("Error calculating approval amount:", error);
      // Return a default value or the original amount
      return parseEther(amount);
    }
  };

  const handleApprove = async () => {
    if (!resolvedContractAddress || !usdcAddress) {
      toast({
        title: "Error",
        description: "Contract or USDC address not found.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Ensure contract address is valid
      if (!ethers.isAddress(resolvedContractAddress)) {
        throw new Error("Alamat kontrak tidak valid");
      }
      
      // Log status and data for approval
      console.log("Memulai approval USDC:", {
        amount,
        contractAddress: resolvedContractAddress,
        currentAllowance,
      });
      
      // Calculate approval amount with buffer
      const approvalAmount = getApprovalAmount();
      const result = await approve({
        args: [resolvedContractAddress, approvalAmount],
      });
      
      // Log result
      console.log("Approval berhasil:", result);
      await refetchAllowance();
      toast({
        title: "Success",
        description: "USDC approval successful",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error approval:", error);
      const errorInfo = handleContractFunctionExecutionError(error);
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border-2 border-yellow-500 bg-[#262626] shadow-lg">
      <h3 className="text-lg font-medium text-yellow-300 flex items-center gap-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#EAB308"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(234, 179, 8, 0.1)"
          />
          <path
            d="M12 8V12"
            stroke="#EAB308"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16H12.01"
            stroke="#EAB308"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        USDC Approval Required
      </h3>
      <div className="border-l-4 border-yellow-600 pl-3 py-2 mb-2 bg-yellow-950/20 rounded-r">
        <p className="text-sm text-gray-300">
          <span className="font-medium text-yellow-300">Error 0xfb8f41b2:</span>{" "}
          ERC20InsufficientAllowance - You need to approve USDC spending first
        </p>
      </div>
      <p className="text-sm text-gray-400 mb-2">
        Before opening a position, you need to approve the smart contract to use
        your USDC. This is a security feature of ERC-20 tokens that prevents
        contracts from spending your tokens without permission.
      </p>
      <div className="flex items-center justify-between mb-2 bg-[#1d1d1d] p-3 rounded border border-yellow-900/30">
        <span className="text-sm">Amount to approve:</span>
        <span className="font-medium text-yellow-300 text-lg">
          {amount} USDC
        </span>
      </div>
      <div className="flex items-center justify-between mb-2 bg-[#1d1d1d] p-3 rounded border border-yellow-900/30">
        <span className="text-sm">Contract to authorize:</span>
        <span className="font-medium text-yellow-300 text-sm">
          {resolvedContractAddress?.slice(0, 6)}...
          {resolvedContractAddress?.slice(-4)}
        </span>
      </div>

      <div className="mb-3">
        <div
          className={`h-2 w-full rounded-full ${
            isLoading ? "bg-yellow-300 animate-pulse" : "bg-[#333333]"
          }`}
        ></div>
        <p className="text-xs mt-1 text-center">
          {isLoading
            ? "Waiting for approval confirmation..."
            : "Ready to approve"}
        </p>
      </div>

      <Button
        onClick={handleApprove}
        disabled={isLoading || !amount || !resolvedContractAddress}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
        size="lg"
      >
        {isLoading ? "Approving..." : "Approve USDC"}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        This is a one-time approval for this amount. You'll need to approve
        again if you want to trade with a larger amount in the future.
      </p>
    </div>
  );
}
