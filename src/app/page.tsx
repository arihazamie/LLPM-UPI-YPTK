import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
  Zap,
  Heart,
  Search,
  Target,
} from "lucide-react";
import Link from "next/link";

const Home = () => {
  const aboutItems = [
    {
      icon: Target,
      title: "Profil Lembaga",
      description:
        "Sejarah, visi, misi, dan profil lengkap LPPM UPI YPTK Padang yang telah berkembang selama bertahun-tahun",
      href: "/profil-lembaga",
      gradient: "from-red-500 to-red-600",
      size: "large",
    },
    {
      icon: Award,
      title: "Visi dan Misi",
      description: "Visi, misi, dan tujuan strategis LPPM",
      href: "/visi-misi",
      gradient: "from-yellow-500 to-yellow-600",
      size: "small",
    },
    {
      icon: Users,
      title: "Struktur Organisasi",
      description: "Bagan organisasi dan struktur kepemimpinan",
      href: "/struktur-organisasi",
      gradient: "from-red-600 to-yellow-500",
      size: "small",
    },
    {
      icon: Heart,
      title: "Tim Kami",
      description:
        "Profil pimpinan dan staff LPPM yang berpengalaman dalam bidang penelitian dan pengabdian masyarakat",
      href: "/pimpinan",
      gradient: "from-yellow-600 to-red-500",
      size: "large",
    },
  ];
  const services = [
    {
      icon: Search,
      title: "Penelitian",
      description:
        "Program penelitian inovatif yang berkontribusi pada pengembangan ilmu pengetahuan dan teknologi terdepan",
      features: [
        "Penelitian Dasar",
        "Penelitian Terapan",
        "Penelitian Kolaboratif",
      ],
      href: "/penelitian",
      gradient: "from-red-500 to-red-600",
      accentColor: "red",
    },
    {
      icon: Heart,
      title: "Pengabdian Masyarakat",
      description:
        "Program pengabdian yang memberikan dampak positif langsung kepada masyarakat dan lingkungan",
      features: [
        "Program Pemberdayaan",
        "Pelatihan Masyarakat",
        "Konsultasi Publik",
      ],
      href: "/pengabdian",
      gradient: "from-yellow-500 to-yellow-600",
      accentColor: "yellow",
    },
    {
      icon: BookOpen,
      title: "Publikasi Ilmiah",
      description:
        "Mendorong publikasi hasil penelitian di jurnal nasional dan internasional bereputasi tinggi",
      features: ["Jurnal Terakreditasi", "Prosiding Konferensi", "Buku Ilmiah"],
      href: "/publikasi",
      gradient: "from-red-500 to-yellow-500",
      accentColor: "red",
    },
    {
      icon: Award,
      title: "Kemitraan",
      description:
        "Membangun kerjasama strategis dengan berbagai institusi dan industri untuk kemajuan bersama",
      features: [
        "Kemitraan Industri",
        "Kolaborasi Internasional",
        "Program Hibah",
      ],
      href: "/kemitraan",
      gradient: "from-yellow-500 to-red-500",
      accentColor: "yellow",
    },
  ];
  return (
    <main className="flex-1">
      {/* Header */}
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
        <div className="relative container mx-auto px-6 py-32">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white/90 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Inovasi • Penelitian • Pengabdian</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl md:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="text-white">Lembaga</span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
                    Penelitian
                  </span>
                  <br />
                  <span className="text-white">& Pengabdian</span>
                </h1>
                <div className="space-y-4">
                  <p className="text-2xl font-bold text-yellow-200">
                    UPI YPTK Padang
                  </p>
                  <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                    Membangun masa depan melalui penelitian inovatif dan
                    pengabdian masyarakat yang berkelanjutan untuk kemajuan
                    bangsa.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-red-600 hover:bg-white/90 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/25 transition-all hover:scale-105">
                    <Link
                      href="/tentang"
                      className="flex items-center">
                      Jelajahi Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105 bg-transparent">
                    <Link href="/penelitian">Lihat Penelitian</Link>
                  </Button>
                </div>
              </div>
            </div>
            {/* Modern Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: BookOpen,
                  number: "-",
                  label: "Penelitian",
                  color: "from-white to-yellow-200",
                },
                {
                  icon: Users,
                  number: "-",
                  label: "Peneliti",
                  color: "from-yellow-200 to-white",
                },
                {
                  icon: Award,
                  number: "-",
                  label: "Penghargaan",
                  color: "from-white to-red-200",
                },
                {
                  icon: Users,
                  number: "-",
                  label: "Program",
                  color: "from-red-200 to-white",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-rotate-1">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${
                        stat.color.includes("white")
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(255,255,255,0.1)"
                      }, transparent)`,
                    }}></div>
                  <div className="relative">
                    <div
                      className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-white/80 font-semibold">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-6">
              <span>✨ Tentang Kami</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              LPPM UPI YPTK
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Padang
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Lembaga Penelitian dan Pengabdian Masyarakat yang berkomitmen
              untuk menghasilkan penelitian berkualitas tinggi dan memberikan
              kontribusi nyata bagi kemajuan masyarakat dan bangsa.
            </p>
          </div>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {aboutItems.map((item, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 ${
                  item.size === "large" ? "md:col-span-2" : ""
                }`}>
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto font-bold text-red-600 hover:text-red-700 group-hover:translate-x-2 transition-all">
                    <Link
                      href={item.href}
                      className="flex items-center">
                      Pelajari Lebih Lanjut
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 px-12 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all hover:scale-105">
              <Link href="/tentang">Eksplorasi Lebih Dalam</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-100 rounded-full blur-3xl opacity-30"></div>
        </div>
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-6">
              <Zap className="h-4 w-4" />
              <span>Layanan Unggulan</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Apa Yang
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Kami Tawarkan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              LPPM UPI YPTK Padang menyediakan berbagai layanan berkualitas
              tinggi untuk mendukung pengembangan penelitian dan pengabdian
              masyarakat yang berkelanjutan.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 rounded-3xl hover:-translate-y-4 hover:rotate-1 bg-white">
                {/* Gradient Border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${service.gradient} p-[2px] rounded-3xl`}>
                  <div className="bg-white rounded-3xl h-full w-full"></div>
                </div>
                {/* Content */}
                <div className="relative p-8">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                        <service.icon className="h-10 w-10 text-white" />
                      </div>
                      <div
                        className={`w-12 h-12 rounded-3xl bg-${service.accentColor}-50 flex items-center justify-center group-hover:bg-${service.accentColor}-100 transition-colors`}>
                        <ArrowUpRight
                          className={`h-6 w-6 text-${service.accentColor}-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-4">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-6">
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full h-14 bg-gradient-to-r ${service.gradient} hover:shadow-2xl font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 text-white`}>
                      <Link
                        href={service.href}
                        className="flex items-center">
                        Pelajari Lebih Lanjut
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
