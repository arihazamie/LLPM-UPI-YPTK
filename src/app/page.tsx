"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  FileText,
  Trophy,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar,
  Globe,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StatsResponse {
  totals: {
    publikasi: {
      all: number;
      thisYear: number;
      byKategori: {
        scopus: { all: number; thisYear: number };
        sinta: { all: number; thisYear: number };
      };
    };
    buku: { all: number; thisYear: number };
    hki: { all: number; thisYear: number };
    pkm: { all: number; thisYear: number };
    prestasi: { all: number; thisYear: number };
    all: { totalAll: number; totalThisYear: number };
  };
}

const Home = () => {
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data: StatsResponse = await response.json();
        setStatsData(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = statsData?.totals;
  const currentYear = new Date().getFullYear();

  const displayValue = (
    value: number | string | null | undefined,
    isLoading: boolean,
    hasError: boolean
  ): string | number => {
    if (isLoading) return "...";
    if (hasError) return "-";
    if (value === 0 || value === null || value === undefined)
      return "Belum ada data";
    return value;
  };

  return (
    <main className="flex-1">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
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

        <div className="relative container mx-auto px-6 py-32">
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-slate-700 text-sm font-medium border border-white/20 shadow-lg">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span>Inovasi • Penelitian • Pengabdian</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                  Lembaga Penelitian
                  <br />
                  <span className="text-yellow-100">
                    & Pengabdian Masyarakat
                  </span>
                  <br />
                  <span className="text-white/90 text-3xl md:text-4xl lg:text-5xl font-medium">
                    UPI YPTK Padang
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  Membangun masa depan melalui penelitian inovatif dan
                  pengabdian masyarakat yang berkelanjutan untuk kemajuan
                  bangsa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-white hover:bg-white/90 text-red-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <Link
                    href="/tentang/profil-lembaga"
                    className="flex items-center">
                    Jelajahi Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2 text-slate-600 text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              <span>Statistik LPPM UPI YPTK Padang</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pencapaian Terkini
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Data komprehensif pencapaian LPPM UPI YPTK tahun {currentYear}{" "}
              dalam bidang penelitian, publikasi, dan pengabdian masyarakat.
            </p>
          </div>

          {/* Clean stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: FileText,
                title: "Publikasi",
                thisYear: displayValue(
                  stats?.publikasi?.thisYear,
                  loading,
                  error
                ),
                total: displayValue(stats?.publikasi?.all, loading, error),
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                description: "Karya ilmiah terpublikasi",
              },
              {
                icon: BookOpen,
                title: "Buku",
                thisYear: displayValue(stats?.buku?.thisYear, loading, error),
                total: displayValue(stats?.buku?.all, loading, error),
                color: "text-green-600",
                bgColor: "bg-green-50",
                description: "Buku referensi",
              },
              {
                icon: Lightbulb,
                title: "HKI",
                thisYear: displayValue(stats?.hki?.thisYear, loading, error),
                total: displayValue(stats?.hki?.all, loading, error),
                color: "text-purple-600",
                bgColor: "bg-purple-50",
                description: "Hak Kekayaan Intelektual",
              },
              {
                icon: Target,
                title: "PKM",
                thisYear: displayValue(stats?.pkm?.thisYear, loading, error),
                total: displayValue(stats?.pkm?.all, loading, error),
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                description: "Pengabdian Kepada Masyarakat",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-baseline space-x-2">
                    <h3
                      className={`font-bold text-slate-900 ${
                        stat.thisYear === "Belum ada data"
                          ? "text-sm"
                          : "text-2xl"
                      }`}>
                      {stat.thisYear}
                    </h3>
                    <span className="text-sm text-slate-500">
                      /{currentYear}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500">
                    <Globe className="h-3 w-3" />
                    <span
                      className={`${
                        stat.total === "Belum ada data" ? "text-xs" : "text-xs"
                      }`}>
                      Total: {stat.total}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-900 mb-1">
                  {stat.title}
                </h4>
                <p className="text-sm text-slate-600">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Detail Publikasi
              </h3>
              <p className="text-slate-600">
                Breakdown publikasi berdasarkan kategori jurnal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">SCOPUS</h4>
                    <p className="text-sm text-slate-600">
                      Jurnal terindeks SCOPUS
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tahun {currentYear}:</span>
                    <span
                      className={`font-bold text-red-600 ${
                        displayValue(
                          stats?.publikasi?.byKategori?.scopus?.thisYear,
                          loading,
                          error
                        ) === "Belum ada data"
                          ? "text-sm"
                          : "text-xl"
                      }`}>
                      {displayValue(
                        stats?.publikasi?.byKategori?.scopus?.thisYear,
                        loading,
                        error
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-semibold text-slate-900">
                      {displayValue(
                        stats?.publikasi?.byKategori?.scopus?.all,
                        loading,
                        error
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">SINTA</h4>
                    <p className="text-sm text-slate-600">
                      Jurnal terindeks SINTA
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tahun {currentYear}:</span>
                    <span
                      className={`font-bold text-yellow-600 ${
                        displayValue(
                          stats?.publikasi?.byKategori?.sinta?.thisYear,
                          loading,
                          error
                        ) === "Belum ada data"
                          ? "text-sm"
                          : "text-xl"
                      }`}>
                      {displayValue(
                        stats?.publikasi?.byKategori?.sinta?.thisYear,
                        loading,
                        error
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-semibold text-slate-900">
                      {displayValue(
                        stats?.publikasi?.byKategori?.sinta?.all,
                        loading,
                        error
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Total {currentYear}</h4>
                  <p className="text-slate-300 text-sm">Semua kategori</p>
                </div>
              </div>
              <div
                className={`font-bold mb-1 ${
                  displayValue(stats?.all?.totalThisYear, loading, error) ===
                  "Belum ada data"
                    ? "text-lg"
                    : "text-3xl"
                }`}>
                {displayValue(stats?.all?.totalThisYear, loading, error)}
              </div>
              <p className="text-slate-300 text-sm">Pencapaian tahun ini</p>
            </div>

            <div className="bg-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Prestasi</h4>
                  <p className="text-red-100 text-sm">Penghargaan & prestasi</p>
                </div>
              </div>
              <div
                className={`font-bold mb-1 ${
                  displayValue(stats?.prestasi?.thisYear, loading, error) ===
                  "Belum ada data"
                    ? "text-lg"
                    : "text-3xl"
                }`}>
                {displayValue(stats?.prestasi?.thisYear, loading, error)}
              </div>
              <p className="text-red-100 text-sm">Prestasi {currentYear}</p>
            </div>

            <div className="bg-yellow-500 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Total Keseluruhan</h4>
                  <p className="text-yellow-100 text-sm">Semua waktu</p>
                </div>
              </div>
              <div
                className={`font-bold mb-1 ${
                  displayValue(stats?.all?.totalAll, loading, error) ===
                  "Belum ada data"
                    ? "text-lg"
                    : "text-3xl"
                }`}>
                {displayValue(stats?.all?.totalAll, loading, error)}
              </div>
              <p className="text-yellow-100 text-sm">Akumulasi total</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
