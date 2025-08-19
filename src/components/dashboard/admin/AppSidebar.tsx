"use client";
import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import {
  UserIcon,
  ArticleIcon,
  BellIcon,
  HomeIcon,
  CalendarIcon,
  CameraIcon,
  MonitorIcon,
} from "@/components/dashboard/admin/icons/icon";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  tabKey?: string;
  subItems?: { name: string; tabKey: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <HomeIcon />,
    name: "Home",
    tabKey: "home",
  },
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
  {
    icon: <UserIcon />,
    name: "Profile",
    tabKey: "profile",
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    activeTab,
    setActiveTab,
    setIsMobileOpen,
  } = useSidebar();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`group relative flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
                ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:text-red-600"
                }
                ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}>
              <span
                className={`flex items-center justify-center w-6 h-6 transition-all duration-200
                  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "text-white"
                      : "text-gray-500 group-hover:text-red-600"
                  }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="ml-3 font-medium transition-all duration-200">
                  {nav.name}
                </span>
              )}
              {openSubmenu?.type === menuType &&
                openSubmenu?.index === index && (
                  <div className="absolute right-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
            </button>
          ) : (
            nav.tabKey && (
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
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:text-red-600 hover:transform hover:scale-[1.01]"
                  }`}>
                <span
                  className={`flex items-center justify-center w-6 h-6 transition-all duration-200
                    ${
                      isActive(nav.tabKey)
                        ? "text-white"
                        : "text-gray-500 group-hover:text-red-600"
                    }`}>
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
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}>
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <button
                      onClick={() => {
                        setActiveTab(subItem.tabKey);
                        if (isMobileOpen) {
                          setIsMobileOpen(false);
                        }
                      }}
                      className={`group flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${
                          isActive(subItem.tabKey)
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium shadow-md"
                            : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-700"
                        }`}>
                      <span>{subItem.name}</span>
                      <span className="flex items-center gap-1">
                        {subItem.new && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            pro
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (tabKey: string) => tabKey === activeTab,
    [activeTab]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.tabKey)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [activeTab, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
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
          <div className="space-y-2">
            {(isExpanded || isHovered || isMobileOpen) && (
              <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu Utama
              </h2>
            )}
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>

      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="px-4 py-4 border-t border-gray-200/50">
          <div className="text-center">
            <p className="text-xs text-gray-400">LPPM Admin Dashboard</p>
            <p className="text-xs text-gray-300 mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
