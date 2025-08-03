import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, ArrowUpRight } from "lucide-react";

export function Footer() {
  // Changed from export default function to export function
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.1),transparent_50%)]"></div>
      </div>
      <div className="relative container mx-auto px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl p-3 shadow-2xl">
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
                <h3 className="text-3xl font-black bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  LPPM
                </h3>
                <p className="text-gray-400 font-semibold">UPI YPTK Padang</p>
              </div>
            </div>
            <div className="flex space-x-4">
              {[
                {
                  Icon: Instagram,
                  href: "https://instagram.com/upiyptk_padang",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-500 transition-all duration-300 hover:scale-110">
                  <social.Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          {/* Quick Links for UPI YPTK Padang */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-red-400">
              UPI YPTK Padang
            </h4>
            <ul className="space-y-4">
              {[
                { name: "E-Learning", href: "http://elearning.upiyptk.ac.id/" },
                { name: "E-Lib", href: "http://elib.upiyptk.ac.id/" },
                { name: "SISFO", href: "https://sisfo.upiyptk.ac.id/" },
                { name: "SPMB", href: "https://spmb.upiyptk.ac.id/" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer">
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-yellow-400">Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Alamat</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Jl. Raya Lubuk Begalung Padang, INDONESIA 25163
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Telepon</p>
                  <p className="text-gray-400">+62 821 392 980</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Email</p>
                  <p className="text-gray-400">admin@upiyptk.ac.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              © 2025 LPPM UPI YPTK Padang. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
