import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "./providers";
import ConstellationGrid from "@/components/ui/constellation-grid";
import { GrainBackground } from "@/components/ui/grain-background";
import { VisitBeacon } from "@/components/VisitBeacon";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://keepx.link"),
  title: "Keepx | Concentrated Liquidity on Solana",
  description: "Create, simulate, sign, monitor, and exit concentrated liquidity positions without giving up wallet custody."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestReferer = (await headers()).get("referer") ?? "";

  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <VisitBeacon initialReferrer={requestReferer} />
        <ConstellationGrid />
        <GrainBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
