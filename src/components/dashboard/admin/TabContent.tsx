"use client";

import { useSidebar } from "@/context/SidebarContext"
import HomeTab from "./tabs/HomeTab"
import ArtikelTab from "./tabs/ArtikelTab"
import BeritaTab from "./tabs/BeritaTab"
import PengumumanTab from "./tabs/PengumumanTab"
import AgendaTab from "./tabs/AgendaTab"
import WebinarTab from "./tabs/WebinarTab"
import PKMTab from "./tabs/PKMTab"
import ProfileTab from "./tabs/ProfileTab"
import UsersTab from "./tabs/UsersTab"
import PenelitianReviewTab from "./tabs/PenelitianReviewTab"

export default function TabContent() {
  const { activeTab } = useSidebar()

  console.log("Current activeTab:", activeTab); // Debug log

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />
      case "artikel":
        return <ArtikelTab />
      case "berita":
        return <BeritaTab />
      case "pengumuman":
        return <PengumumanTab />
      case "agenda":
        return <AgendaTab />
      case "webinar":
        return <WebinarTab />
      case "pkm":
        return <PKMTab />
      case "penelitian-review":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Review Penelitian</h1>
            <p>Tab penelitian berhasil dimuat!</p>
            <PenelitianReviewTab />
          </div>
        )
      case "users":
        return <UsersTab />
      case "profile":
        return <ProfileTab />
      default:
        return <HomeTab />
    }
  }

  return <div>{renderTabContent()}</div>
}
