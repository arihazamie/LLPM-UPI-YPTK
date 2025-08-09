import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react"; // Icons for Pimpinan
import Image from "next/image";

export default function PimpinanPage() {
  const leaders = [
    {
      name: "Dr. [Nama Pimpinan 1]",
      position: "Ketua LPPM",
      image: "/placeholder.png", // Updated src
      gradient: "from-red-500 to-red-600",
    },
    {
      name: "Dr. [Nama Pimpinan 2]",
      position: "Sekretaris LPPM",
      image: "/images/leader-placeholder.png", // Updated src
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Ir. [Nama Pimpinan 3], M.T.",
      position: "Kepala Bidang Penelitian",
      image: "/images/leader-placeholder.png", // Updated src
      gradient: "from-red-600 to-yellow-500",
    },
    {
      name: "Dra. [Nama Pimpinan 4], M.Pd.",
      position: "Kepala Bidang Pengabdian Masyarakat",
      image: "/images/leader-placeholder.png", // Updated src
      gradient: "from-yellow-600 to-red-500",
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section for Pimpinan */}
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
            <span>Kepemimpinan • Dedikasi • Visi</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Pimpinan
            </span>{" "}
            LPPM
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Mengenal para pemimpin yang menggerakkan visi dan misi LPPM UPI YPTK
            Padang.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Pimpinan List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <Crown className="h-4 w-4" />
              <span>Kepemimpinan Kami</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Para Pemimpin
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                LPPM
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              LPPM UPI YPTK Padang dipimpin oleh individu-individu berdedikasi
              dengan pengalaman luas di bidang penelitian dan pengabdian
              masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-lg text-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${leader.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardContent className="relative p-6 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={leader.image || "/placeholder.svg"}
                      alt={leader.name}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                    {leader.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {leader.position}
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
