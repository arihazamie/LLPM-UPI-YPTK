import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, Target, Sparkles } from "lucide-react"; // Icons for Visi and Misi

export default function VisiMisiPage() {
  return (
    <main className="flex-1">
      {/* Hero Section for Visi dan Misi */}
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
            <span>Visi • Misi • Tujuan</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Visi
            </span>{" "}
            dan{" "}
            <span className="bg-gradient-to-r from-red-300 via-red-200 to-white bg-clip-text text-transparent">
              Misi
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Landasan dan arah tujuan LPPM UPI YPTK Padang dalam setiap
            langkahnya.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Visi Section */}
      <section className="py-20 bg-white text-center items-center">
        <div className="container mx-auto px-6">
          <div className="grid items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
                <Eye className="h-4 w-4" />
                <span>Visi Kami</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 text-center leading-tight">
                Menjadi lembaga penelitian dan pengabdian kepada masyarakat yang{" "}
                <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                  mandiri, inovatif, terkemuka
                </span>{" "}
                di tingkat nasional maupun internasional, menjadi pelopor dalam
                pengembangan penelitian dan pengabdian kepada masyarakat yang
                berkarakter berdasarkan{" "}
                <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  kecerdasan intelektual, emosional dan spiritual
                </span>
                .
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Misi Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <Target className="h-4 w-4" />
              <span>Misi Kami</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Langkah Nyata Menuju
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Visi Kami
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Untuk mencapai visi tersebut, LPPM UPI YPTK Padang menjalankan
              misi sebagai berikut:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Pengembangan SDM",
                description:
                  "Meningkatkan kemampuan dan kualitas sumber daya dosen, mahasiswa dan staf administrasi dalam kegiatan penelitian dan pengabdian kepada masyarakat dengan cara mengembangkan aspek LRAISE++.",
                gradient: "from-red-500 to-red-600",
                icon: "👥",
              },
              {
                number: "02",
                title: "Peningkatan Kualitas",
                description:
                  "Meningkatkan kuantitas dan kualitas penelitian dan pengabdian kepada masyarakat yang relevan dengan program penjaminan mutu universitas roadmap penelitian dan pengabdian kepada masyarakat universitas.",
                gradient: "from-yellow-500 to-yellow-600",
                icon: "📈",
              },
              {
                number: "03",
                title: "IPTEKS Inovatif",
                description:
                  "Meningkatkan relevansi IPTEKS terapan yang inovatif yang mampu membangun jiwa kewirausahaan masyarakat luas.",
                gradient: "from-red-600 to-yellow-500",
                icon: "💡",
              },
              {
                number: "04",
                title: "Produk & Jasa",
                description:
                  "Menghasilkan produk dan jasa yang berbasis IPTEKS agar dapat dimanfaatkan secara optimal untuk kepentingan masyarakat.",
                gradient: "from-yellow-600 to-red-500",
                icon: "🛠️",
              },
              {
                number: "05",
                title: "Kerjasama Institusi",
                description:
                  "Meningkatkan kuantitas dan kualitas penelitian dan pengabdian kepada masyarakat dengan instansi pemerintah dan swasta untuk menunjang pelaksanaan otonomi daerah dan pembangunan nasional.",
                gradient: "from-red-500 to-yellow-500",
                icon: "🤝",
              },
              {
                number: "06",
                title: "Kemandirian Lembaga",
                description:
                  "Mengupayakan kemandirian dalam kegiatan penelitian dan pengabdian kepada masyarakat melalui kelembagaan manajemen yang berorientasi mutu dan kemampuan bersaing secara internasional yang berkarakter berdasarkan kecerdasan spiritual, emosional dan spiritual.",
                gradient: "from-yellow-500 to-red-600",
                icon: "🎯",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {item.number}
                    </div>
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-gray-600 leading-relaxed text-sm">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
