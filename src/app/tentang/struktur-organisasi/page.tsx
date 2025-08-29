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
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-yellow-500">
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Struktur
            </span>{" "}
            Organisasi
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Melihat bagan dan susunan kepemimpinan LPPM UPI YPTK Padang.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <GitFork className="h-4 w-4" />
              <span>Hierarki Kami</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Bagan Organisasi
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                LPPM
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              LPPM UPI YPTK Padang memiliki struktur organisasi yang jelas untuk
              memastikan efisiensi dan efektivitas dalam menjalankan fungsi
              penelitian dan pengabdian masyarakat.
            </p>
          </div>

          {/* Placeholder for Org Chart Image */}
          <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100 flex items-center justify-center">
            <Image
              src="/Struktur_LPPM.jpg" // Updated src
              alt="Struktur Organisasi LPPM"
              layout="fill"
              objectFit="contain"
              className="w-full h-full"
              priority
            />
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
              <LayoutDashboard className="inline-block h-4 w-4 mr-1" /> Bagan
              Organisasi (Placeholder)
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                  Unit Penelitian
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Bertanggung jawab atas perencanaan, pelaksanaan, dan evaluasi
                  program penelitian.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors">
                  Unit Pengabdian Masyarakat
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Mengelola dan melaksanakan program-program pengabdian yang
                  berdampak langsung pada masyarakat.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
