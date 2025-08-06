import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../style/index.css";
import { ClientToaster } from "@/components/ClientToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiqi AI Tools",
  description: "Discover our collection of intelligent AI tools designed to boost your productivity, creativity, and efficiency. Each kit is crafted with cutting-edge technology to solve real-world challenges.",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
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
        {children}
        <ClientToaster />
      </body>
    </html>
  );
}
