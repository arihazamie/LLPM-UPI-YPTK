"use client"

import { useSidebar } from "@/context/SidebarContext"

export default function Backdrop() {
  const { isMobileOpen, setIsMobileOpen } = useSidebar()

  if (!isMobileOpen) return null

  return <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
}
