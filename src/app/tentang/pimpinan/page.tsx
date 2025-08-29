"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Crown,
  Sparkles,
  GraduationCap,
  Users,
  Star,
  Award,
  Building2,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PimpinanPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const leaders = [
    {
      name: "Assoc. Prof. Dr. Agung Ramadhanu, S.Kom, M.Kom, MTA, CM.NLP",
      position: "Kepala LPPM",
      faculty: "Fakultas Ilmu Komputer",
      image: "/professional-academic-leader.png",
      gradient: "from-red-600 to-red-700",
      icon: Crown,
    },
    {
      name: "Halifa Hendri, S.Pd, M.Kom",
      position: "Wakil Ka. LPPM Bidang Penelitian",
      faculty: "Fakultas Ilmu Komputer",
      image: "/research-coordinator.png",
      gradient: "from-blue-600 to-blue-700",
      icon: BookOpen,
    },
    {
      name: "Ai Elis Karlinda, SE, MM",
      position: "Wakil Ka. LPPM Bidang PkM",
      faculty: "Fakultas Ekonomi dan Bisnis",
      image: "/community-service-coordinator.png",
      gradient: "from-green-600 to-green-700",
      icon: Users,
    },
    {
      name: "Rahmatta Wulan Dari, S.Kom., M.Kom",
      position: "Wakil Ka. Bidang Kesekretariatan dan Laboratorium Riset",
      faculty: "Fakultas Ilmu Komputer",
      image: "/laboratory-coordinator.png",
      gradient: "from-purple-600 to-purple-700",
      icon: Building2,
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero Section with Updated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-red-500 to-yellow-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-400/10 to-yellow-400/10 rounded-full blur-3xl animate-spin"
              style={{ animationDuration: "20s" }}></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-300/50 rounded-full animate-ping delay-500"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 text-center z-10">
          <div className="inline-flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-full px-6 py-3 text-white/95 text-sm font-bold mb-8 border border-white/30 shadow-xl transform hover:scale-105 transition-all duration-300">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>Kepemimpinan</span>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <span>Dedikasi</span>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <span>Visi</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-6">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Pimpinan
            </span>
            <br />
            <span className="text-white/95 text-2xl md:text-3xl lg:text-4xl drop-shadow-xl">
              LPPM UPI YPTK
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Mengenal para pemimpin visioner yang menggerakkan transformasi
            penelitian dan pengabdian masyarakat di UPI YPTK Padang
          </p>

          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>Inovasi Berkelanjutan</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
              <Award className="h-4 w-4 text-yellow-300" />
              <span>Kualitas Terdepan</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center relative backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-white to-yellow-300 rounded-full mt-1.5 animate-bounce"></div>
          </div>
          <p className="text-white/70 text-xs mt-1 font-medium">Scroll</p>
        </div>
      </section>

      {/* Leadership Cards Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border border-red-200/50 rounded-full px-6 py-3 text-red-700 text-sm font-bold mb-6 shadow-lg">
              <Crown className="h-4 w-4 text-red-600" />
              <span>Kepemimpinan Kami</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              Struktur
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {" "}
                Kepemimpinan
              </span>
            </h2>

            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              LPPM UPI YPTK Padang dipimpin oleh akademisi berpengalaman dengan
              dedikasi tinggi dalam mengembangkan penelitian dan pengabdian
              masyarakat yang berkualitas dan berdampak
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* Kepala LPPM - Single Card */}
            <div className="mb-8">
              <div className="max-w-2xl mx-auto">
                {leaders.slice(0, 1).map((leader, index) => {
                  const IconComponent = leader.icon;
                  return (
                    <Card
                      key={index}
                      className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white/95 backdrop-blur-xl transform hover:scale-[1.02]">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${leader.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}></div>

                      <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>

                      <CardContent className="relative p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                          <div className="relative flex-shrink-0">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                              <Image
                                src={leader.image || "/placeholder.svg"}
                                alt={leader.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${leader.gradient} rounded-lg flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300`}>
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <CardTitle className="text-lg md:text-xl font-black text-gray-900 group-hover:text-red-700 transition-colors mb-2 leading-tight">
                              {leader.name}
                            </CardTitle>

                            <div className="space-y-2">
                              <div
                                className={`inline-block px-3 py-1.5 bg-gradient-to-r ${leader.gradient} text-white text-xs font-bold rounded-full shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
                                {leader.position}
                              </div>

                              <CardDescription className="text-gray-600 text-sm leading-relaxed font-medium">
                                {leader.faculty}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Vice Leaders - Grid */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wakil Kepala LPPM
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaders.slice(1, 4).map((leader, index) => {
                  const IconComponent = leader.icon;
                  return (
                    <Card
                      key={index}
                      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/95 backdrop-blur-xl transform hover:scale-105">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${leader.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}></div>

                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent opacity-50"></div>

                      <CardContent className="relative p-5">
                        <div className="text-center space-y-3">
                          <div className="relative mx-auto w-fit">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto">
                              <Image
                                src={leader.image || "/placeholder.svg"}
                                alt={leader.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${leader.gradient} rounded-md flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300`}>
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <CardTitle className="text-sm font-black text-gray-900 group-hover:text-red-700 transition-colors leading-tight">
                              {leader.name}
                            </CardTitle>

                            <div
                              className={`inline-block px-2 py-1 bg-gradient-to-r ${leader.gradient} text-white text-xs font-bold rounded-full shadow-sm transform group-hover:scale-105 transition-transform duration-300`}>
                              {leader.position}
                            </div>

                            <CardDescription className="text-gray-600 text-xs leading-relaxed font-medium">
                              {leader.faculty}
                            </CardDescription>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-gradient-to-r from-red-600/5 via-orange-500/5 to-yellow-500/5">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
              Nilai-Nilai Kepemimpinan
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">
                Integritas
              </h4>
              <p className="text-gray-600 text-sm">
                Kepemimpinan yang jujur, transparan, dan bertanggung jawab
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">
                Inovasi
              </h4>
              <p className="text-gray-600 text-sm">
                Mendorong kreativitas dan pemikiran maju dalam setiap inisiatif
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">
                Kolaborasi
              </h4>
              <p className="text-gray-600 text-sm">
                Membangun sinergi untuk mencapai tujuan bersama
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
