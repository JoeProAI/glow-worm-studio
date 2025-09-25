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
          {/* Subtle Grid Background */}
          <div className="fixed inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Subtle Gradient Overlay */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            <AuthProvider>
              {children}
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
