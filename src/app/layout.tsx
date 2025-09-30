import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glow Worm Studio - Professional Media Management",
  description: "Organize, search, and present your digital assets with enterprise-grade tools designed for professional workflows.",
  keywords: "media management, digital assets, file organization, media platform, enterprise tools",
  authors: [{ name: "Glow Worm Studio" }],
  creator: "Glow Worm Studio",
  publisher: "Glow Worm Studio",
  openGraph: {
    title: "Glow Worm Studio - Professional Media Management",
    description: "Organize, search, and present your digital assets with enterprise-grade tools designed for professional workflows.",
    url: "https://glowworm.studio",
    siteName: "Glow Worm Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glow Worm Studio - Media Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Worm Studio - Professional Media Management",
    description: "Organize, search, and present your digital assets with enterprise-grade tools.",
    images: ["/og-image.jpg"],
    creator: "@glowwormstudio",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
