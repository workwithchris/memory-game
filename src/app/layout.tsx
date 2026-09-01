import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import RegisterSW from "@/components/register-sw";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memory Game",
  description: "Created by Chris Thapa",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
          <RegisterSW />
        </TooltipProvider>
      </body>
    </html>
  );
}
