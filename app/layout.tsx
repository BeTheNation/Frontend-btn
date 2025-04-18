import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Be The Nation - GDP Prediction Market",
  description: "Trade on the economic performance of countries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Check for reset=true in URL
            if (window.location.search.includes('reset=true')) {
              console.log("Clearing all localStorage data...");
              localStorage.clear();
              // Redirect to same page without the reset parameter
              window.location.href = window.location.pathname;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            <div className="min-h-screen bg-[#111213] text-white">
              <Navbar />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}