"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function ConnectWalletButton() {
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();
  const router = useRouter();
  const { isConnected } = useAccount();
  const [wasConnected, setWasConnected] = useState(false);

  // Track connection state changes to detect when a user has just connected
  useEffect(() => {
    if (isConnected && !wasConnected) {
      // User just connected their wallet
      router.push("/dashboard");
    }
    setWasConnected(isConnected);
  }, [isConnected, wasConnected, router]);

  const handleBeforeConnect = () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode Active",
        description:
          "You are in demo mode. Disable demo mode to perform real transactions.",
        variant: "warning",
        duration: 5000,
      });
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    type="button"
                    className="px-[20.82px] py-[13.01px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[80.08px] shadow-[-9.609195709228516px_-9.609195709228516px_19.21839141845703px_0px_rgba(21,94,239,0.24)] shadow-[9.609195709228516px_9.609195709228516px_19.21839141845703px_0px_rgba(255,175,41,0.24)] outline outline-[2.40px] outline-[#155dee] inline-flex justify-center items-center gap-[10.41px] overflow-hidden"
                    onClick={() => {
                      handleBeforeConnect();
                      openConnectModal();
                    }}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    type="button"
                    className="btn-danger rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
                    onClick={openChainModal}
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="relative inline-flex items-center gap-x-2 rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
