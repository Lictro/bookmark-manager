import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkDataProvider } from "@/context/BookmarkDataContext";
import { BookmarkUIProvider } from "@/context/BookmarkUIContext";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "Organize, tag and manage your favorite links in one place.",
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
        <AuthProvider>
          <BookmarkDataProvider>
            <BookmarkUIProvider>
              {children}
            </BookmarkUIProvider>
          </BookmarkDataProvider>
          <Toaster />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
