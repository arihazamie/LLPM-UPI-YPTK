"use client";
import { useSidebar } from "@/context/SidebarContext";
import HomeTab from "@/components/dashboard/admin/tabs/HomeTab";
import ArtikelTab from "@/components/dashboard/admin/tabs/ArtikelTab";
import BeritaTab from "@/components/dashboard/admin/tabs/BeritaTab";
import PengumumanTab from "@/components/dashboard/admin/tabs/PengumumanTab";
import AgendaTab from "@/components/dashboard/admin/tabs/AgendaTab";
import WebinarTab from "@/components/dashboard/admin/tabs/WebinarTab";
import ProfileTab from "@/components/dashboard/admin/tabs/ProfileTab";

export default function TabContent() {
  const { activeTab } = useSidebar();

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "artikel":
        return <ArtikelTab />;
      case "berita":
        return <BeritaTab />;
      case "pengumuman":
        return <PengumumanTab />;
      case "agenda":
        return <AgendaTab />;
      case "webinar":
        return <WebinarTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  return <div>{renderTabContent()}</div>;
}
