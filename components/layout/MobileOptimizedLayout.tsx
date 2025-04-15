"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Home,
  BarChart2,
  Wallet,
  History,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button";
import { useWeb3 } from "@/hooks/useWeb3";

export default function MobileOptimizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected, disconnect } = useWeb3();

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Markets", href: "/dashboard", icon: BarChart2 },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0D0D0D]/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-white flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            GDP
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ConnectWalletButton />
            </div>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[80%] sm:w-[350px] bg-[#0D0D0D] border-l border-[#333]"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-lg font-bold">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {isConnected ? (
                    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 mb-6">
                      <div className="text-sm text-gray-400">
                        Connected Wallet
                      </div>
                      <div className="font-medium truncate">{address}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={disconnect}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <ConnectWalletButton />
                    </div>
                  )}

                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          pathname === item.href
                            ? "bg-blue-600 text-white"
                            : "hover:bg-[#1A1A1A]"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-[#333] text-center">
                    <p className="text-sm text-gray-400">© 2023 BeTheNation</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#333] z-40">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-3 px-2 ${
                pathname === item.href ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
