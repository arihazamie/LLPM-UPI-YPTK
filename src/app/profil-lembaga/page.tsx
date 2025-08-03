import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, History, Trophy, Users, BookOpen } from "lucide-react"; // Example icons
import Image from "next/image";

export default function ProfilLembagaPage() {
  return (
    <main className="flex-1">
      {/* Hero Section for Profil Lembaga */}
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
            <span>Sejarah • Visi • Misi</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Profil
            </span>{" "}
            Lembaga
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Mengenal lebih dekat sejarah, visi, misi, dan perjalanan LPPM UPI
            YPTK Padang.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Sejarah Lembaga Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
                <History className="h-4 w-4" />
                <span>Sejarah Kami</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Perjalanan LPPM UPI YPTK
                <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                  {" "}
                  Padang
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                LPPM UPI YPTK Padang didirikan dengan semangat untuk menjadi
                pusat keunggulan dalam penelitian dan pengabdian kepada
                masyarakat. Sejak awal berdirinya, kami telah berkomitmen untuk
                mendorong inovasi, menghasilkan karya ilmiah yang relevan, dan
                memberikan dampak positif bagi lingkungan sekitar.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Melalui berbagai program dan kolaborasi, kami terus berupaya
                untuk menjawab tantangan zaman dan berkontribusi pada
                pembangunan berkelanjutan, baik di tingkat lokal maupun
                nasional.
              </p>
            </div>
            {/* Placeholder Image/Graphic */}
            <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/sejarah-lppm.png" // Updated src
                alt="Sejarah LPPM"
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-yellow-500/20 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-nilai Inti Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Nilai-nilai Inti</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Pilar yang Membentuk
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Kami
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nilai-nilai ini menjadi landasan setiap langkah dan keputusan yang
              kami ambil dalam menjalankan misi kami.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Keunggulan",
                description:
                  "Berkomitmen pada standar tertinggi dalam penelitian dan pengabdian.",
                gradient: "from-red-500 to-red-600",
              },
              {
                icon: Users,
                title: "Kolaborasi",
                description:
                  "Membangun kemitraan yang kuat untuk dampak yang lebih besar.",
                gradient: "from-yellow-500 to-yellow-600",
              },
              {
                icon: BookOpen,
                title: "Inovasi",
                description:
                  "Mendorong ide-ide baru dan solusi kreatif untuk tantangan masa depan.",
                gradient: "from-red-600 to-yellow-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="relative pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
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
