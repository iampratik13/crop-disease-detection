import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#16a34a",
};

export const metadata: Metadata = {
  title: "Tomato Disease Detection — AI-Powered Leaf Analysis",
  description:
    "Upload or capture tomato leaf images for instant AI-powered disease detection. Identifies 10 diseases with treatment recommendations in English, Hindi, Marathi, and Kannada.",
  keywords: [
    "tomato disease detection",
    "plant disease",
    "leaf analysis",
    "AI agriculture",
    "crop health",
  ],
  authors: [{ name: "Tomato Disease Detection Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
