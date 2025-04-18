"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "@/components/ui/utils/connect-wallet-button";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#111214] border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-medium text-white flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          BeTheNation.fun
        </Link>

        {/* Connect Wallet Button */}
        <ConnectWalletButton />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
  text,
}: {
  href: string;
  active: boolean;
  children?: React.ReactNode;
  text?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-white ${
        active ? "text-white" : "text-gray-400"
      }`}
    >
      {children || text}
    </Link>
  );
}