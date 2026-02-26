import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import PageLoadOverlay from "./components/PageLoadOverlay";
import { SITE_CONFIG } from "./lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thoughtaken.com"),
  title: {
    default: "THOUGHTAKEN | Motorcycle Rides, Stories & Culture",
    template: "%s | THOUGHTAKEN",
  },
  description:
    "THOUGHTAKEN by Matthew Woods: motorcycle rides, motovlog-style stories, rider culture, and limited streetwear drops.",
  applicationName: "THOUGHTAKEN",
  keywords: [
    "thoughtaken",
    "matthew woods",
    "motorcycle",
    "motovlog",
    "biker lifestyle",
    "ride videos",
    "street riding",
    "motorcycle community",
    "motorcycle merch",
    "limited drops",
  ],
  authors: [{ name: SITE_CONFIG.branding.creatorName }],
  creator: SITE_CONFIG.branding.creatorName,
  publisher: "THOUGHTAKEN",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thoughtaken.com",
    siteName: "THOUGHTAKEN",
    title: "THOUGHTAKEN | Motorcycle Rides, Stories & Culture",
    description:
      "Watch the latest THOUGHTAKEN rides, stories from the road, and join the rider community.",
    images: [
      {
        url: "https://thoughtaken.com/images/hero/hero1.jpg",
        width: 1200,
        height: 630,
        alt: "THOUGHTAKEN motorcycle rider hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THOUGHTAKEN | Motorcycle Rides, Stories & Culture",
    description:
      "Latest motorcycle rides, stories, and rider culture from THOUGHTAKEN.",
    images: ["https://thoughtaken.com/images/hero/hero1.jpg"],
    creator: "@thoughtaken",
  },
  category: "motorcycling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <PageLoadOverlay />
        {children}
      </body>
    </html>
  );
}
