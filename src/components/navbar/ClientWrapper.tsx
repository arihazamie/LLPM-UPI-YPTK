// src/components/ClientWrapper.tsx
"use client";

import { ScrollToTop } from "@/components/scroll-to-top";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";
import SessionWrapper from "./SessionWrapper";
import { usePathname } from "next/navigation";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Semua path yang ingin skip layout
  const hideLayoutOn = ["/dashboard/admin"];
  const shouldHide = hideLayoutOn.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) {
    // Halaman tanpa navbar/footer
    return <SessionWrapper>{children}</SessionWrapper>;
  }

  return (
    <SessionWrapper>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 -mt-28 xl:-mt-[138px] 2xl:-mt-32">
        {children}
      </main>
      <Footer />
    </SessionWrapper>
  );
}
