"use client";

import { Menu, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Data untuk dropdown "Tentang LPPM"
const aboutLinks = [
  { title: "Profil Lembaga", href: "/profil-lembaga" },
  { title: "Visi dan Misi", href: "/visi-misi" },
  { title: "Struktur Organisasi", href: "/struktur-organisasi" },
  { title: "Pimpinan", href: "/pimpinan" },
  { title: "Staff LPPM", href: "/staf" },
];

// Tambahkan data untuk dropdown "Info & Berita" di bawah `aboutLinks`
const infoBeritaLinks = [
  { title: "Berita", href: "/berita" },
  { title: "Info Webinar", href: "/info-webinar" },
  { title: "Pengumuman", href: "/pengumuman" },
  { title: "Konferensi", href: "/konferensi" },
  { title: "Artikel", href: "/artikel" },
  { title: "Agenda LPPM", href: "/agenda-lppm" },
];

export function Navbar() {
  return (
    <div className="sticky top-6 z-50 mx-15 px-15">
      <header className="container mx-auto flex h-16 items-center justify-between bg-gray-200/80 backdrop-blur-md shadow-2xl rounded-2xl px-10 border border-gray-300">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl blur opacity-50"></div>
            <div className="relative bg-white rounded-3xl p-1 shadow-2xl">
              <Image
                src="/logo.png"
                alt="UPI YPTK Padang Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              LPPM
            </h3>
            <p className="text-gray-800 font-semibold">UPI YPTK Padang</p>
          </div>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-400 focus:bg-gray-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-400 data-[state=open]:bg-gray-400 text-gray-800 hover:text-gray-900">
                  Beranda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Navigation Menu untuk Tentang LPPM */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100 data-[state=open]:bg-gray-100 text-gray-800 hover:text-gray-900">
                Tentang LPPM
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white/90 backdrop-blur-lg shadow-lg border border-gray-100 rounded-xl">
                <ul className="grid w-[200px] gap-3 p-4">
                  {aboutLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                          )}>
                          <div className="text-sm font-medium leading-none">
                            {link.title}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Pastikan untuk menambahkan ini di dalam <NavigationMenuList> */}
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100 data-[state=open]:bg-gray-100 text-gray-800 hover:text-gray-900">
                Info & Berita
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white/90 backdrop-blur-lg shadow-lg border border-gray-100 rounded-xl">
                <ul className="grid w-[200px] gap-3 p-4">
                  {infoBeritaLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                          )}>
                          <div className="text-sm font-medium leading-none">
                            {link.title}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right-aligned buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            asChild
            size="lg"
            className="h-10 px-6 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105">
            <Link
              href="/login"
              className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden">
              <Menu className="h-6 w-6 text-red-600" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-white/90 backdrop-blur-lg">
            <Link
              href="/"
              className="flex items-center gap-2 py-4">
              <Image
                src="/logo.png"
                alt="LPPM UPI YPTK Logo"
                width={40}
                height={40}
                quality={90}
              />
              <span className="text-lg font-bold text-red-600">
                LPPM UPI YPTK
              </span>
            </Link>
            <div className="grid gap-4 py-6">
              <Link
                href="/"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Beranda
              </Link>
              <Link
                href="/profil-lembaga"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Tentang LPPM
              </Link>
              <Link
                href="/berita"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Berita
              </Link>
              <Link
                href="/info-webinar"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Info Webinar
              </Link>
              <Link
                href="/pengumuman"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Pengumuman
              </Link>
              <Link
                href="/konferensi"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Konferensi
              </Link>
              <Link
                href="/artikel"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Artikel
              </Link>
              <Link
                href="/agenda-lppm"
                className="flex w-full items-center py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                Agenda LPPM
              </Link>
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all">
                <Link
                  href="/login"
                  className="flex items-center justify-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
