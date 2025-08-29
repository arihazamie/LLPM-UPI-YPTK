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
              <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">
                Menjadi Universitas yang unggul dan kompetitif dalam
                menghasilkan Sumber Daya Manusia yang berkarakter didasari
                kecerdasan intelektual, emosional dan spiritual pada tahun 2024
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
                title: "-",
                description:
                  "Menyelenggarakan pendidikan tinggi berbasis teknologi informasi yang berkualitas serta menjadikan 12 prinsip dasar UPI-YPTK sebagai nilai-nilai berprilaku dalam rangka meningkatkan daya saing bangsa",
                gradient: "from-red-500 to-red-600",
              },
              {
                title: "-",
                description:
                  "Menciptakan suasana akademik dalam mengintegrasikan kecerdasan intelektual, emosional dan spiritual",
                gradient: "from-yellow-500 to-yellow-600",
              },
              {
                title: "-",
                description:
                  "Menyelenggarakan Tri Dharma Perguruan Tinggi sesuai dengan kebutuhan sekarang dan masa yang akan datang",
                gradient: "from-red-600 to-yellow-500",
              },
              {
                title: "-",
                description:
                  "Menyelenggarakan kerjasama dengan berbagai instansi baik di dalam maupun di luar negeri",
                gradient: "from-yellow-600 to-red-500",
              },
              {
                title: "-",
                description:
                  "Mengembangkan organisasi institusi sesuai dengan perubahan yang terjadi",
                gradient: "from-red-500 to-yellow-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="relative pb-4">
                  <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-gray-600 leading-relaxed">
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
