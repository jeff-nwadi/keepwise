import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Keepwise — Receipts that remember so you don't have to",
  description:
    "Snap a receipt. Keepwise reads it, infers the return or warranty window, and reminds you before the deadline closes. Free for five items per household.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink font-sans selection:bg-amber/30 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
