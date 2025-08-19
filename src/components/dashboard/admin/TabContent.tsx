import { useSidebar } from "@/context/SidebarContext"
import HomeTab from "./tabs/HomeTab"
import ArtikelTab from "./tabs/ArtikelTab"
import BeritaTab from "./tabs/BeritaTab"
import PengumumanTab from "./tabs/PengumumanTab"
import AgendaTab from "./tabs/AgendaTab"
import WebinarTab from "./tabs/WebinarTab"
import ProfileTab from "./tabs/ProfileTab"

export default function TabContent() {
  const { activeTab } = useSidebar()

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
      case "profile":
        return <ProfileTab />
      default:
        return <HomeTab />
    }
  }

  return <div>{renderTabContent()}</div>
}
