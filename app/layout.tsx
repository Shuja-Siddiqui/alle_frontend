import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "../contexts/Providers";
import { GlobalLoader } from "../components/GlobalLoader";
import { ToastContainer } from "../components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zentu.io"),
  title: {
    default: "Zentu",
    template: "%s | Zentu",
  },
  description:
    "Zentu is an adaptive literacy platform that helps students build real reading skills through structured phonics practice, missions, and mastery checks.",
  openGraph: {
    title: "Zentu",
    description:
      "Build real reading skills with adaptive phonics missions, guided practice, and mastery checks.",
    url: "https://zentu.io",
    siteName: "Zentu",
    type: "website",
    images: [
      {
        url: "/assets/background.png",
        width: 1200,
        height: 630,
        alt: "Zentu - Adaptive literacy learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentu",
    description:
      "Build real reading skills with adaptive phonics missions, guided practice, and mastery checks.",
    images: ["/assets/background.png"],
  },
  icons: {
    icon: "/assets/icons/others/circle_badge.png",
    shortcut: "/assets/icons/others/circle_badge.png",
    apple: "/assets/icons/others/circle_badge.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
        style={{
          background:
            "linear-gradient(120.56deg, #1D2948 -2.28%, #141D33 21.31%, #0F1628 33.91%, #20082A 92.75%)",
        }}
      >
        <Providers>
          <GlobalLoader />
          <ToastContainer />
          <div className="flex min-h-screen w-full flex-col items-center">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
