"use client";
import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        isHovered,
        setIsHovered,
        toggleSidebar,
        toggleMobileSidebar,
        activeTab,
        setActiveTab,
        setIsMobileOpen,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};
