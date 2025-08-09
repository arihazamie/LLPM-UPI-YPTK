// src/components/ClientWrapper.tsx
"use client";

import { ScrollToTop } from "@/components/scroll-to-top";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import SessionWrapper from "./SessionWrapper";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 xl:-mt-[138px] 2xl:-mt-32">{children}</main>
      <Footer />
    </SessionWrapper>
  );
}
