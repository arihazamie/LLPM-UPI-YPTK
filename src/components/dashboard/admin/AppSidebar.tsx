"use client";
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { signOut, useSession } from "next-auth/react";
import {
  UserIcon,
  ArticleIcon,
  BellIcon,
  HomeIcon,
  CalendarIcon,
  CameraIcon,
  MonitorIcon,
  PKMIcon,
  UsersIcon,
} from "@/components/dashboard/admin/icons/icon";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  tabKey?: string;
  subItems?: { name: string; tabKey: string; pro?: boolean; new?: boolean }[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        icon: <HomeIcon />,
        name: "Home",
        tabKey: "home",
      },
    ],
  },
  {
    title: "Konten Manajemen",
    items: [
      {
        icon: <ArticleIcon />,
        name: "Artikel",
        tabKey: "artikel",
      },
      {
        icon: <BellIcon />,
        name: "Berita",
        tabKey: "berita",
      },
      {
        icon: <CameraIcon />,
        name: "Pengumuman",
        tabKey: "pengumuman",
      },
      {
        icon: <CalendarIcon />,
        name: "Agenda",
        tabKey: "agenda",
      },
      {
        icon: <MonitorIcon />,
        name: "Webinar",
        tabKey: "webinar",
      },
    ],
  },
  {
    title: "Pengabdian",
    items: [
      {
        icon: <PKMIcon />,
        name: "PKM",
        tabKey: "pkm",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        icon: <UsersIcon />,
        name: "Manajemen Pengguna",
        tabKey: "users",
      },
      {
        icon: <UserIcon />,
        name: "Profile",
        tabKey: "profile",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { data: session } = useSession();
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    activeTab,
    setActiveTab,
    setIsMobileOpen,
  } = useSidebar();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const renderNavGroup = (group: NavGroup) => {
    const isGroupOpen = openGroups.has(group.title);
    
    return (
      <div key={group.title} className="space-y-2">
        {(isExpanded || isHovered || isMobileOpen) ? (
          <button
            onClick={() => handleGroupToggle(group.title)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-black uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
          >
            <span>{group.title}</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${
                isGroupOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ) : (
          // Show group indicator when collapsed
          <div className="flex justify-center py-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        )}
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isGroupOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } ${!isExpanded && !isHovered && !isMobileOpen ? "hidden" : ""}`}
        >
          <ul className="flex flex-col gap-2">
            {group.items.map((nav) => (
              <li key={nav.name}>
                {nav.tabKey && (
                  <button
                    onClick={() => {
                      setActiveTab(nav.tabKey!);
                      if (isMobileOpen) {
                        setIsMobileOpen(false);
                      }
                    }}
                    className={`group relative flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
                      ${
                        isActive(nav.tabKey)
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 transform scale-[1.02]"
                          : "text-black hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:text-red-600 hover:transform hover:scale-[1.01]"
                      }
                      ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                  >
                    <span
                      className={`flex items-center justify-center w-6 h-6 transition-all duration-200
                        ${
                          isActive(nav.tabKey)
                            ? "text-white"
                            : "text-black group-hover:text-red-600"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="ml-3 font-medium transition-all duration-200">
                        {nav.name}
                      </span>
                    )}
                    {isActive(nav.tabKey) && (
                      <div className="absolute right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["Dashboard"])); // Default open groups

  const isActive = useCallback(
    (tabKey: string) => tabKey === activeTab,
    [activeTab]
  );

  useEffect(() => {
    // Auto-open group that contains the active tab
    navGroups.forEach((group) => {
      const hasActiveTab = group.items.some((item) => 
        item.tabKey && isActive(item.tabKey)
      );
      if (hasActiveTab) {
        setOpenGroups((prev) => new Set([...prev, group.title]));
      }
    });
  }, [activeTab, isActive]);

  const handleGroupToggle = (groupTitle: string) => {
    setOpenGroups((prevOpenGroups) => {
      const newOpenGroups = new Set(prevOpenGroups);
      if (newOpenGroups.has(groupTitle)) {
        newOpenGroups.delete(groupTitle);
      } else {
        newOpenGroups.add(groupTitle);
      }
      return newOpenGroups;
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 shadow-xl
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div
        className={`py-6 px-4 border-b border-gray-200/50 ${
          !isExpanded && !isHovered
            ? "lg:flex lg:justify-center"
            : "flex justify-start"
        }`}>
        <button
          onClick={() => setActiveTab("home")}
          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 transition-all duration-200">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Logo UPI YPTK Padang"
              width={40}
              height={40}
              className="rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                UPI YPTK
              </span>
              <span className="text-xs text-gray-500 group-hover:text-yellow-600 transition-colors duration-200">
                Padang
              </span>
            </div>
          )}
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <nav>
          <div className="space-y-6">
            {navGroups.map((group) => renderNavGroup(group))}
          </div>
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-gray-200/50">
        {(isExpanded || isHovered || isMobileOpen) ? (
          <>
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-red-600">
                  {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{session?.user?.role?.toLowerCase()}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
            
            {/* Version Info */}
            <div className="text-center mt-4">
              <p className="text-xs text-black">LPPM Admin Dashboard</p>
              <p className="text-xs text-gray-600 mt-1">v1.0.0</p>
            </div>
          </>
        ) : (
          /* Collapsed view - just logout icon */
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
