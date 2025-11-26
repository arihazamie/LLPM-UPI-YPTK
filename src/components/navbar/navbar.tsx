"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  BookOpen,
  Trophy,
  Lightbulb,
  Building2,
  Eye,
  Users,
  Crown,
  UserCheck,
  Newspaper,
  Video,
  Megaphone,
  FileText,
  Calendar,
  Heart,
  BookOpenCheck,
  Microscope,
  Settings,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserProfileModal } from "../userModal";
import { toast } from "sonner";

// Define the navigation links for the dropdowns
const aboutLinks = [
  { title: "Profil Lembaga", href: "/tentang/profil-lembaga", icon: Building2 },
  { title: "Visi dan Misi", href: "/tentang/visi-misi", icon: Eye },
  {
    title: "Struktur Organisasi",
    href: "/tentang/struktur-organisasi",
    icon: Users,
  },
  { title: "Pimpinan", href: "/tentang/pimpinan", icon: Crown },
  { title: "Tim LPPM", href: "/tentang/tim", icon: UserCheck },
];

const beritaLinks = [
  { title: "Berita", href: "/berita/berita", icon: Newspaper },
  { title: "Webinar", href: "/berita/webinar", icon: Video },
  { title: "Pengumuman", href: "/berita/pengumuman", icon: Megaphone },
  { title: "Artikel", href: "/berita/artikel", icon: FileText },
  { title: "Agenda LPPM", href: "/berita/agenda", icon: Calendar },
];

const simlitLinks = [
  {
    title: "Pengabdian",
    href: "/simlit/pengabdian",
    icon: Heart,
  },
  {
    title: "Penelitian",
    href: "/simlit/penelitian",
    icon: BookOpenCheck,
  },
];

const layananLinks = [
  { title: "PLP", href: "/layanan/plp", icon: Microscope },
  { title: "PPJS", href: "/layanan/ppjs", icon: Settings },
  { title: "PKM", href: "/layanan/pkm", icon: BookOpen, dosenOnly: true },
  {
    title: "Penelitian",
    href: "/layanan/penelitian",
    icon: BookOpenCheck,
    dosenOnly: true,
  },
  {
    title: "Prototype",
    href: "/layanan/prototype",
    icon: Lightbulb,
    dosenOnly: true,
  },
  {
    title: "Prestasi",
    href: "/layanan/prestasi",
    icon: Trophy,
    dosenOnly: true,
  },
  {
    title: "Artikel",
    href: "/layanan/artikel",
    icon: FileText,
    dosenOnly: true,
  },
];

