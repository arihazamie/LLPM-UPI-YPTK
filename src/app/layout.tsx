import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LPPM UPI YPTK Padang",
  description: "Lembaga Penelitian dan Pengabdian Masyarakat UPI YPTK Padang",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body className={inter.className}>
        <ScrollToTop />
        <div>
          <Navbar />
          <main className="flex-1 -mt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
