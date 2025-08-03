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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Data untuk dropdown "Tentang LPPM"
const aboutLinks = [
  { title: "Profil Lembaga", href: "/profil-lembaga" },
  { title: "Visi dan Misi", href: "/visi-misi" },
  { title: "Struktur Organisasi", href: "/struktur-organisasi" },
  { title: "Pimpinan", href: "/pimpinan" },
  { title: "Staff LPPM", href: "/staf" },
];

// Tambahkan data untuk dropdown "Info & Berita"
// const infoBeritaLinks = [
//   { title: "Berita", href: "/berita" },
//   { title: "Info Webinar", href: "/info-webinar" },
//   { title: "Pengumuman", href: "/pengumuman" },
//   { title: "Konferensi", href: "/konferensi" },
//   { title: "Artikel", href: "/artikel" },
//   { title: "Agenda LPPM", href: "/agenda-lppm" },
// ];

export function Navbar() {
  return (
    <div className="sticky top-6 z-50 mx-5 px-0 md:mx-15 md:px-15">
      <header className="container mx-auto flex h-16 items-center justify-between bg-gray-200/80 backdrop-blur-md shadow-2xl rounded-2xl px-2 md:px-10 border border-gray-300">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 to-yellow-500 opacity-50 blur"></div>
            <div className="relative rounded-3xl bg-white p-1 shadow-2xl">
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
            <h3 className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-xl font-black text-transparent">
              LPPM
            </h3>
            <p className="font-semibold text-gray-800">UPI YPTK Padang</p>
          </div>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-400 hover:text-gray-900 focus:bg-gray-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-400 data-[state=open]:bg-gray-400">
                  Beranda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Navigation Menu untuk Tentang LPPM */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100 data-[state=open]:bg-gray-100">
                Tentang LPPM
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl border border-gray-100 bg-white/90 shadow-lg backdrop-blur-lg">
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
            {/* Navigation Menu for Info & Berita */}
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-white px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100 data-[state=open]:bg-gray-100">
                Info & Berita
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl border border-gray-100 bg-white/90 shadow-lg backdrop-blur-lg">
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
        <div className="hidden items-center space-x-2 md:flex">
          <Button
            asChild
            size="lg"
            className="h-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 px-6 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:from-red-700 hover:to-yellow-600 hover:shadow-lg">
            <Link
              href="/login"
              className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
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

              <Accordion
                type="single"
                collapsible
                className="w-full">
                <AccordionItem value="tentang-lppm">
                  <AccordionTrigger className="flex w-full items-center justify-between py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                    Tentang LPPM
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2 pl-4">
                      {aboutLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-1 text-base text-gray-700 hover:text-red-500">
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* <AccordionItem value="info-berita">
                  <AccordionTrigger className="flex w-full items-center justify-between py-2 text-lg font-semibold text-gray-800 hover:text-red-600">
                    Info & Berita
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2 pl-4">
                      {infoBeritaLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-1 text-base text-gray-700 hover:text-red-500">
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem> */}
              </Accordion>

              <Button
                asChild
                className="h-12 w-full rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 text-lg font-bold text-white shadow-md transition-all hover:from-red-700 hover:to-yellow-600 hover:shadow-lg">
                <Link
                  href="/login"
                  className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" />
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
