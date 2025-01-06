import './styles/globals.css'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify CLI | Terminal Control for Spotify",
  description: "Steuere Spotify direkt aus deinem Terminal - Ein elegantes CLI-Tool für Spotify",
  keywords: "spotify, cli, terminal, music, control, linux, windows",
  authors: [{ name: "Chaosly" }],
  openGraph: {
    title: "Spotify CLI",
    description: "Steuere Spotify direkt aus deinem Terminal",
    images: [{ url: "/og-image.png" }],
  },
  icons: {
    icon: "/favicon.ico",
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
      </body>
    </html>
  );
}
