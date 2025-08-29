import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitFork, Users, LayoutDashboard, Sparkles } from "lucide-react"; // Icons for Struktur Organisasi
import Image from "next/image";

export default function StrukturOrganisasiPage() {
  return (
    <main className="flex-1">
      {/* Hero Section for Struktur Organisasi */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
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
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white/90 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Struktur • Tata Kelola • Tim</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-balance">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Struktur
            </span>{" "}
            <span className="text-white">Organisasi</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 text-pretty">
            Mengenal lebih dekat struktur kepemimpinan dan tata kelola LPPM UPI
            YPTK Padang yang mendukung excellence dalam penelitian dan
            pengabdian masyarakat.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300 mb-2">4</div>
              <div className="text-sm text-white/80">Pimpinan Utama</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300 mb-2">11</div>
              <div className="text-sm text-white/80">Koordinator</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300 mb-2">6</div>
              <div className="text-sm text-white/80">Gugus Fakultas</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Organizational Chart Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-6">
              <GitFork className="h-4 w-4" />
              <span>Hierarki Organisasi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-balance">
              Bagan Organisasi
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                LPPM UPI YPTK
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty">
              Struktur organisasi yang terstruktur dan jelas untuk memastikan
              efisiensi dan efektivitas dalam menjalankan fungsi penelitian dan
              pengabdian kepada masyarakat.
            </p>
          </div>

          <div className="relative w-full max-w-7xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-yellow-500"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
                      <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Struktur Organisasi LPPM
                      </h3>
                      <p className="text-sm text-gray-500">
                        Universitas Putra Indonesia YPTK Padang
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">2025</div>
                </div>
                <div className="relative w-full h-[500px] md:h-[700px] rounded-2xl overflow-hidden bg-gray-50">
                  <Image
                    src="/Struktur_LPPM.jpg"
                    alt="Struktur Organisasi LPPM UPI YPTK"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-red-100 rounded-full px-6 py-3 text-yellow-600 text-sm font-bold mb-6">
              <Users className="h-4 w-4" />
              <span>Tingkatan Organisasi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-balance">
              Tingkatan
              <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                Kepemimpinan
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Level 1 - Kepala LPPM */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-red-50 to-red-100">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <CardTitle className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                  Kepala LPPM
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  Pemimpin tertinggi yang bertanggung jawab atas seluruh
                  kegiatan LPPM
                </CardDescription>
                <div className="text-sm font-semibold text-red-600">
                  1 Posisi
                </div>
              </CardContent>
            </Card>

            {/* Level 2 - Wakil Kepala */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <CardTitle className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                  Wakil Kepala
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  Membantu kepala dalam bidang penelitian, PkM, dan
                  kesekretariatan
                </CardDescription>
                <div className="text-sm font-semibold text-orange-600">
                  3 Posisi
                </div>
              </CardContent>
            </Card>

            {/* Level 3 - Koordinator */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <CardTitle className="text-xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors">
                  Koordinator
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  Mengelola bidang-bidang spesifik seperti ekonomi, proof
                  reading, dan lainnya
                </CardDescription>
                <div className="text-sm font-semibold text-yellow-600">
                  11 Posisi
                </div>
              </CardContent>
            </Card>

            {/* Level 4 - Gugus Fakultas */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <CardTitle className="text-xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
                  Gugus Fakultas
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  Perwakilan dari setiap fakultas untuk koordinasi kegiatan LPPM
                </CardDescription>
                <div className="text-sm font-semibold text-green-600">
                  6 Fakultas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-6">
              <GitFork className="h-4 w-4" />
              <span>Unit Kerja</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-balance">
              Unit
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Operasional
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <CardHeader className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-red-500 mb-1">
                      01
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                      Unit
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-4">
                  Unit Penelitian
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-lg">
                  Bertanggung jawab atas perencanaan, pelaksanaan, dan evaluasi
                  program penelitian yang berkualitas dan berdampak.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Koordinasi penelitian dosen dan mahasiswa</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Pengelolaan publikasi ilmiah</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Pengembangan riset unggulan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
              <CardHeader className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-yellow-500 mb-1">
                      02
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                      Unit
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors mb-4">
                  Unit Pengabdian Masyarakat
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-lg">
                  Mengelola dan melaksanakan program-program pengabdian yang
                  berdampak langsung pada pemberdayaan masyarakat.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Program pemberdayaan masyarakat</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Kemitraan dengan instansi eksternal</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Implementasi hasil penelitian</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
