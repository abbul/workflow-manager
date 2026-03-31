import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TrpcProvider from "@/trpc/Provider";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workflow Manager",
  description: "Manage your alert workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TrpcProvider>
          <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
            <Link href="/">Workflows</Link>
            <Link href="/history">History</Link>
          </header>
          <main style={{ padding: '2rem' }}>
            {children}
          </main>
        </TrpcProvider>
      </body>
    </html>
  );
}
