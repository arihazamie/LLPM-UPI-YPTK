"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, LogIn, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Define the navigation links for the dropdowns
const aboutLinks = [
  { title: "Profil Lembaga", href: "/tentang/profil-lembaga" },
  { title: "Visi dan Misi", href: "/tentang/visi-misi" },
  { title: "Struktur Organisasi", href: "/tentang/struktur-organisasi" },
  { title: "Pimpinan", href: "/tentang/pimpinan" },
  { title: "Staff LPPM", href: "/tentang/staf" },
];

const beritaLinks = [
  { title: "Berita", href: "/berita/berita" },
  { title: "Webinar", href: "/berita/webinar" },
  { title: "Pengumuman", href: "/berita/pengumuman" },
  { title: "Artikel", href: "/berita/artikel" },
  { title: "Agenda LPPM", href: "/berita/agenda" },
];

const pengabdianLinks = [
  { title: "Pusat Pengabdian", href: "/pengabdian/pusat-pengabdian" },
  { title: "Skema Pengabdian", href: "/pengabdian/skema-pengabdian" },
  { title: "UPI YPTK HUB", href: "/pengabdian/upi-yptk-hub" },
];

const penelitianLinks = [
  { title: "Pusat Penelitian", href: "/penelitian/pusat-penelitian" },
  { title: "Skema Penelitian", href: "/penelitian/skema-penelitian" },
  {
    title: "Rencana Induk Penelitian",
    href: "/penelitian/rencana-induk-penelitian",
  },
  { title: "Buku Panduan", href: "/penelitian/buku-panduan" },
  { title: "Pusat Studi", href: "/penelitian/pusat-studi" },
];

const jurnalLinks = [
  { title: "PLP", href: "/jurnal/plp" },
  { title: "PPJS", href: "/jurnal/ppjs" },
  {
    title: "Daftar Jurnal",
    href: "/jurnal/daftar-jurnal",
  },
];

