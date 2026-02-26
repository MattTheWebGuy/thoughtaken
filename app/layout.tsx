import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import PageLoadOverlay from "./components/PageLoadOverlay";
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
  title: "THOUGHTAKEN",
  description: "Cinematic biker movement personal brand website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <PageLoadOverlay />
        {children}
      </body>
    </html>
  );
}
