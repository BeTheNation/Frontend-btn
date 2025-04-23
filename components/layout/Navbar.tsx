"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button";
import { useAccount } from "wagmi";

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <nav className="bg-[#111214]">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            href={isConnected ? "/dashboard" : "/"}
            className="text-xl font-medium text-white flex items-center"
          >
            <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path fillRule="evenodd" clipRule="evenodd" d="M30.8821 54.4101C44.0747 53.4469 54.4786 42.4384 54.4786 29C54.4786 15.2755 43.6269 4.08549 30.0357 3.5421V15.3286V17.9762V18.2286H15.057C14.0364 21.4292 13.4643 25.0501 13.4643 29C13.4643 31.4442 13.6863 33.7557 14.1003 35.9149L23.6414 26.3739C23.4903 26.0015 23.4071 25.5944 23.4071 25.1679C23.4071 23.3946 24.8446 21.9571 26.6179 21.9571C28.3911 21.9571 29.8286 23.3946 29.8286 25.1679C29.8286 25.4686 29.7872 25.7598 29.7099 26.0359L34.3662 29.8369C34.7256 29.6978 35.1164 29.6214 35.525 29.6214C35.6112 29.6214 35.6966 29.6248 35.7811 29.6315L42.6073 20.1405C42.2556 19.6255 42.05 19.0028 42.05 18.3321C42.05 16.5589 43.4875 15.1214 45.2607 15.1214C47.0339 15.1214 48.4714 16.5589 48.4714 18.3321C48.4714 20.1054 47.0339 21.5429 45.2607 21.5429C45.231 21.5429 45.2013 21.5425 45.1718 21.5417L38.2607 31.1506C38.5619 31.6396 38.7357 32.2156 38.7357 32.8321C38.7357 34.6054 37.2982 36.0429 35.525 36.0429C33.7518 36.0429 32.3143 34.6054 32.3143 32.8321C32.3143 32.5427 32.3526 32.2622 32.4244 31.9954L27.7447 28.1753C27.3941 28.3067 27.0144 28.3786 26.6179 28.3786C26.3475 28.3786 26.085 28.3452 25.8342 28.2823L14.9122 39.2043C14.9703 39.3948 15.0301 39.5839 15.0915 39.7714L27.1357 39.7714L29.8286 39.7714L30.0357 39.7714V54.3045C30.3163 54.3477 30.5985 54.3829 30.8821 54.4101ZM27.1357 53.5584L27.1357 42.6714H16.2182C18.6838 48.0931 22.6027 51.9055 27.1357 53.5584ZM12.0735 39.7714C11.2376 36.9581 10.7274 33.8973 10.5974 30.6571H3.57446C3.78248 33.8974 4.5962 36.9729 5.9036 39.7714H12.0735ZM10.5826 27.7571C10.6828 24.3789 11.1902 21.1749 12.0465 18.2286H5.9036C4.5406 21.1462 3.71416 24.3647 3.55121 27.7571H10.5826ZM16.1526 15.3286H27.1357L27.1357 4.12209C22.5587 5.807 18.6125 9.75288 16.1526 15.3286ZM19.8047 5.23125C16.9561 7.7955 14.6363 11.2506 13.0336 15.3286H7.4962C10.3968 10.7757 14.7035 7.20606 19.8047 5.23125ZM13.0845 42.6714C14.7936 46.9092 17.2984 50.4406 20.3705 52.9801C15.0221 51.0551 10.5034 47.3916 7.4962 42.6714H13.0845ZM29 58C45.0163 58 58 45.0163 58 29C58 12.9837 45.0163 0 29 0C12.9837 0 0 12.9837 0 29C0 45.0163 12.9837 58 29 58Z" fill="url(#paint0_linear_741_6488)"/>
              <defs>
                <linearGradient id="paint0_linear_741_6488" x1="29" y1="0" x2="29" y2="58" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#155EEF"/>
                  <stop offset="1" stopColor="#996919"/>
                </linearGradient>
              </defs>
            </svg>
            BeTheNation.fun
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <NavLink
              href="/dashboard"
              active={pathname === "/dashboard"}
              text="Markets"
            />
            <NavLink
              href="/portfolio"
              active={pathname === "/portfolio"}
              text="Portfolio"
            />
            <NavLink
              href="/history"
              active={pathname === "/history"}
              text="History"
            />
          </div>
          <ConnectWalletButton />
        </div>
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
