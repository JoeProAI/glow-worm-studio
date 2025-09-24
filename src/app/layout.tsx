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
  title: "Glow Worm Studio - AI-Powered Media Intelligence",
  description: "Transform your media with AI. Upload, organize, and create stunning galleries with intelligent categorization and next-level experiences.",
  keywords: "AI, media, gallery, organization, Luma AI, OpenAI, creative studio",
  authors: [{ name: "Glow Worm Studio" }],
  creator: "Glow Worm Studio",
  publisher: "Glow Worm Studio",
  openGraph: {
    title: "Glow Worm Studio - AI-Powered Media Intelligence",
    description: "Transform your media with AI. Upload, organize, and create stunning galleries with intelligent categorization.",
    url: "https://glowworm.studio",
    siteName: "Glow Worm Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glow Worm Studio - AI Media Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Worm Studio - AI-Powered Media Intelligence",
    description: "Transform your media with AI. Upload, organize, and create stunning galleries.",
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <div className="relative">
          {/* Glow Worm Background Effect */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
