import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/crypto/PriceTicker";
import "@/styles/globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoNews VN — Tin tức crypto nhanh nhất",
  description: "Tổng hợp tin tức crypto, giá coin, airdrop cập nhật liên tục",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-950 text-gray-100`}>
        <Providers>
          <PriceTicker />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
            © 2025 CryptoNews VN — Tin tức crypto nhanh nhất Việt Nam
          </footer>
        </Providers>
      </body>
    </html>
  );
}