// Custom Dropdown Component (without shadcn/ui)
const CustomDropdown = ({
  title,
  children,
  triggerOnHover = false,
  className = "",
  onLinkClick,
  mobileMode = false, // New prop for mobile behavior
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

    // Only add click outside listener if not in mobileMode or if not hover-triggered on desktop
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
        className={`flex items-center gap-1 px-3 py-2 xl:text-[14px] 2xl:text-lg rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors ${className} ${
          mobileMode ? "text-white hover:bg-white/20" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}>
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`${
            mobileMode
              ? "relative mt-2 w-full rounded-lg bg-white/10 p-2" // Inline for mobile
              : "absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" // Absolute for desktop
          } overflow-hidden`}>
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
                  mobileMode ? "text-white hover:bg-white/20" : ""
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

  return (
    <nav className="sticky top-4 z-10 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 lg:px-10 rounded-[32px] bg-white/30 backdrop-blur-sm shadow-lg mx-auto my-4 w-[calc(100%-80px)]">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative w-12 h-12 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 rounded-full bg-white flex items-center justify-center shadow-md">
          <Image
            src="/logo.png"
            alt="LPPM Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="xl:text-md 2xl:text-2xl font-bold text-yellow-600 leading-none">
            LPPM
          </h1>
          <p className="text-gray-700 text-xs xl:text-md 2xl:text-lg mt-1">
            UPI YPTK Padang
          </p>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className="px-3 py-2 xl:text-[14px] 2xl:text-lg rounded-full  text-gray-800 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
          Beranda
        </Link>
        <CustomDropdown
          title="Tentang LPPM"
          triggerOnHover={true}>
          {aboutLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
              {link.title}
            </Link>
          ))}
        </CustomDropdown>
        <CustomDropdown
          title="Info & Berita"
          triggerOnHover={true}>
          {beritaLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
              {link.title}
            </Link>
          ))}
        </CustomDropdown>
        <CustomDropdown
          title="Penelitian"
          triggerOnHover={true}>
          {penelitianLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
              {link.title}
            </Link>
          ))}
        </CustomDropdown>
        <CustomDropdown
          title="Pengabdian"
          triggerOnHover={true}>
          {pengabdianLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
              {link.title}
            </Link>
          ))}
        </CustomDropdown>
        <CustomDropdown
          title="Jurnal"
          triggerOnHover={true}>
          {jurnalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
              {link.title}
            </Link>
          ))}
        </CustomDropdown>
      </div>

      {/* Desktop Login/Dashboard/Logout Button */}
      <div className="hidden md:flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href={`/dashboard/${role.toLowerCase()}`}
              className="flex items-center xl:px-3 xl:py-2 2xl:px-4 2xl:py-2 gap-2 xl:text-[12px] 2xl:text-lg rounded-full bg-yellow-500 text-white hover:bg-yellow-600 font-bold transition-all">
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center xl:px-4 xl:py-2 2xl:px-4 2xl:py-2 gap-2 xl:text-[12px] 2xl:text-lg rounded-full bg-red-500 text-white hover:bg-red-600 font-bold transition-all">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center xl:px-3 xl:py-1 2xl:px-4 2xl:py-2 gap-2 xl:text-[12px] 2xl:text-lg rounded-full bg-yellow-500 text-white hover:bg-yellow-600 font-bold transition-all">
            <LogIn className="h-5 w-5" />
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-full bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open mobile menu">
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0  text-white z-50 flex flex-col items-center p-4 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}>
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close mobile menu">
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center gap-6 w-full max-w-sm pt-24 bg-gradient-to-br from-red-500 to-orange-500 p-14 rounded-2xl">
          {" "}
          {/* Added overflow-y-auto and pb-16 */}
          <Link
            href="/"
            className="text-md font-medium text-white hover:text-yellow-300 transition-colors py-2"
            onClick={handleMobileLinkClick}>
            Beranda
          </Link>
          <CustomDropdown
            title="Tentang LPPM"
            mobileMode={true}
            className="w-full justify-center text-md py-1"
            onLinkClick={handleMobileLinkClick}>
            {aboutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-md text-white hover:bg-white/20 rounded-md">
                {link.title}
              </Link>
            ))}
          </CustomDropdown>
          <CustomDropdown
            title="Info & Berita"
            mobileMode={true}
            className="w-full justify-center text-md py-2"
            onLinkClick={handleMobileLinkClick}>
            {beritaLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-md text-white hover:bg-white/20 rounded-md">
                {link.title}
              </Link>
            ))}
          </CustomDropdown>
          <CustomDropdown
            title="Penelitian"
            mobileMode={true}
            className="w-full justify-center text-md py-2"
            onLinkClick={handleMobileLinkClick}>
            {penelitianLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-md text-white hover:bg-white/20 rounded-md">
                {link.title}
              </Link>
            ))}
          </CustomDropdown>
          <CustomDropdown
            title="Pengabdian"
            mobileMode={true}
            className="w-full justify-center text-md py-2"
            onLinkClick={handleMobileLinkClick}>
            {pengabdianLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-md text-white hover:bg-white/20 rounded-md">
                {link.title}
              </Link>
            ))}
          </CustomDropdown>
          <CustomDropdown
            title="Jurnal"
            mobileMode={true}
            className="w-full justify-center text-md py-2"
            onLinkClick={handleMobileLinkClick}>
            {jurnalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-md text-white hover:bg-white/20 rounded-md">
                {link.title}
              </Link>
            ))}
          </CustomDropdown>
          {isLoggedIn ? (
            <>
              <Link
                href={`/dashboard/${role.toLowerCase()}`}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all w-full justify-center"
                onClick={handleMobileLinkClick}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  handleMobileLinkClick();
                }}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all w-full justify-center">
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all w-full justify-center"
              onClick={handleMobileLinkClick}>
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
