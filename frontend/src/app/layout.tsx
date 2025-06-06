import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cal-Scheduler - Smart Calendar Availability Tool",
  description:
    "Find your available time slots across all your Google Calendars with smart filtering and easy sharing.",
  keywords: [
    "calendar",
    "scheduling",
    "availability",
    "google calendar",
    "time management",
  ],
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://calscheduler.vercel.app"
      : "http://localhost:3000"
  ),
  openGraph: {
    title: "Cal-Scheduler - Find Your Perfect Time Slots",
    description:
      "Cal-Scheduler intelligently finds your available time slots by seamlessly integrating with your Google Calendar.",
    url: "/",
    siteName: "Cal-Scheduler",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cal-Scheduler - Smart Calendar Management Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cal-Scheduler - Find Your Perfect Time Slots",
    description:
      "Cal-Scheduler intelligently finds your available time slots by seamlessly integrating with your Google Calendar.",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-site-verification-code", // Add if you have Google Search Console set up
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
