import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PingFlow — Uptime & SSL Monitor",
  description:
    "Lightweight, open-source uptime and SSL monitoring. Deploy on Vercel in seconds or self-host with Docker.",
  openGraph: {
    title: "PingFlow — Uptime & SSL Monitor",
    description: "Real-time uptime monitoring for your services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-neutral-100">
        {children}
      </body>
    </html>
  );
}
