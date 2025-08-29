import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import AdminLayout from "@/components/dashboard/admin/AdminLayout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Dashboard with sidebar navigation",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <SidebarProvider>
          <AdminLayout>{children}</AdminLayout>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
