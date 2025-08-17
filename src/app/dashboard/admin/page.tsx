"use client";

import { useState } from "react";
import {
  Home,
  FileText,
  Newspaper,
  Megaphone,
  Calendar,
  Video,
  Menu,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeTab } from "@/components/dashboardAdmin/home-tab";
import { ArtikelTab } from "@/components/dashboardAdmin/artikel-tab";
import { BeritaTab } from "@/components/dashboardAdmin/berita-tab";
import { PengumumanTab } from "@/components/dashboardAdmin/pengumuman-tab";
import { AgendaTab } from "@/components/dashboardAdmin/agenda-tab";
import { WebinarTab } from "@/components/dashboardAdmin/webinar-tab";
import { ProfileTab } from "@/components/dashboardAdmin/profile-tab";
import Image from "next/image";
import Link from "next/link";

type TabType =
  | "home"
  | "artikel"
  | "berita"
  | "pengumuman"
  | "agenda"
  | "webinar"
  | "profile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveTab = () => {
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

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "artikel", label: "Artikel", icon: FileText },
    { id: "berita", label: "Berita", icon: Newspaper },
    { id: "pengumuman", label: "Pengumuman", icon: Megaphone },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "webinar", label: "Webinar", icon: Video },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-50`}>
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className={`flex items-center gap-3 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}>
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="UPI YPTK Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-playfair font-bold text-lg text-sidebar-foreground truncate">
                    LPPM
                  </h1>
                  <p className="text-sm text-muted-foreground truncate">
                    UPI YPTK
                  </p>
                </div>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0 z-10">
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : undefined}>
                  <Icon
                    size={20}
                    className="flex-shrink-0"
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}>
        <div className="flex-1 h-screen overflow-hidden">
          <div className="h-full p-6 overflow-y-auto custom-scrollbar">
            {renderActiveTab()}
          </div>
        </div>
      </div>

      {sidebarCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-4 left-4 z-40 bg-background border-2 shadow-lg hover:shadow-xl transition-all duration-200">
          <Menu size={20} />
        </Button>
      )}
    </div>
  );
}