// Custom Dropdown Component (without shadcn/ui)
const CustomDropdown = ({
  title,
  children,
  triggerOnHover = false,
  className = "",
  onLinkClick,
  mobileMode = false,
}: {
  title: string;
  children: React.ReactNode;
  triggerOnHover?: boolean;
  className?: string;
  onLinkClick?: () => void;
  mobileMode?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (!mobileMode && (!triggerOnHover || !isDesktop)) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerOnHover, isDesktop, mobileMode]);

  const openDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div
      className={`relative ${mobileMode ? "w-full" : ""}`}
      ref={dropdownRef}
      onMouseEnter={triggerOnHover && isDesktop ? openDropdown : undefined}
      onMouseLeave={triggerOnHover && isDesktop ? closeDropdown : undefined}>
      <button
        onClick={
          mobileMode
            ? toggleDropdown
            : triggerOnHover && isDesktop
            ? undefined
            : toggleDropdown
        }
        className={`flex items-center gap-1 px-4 py-2.5 xl:text-[14px] 2xl:text-lg rounded-full text-black hover:bg-white/20 hover:backdrop-blur-sm focus:outline-none transition-all duration-300 font-medium ${className} ${
          mobileMode ? "text-gray-800 hover:bg-gray-100/80" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}>
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`${
            mobileMode
              ? "relative mt-2 w-full rounded-xl bg-white/80 backdrop-blur-sm p-3 border border-gray-200 shadow-lg"
              : "absolute top-full left-0 mt-2 w-52 rounded-xl shadow-2xl bg-white/80 backdrop-blur-md ring-1 ring-black/10 text-black focus:outline-none z-10 border border-white/20"
          } overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200`}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === Link) {
              const element = child as React.ReactElement<{
                className?: string;
                onClick?: () => void;
              }>;

              return React.cloneElement(element, {
                onClick: () => {
                  setIsOpen(false);
                  if (onLinkClick) onLinkClick();
                },
                className: `${element.props.className ?? ""} ${
                  mobileMode ? "text-gray-800 hover:bg-gray-100/80" : ""
                }`,
              });
            }

            return child;
          })}
        </div>
      )}
    </div>
  );
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const role = session?.user?.role || "";

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const getFilteredLayananLinks = () => {
    if (role === "DOSEN") {
      return layananLinks;
    }
    return layananLinks.filter((link) => !link.dosenOnly);
  };

  return (
    <nav className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 md:px-8 md:py-5 lg:px-12 rounded-[32px] bg-white/20 backdrop-blur-xl shadow-xl border border-white/30 mx-auto my-4 w-[calc(100%-40px)] md:w-[calc(100%-80px)] transition-all duration-300 hover:shadow-2xl">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative rounded-full flex items-center justify-center gap-3 md:gap-4">
          <div className="relative group">
            <Image
              src="/yptk.png"
              alt="LPPM Logo"
              width={50}
              height={50}
              className="object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="relative group">
            <Image
              src="/logo.png"
              alt="LPPM Logo"
              width={50}
              height={50}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="relative group">
            <Image
              src="/tut_wuri.png"
              alt="LPPM Logo"
              width={50}
              height={50}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="relative group">
            <Image
              src="/kampus_berdampak.png"
              alt="LPPM Logo"
              width={50}
              height={50}
              className="object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 xl:text-[14px] 2xl:text-lg rounded-full text-gray-800 font-semibold hover:bg-white/20 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300">
          <Home className="h-4 w-4" />
          Beranda
        </Link>
        <CustomDropdown
          title="Tentang LPPM"
          triggerOnHover={true}>
          {aboutLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors duration-200 font-medium">
                <IconComponent className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </CustomDropdown>
        <CustomDropdown
          title="Informasi"
          triggerOnHover={true}>
          {beritaLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors duration-200 font-medium">
                <IconComponent className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </CustomDropdown>
        <CustomDropdown
          title="Layanan"
          triggerOnHover={true}>
          {getFilteredLayananLinks().map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors duration-200 font-medium">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {link.title}
              </Link>
            );
          })}
        </CustomDropdown>
        <CustomDropdown
          title="SIMLIT"
          triggerOnHover={true}>
          {simlitLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors duration-200 font-medium">
                <IconComponent className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </CustomDropdown>
      </div>

      {/* Desktop Login/Dashboard/Logout Button */}
      <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {role === "ADMIN" && (
              <Link
                href={`/dashboard/${role.toLowerCase()}`}
                className="flex items-center xl:px-4 xl:py-2.5 2xl:px-5 2xl:py-2 gap-2 xl:text-[12px] 2xl:text-lg bg-white rounded-2xl drop-shadow-lg hover:drop-shadow-2xl">
                Dashboard
              </Link>
            )}
            {role === "DOSEN" && (
              <UserProfileModal
                user={{
                  name: session?.user?.name || "-",
                  email: session?.user?.email || "-",
                  role: session?.user?.role || "-",
                }}
                onLogout={() => {
                  toast.success("Logout berhasil");
                }}
              />
            )}
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center xl:px-4 xl:py-2.5 2xl:px-5 2xl:py-2 gap-2 xl:text-[12px] 2xl:text-lg bg-white rounded-2xl drop-shadow-lg hover:drop-shadow-2xl">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/90 transform hover:scale-110"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open mobile menu">
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col mt-64 items-center justify-center p-4 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Close Button - Fixed Position */}
          <button
            className="fixed top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white transform hover:scale-110 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu">
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center gap-4 w-full max-w-sm bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/30 relative z-10 mt-16 min-h-[80vh] max-h-[80vh] overflow-y-auto">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 py-2 transform hover:scale-105"
              onClick={handleMobileLinkClick}>
              <Home className="h-5 w-5" />
              Beranda
            </Link>
            <CustomDropdown
              title="Tentang LPPM"
              mobileMode={true}
              className="w-full justify-center text-lg py-2 text-gray-800"
              onLinkClick={handleMobileLinkClick}>
              {aboutLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-all duration-200 font-medium">
                    <IconComponent className="h-4 w-4" />
                    {link.title}
                  </Link>
                );
              })}
            </CustomDropdown>
            <CustomDropdown
              title="Info & Berita"
              mobileMode={true}
              className="w-full justify-center text-lg py-2 text-gray-800"
              onLinkClick={handleMobileLinkClick}>
              {beritaLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-all duration-200 font-medium">
                    <IconComponent className="h-4 w-4" />
                    {link.title}
                  </Link>
                );
              })}
            </CustomDropdown>
            <CustomDropdown
              title="Layanan"
              mobileMode={true}
              className="w-full justify-center text-lg py-2 text-gray-800"
              onLinkClick={handleMobileLinkClick}>
              {getFilteredLayananLinks().map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100/80 rounded-lg transition-all duration-200 font-medium">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {link.title}
                  </Link>
                );
              })}
            </CustomDropdown>
            {isLoggedIn ? (
              <>
                <Link
                  href={`/dashboard/${role.toLowerCase()}`}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-gray-800 font-semibold shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 w-full justify-center transform hover:scale-105 border border-gray-200 mt-4"
                  onClick={handleMobileLinkClick}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    handleMobileLinkClick();
                  }}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 w-full justify-center transform hover:scale-105 mt-2">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-gray-800 font-semibold shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 w-full justify-center transform hover:scale-105 border border-gray-200 mt-4"
                onClick={handleMobileLinkClick}>
                <LogIn className="h-5 w-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
