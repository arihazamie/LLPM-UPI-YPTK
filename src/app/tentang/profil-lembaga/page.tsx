import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, History, Trophy, Target, Search, Heart } from "lucide-react"; // Example icons

export default function ProfilLembagaPage() {
  return (
    <main className="flex-1">
      {/* Hero Section for Profil Lembaga */}
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
            <span>Lembaga Penelitian dan Pengabdian kepada Masyarakat</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Profil
            </span>{" "}
            LPPM
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Lembaga Penelitian dan Pengabdian kepada Masyarakat Universitas
            Putra Indonesia YPTK Padang - Inspirator Pembangunan Regional,
            Nasional dan Internasional
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Tentang LPPM Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <History className="h-4 w-4" />
              <span>Tentang Kami</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Lembaga Penelitian dan
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Pengabdian Masyarakat
              </span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              LPPM UPI YPTK mengkoordinasikan kegiatan penelitian dan pengabdian
              kepada masyarakat melalui pusat-pusat dan unit-unit yang diarahkan
              untuk menjadi pusat-pusat unggulan dalam penguasaan, pengembangan
              dan penerapan IPTEKS untuk memberdayakan masyarakat.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Kami berkomitmen untuk mengkristalisasikan penelitian dan
              pelayanan IPTEKS yang berdaya guna bagi masyarakat, serta menjadi
              inspirator pembangunan regional, nasional dan internasional.
            </p>

            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-8 border-l-4 border-red-500 max-w-2xl mx-auto">
              <p className="text-gray-800 font-medium mb-2">Dipimpin oleh:</p>
              <p className="text-2xl font-bold text-gray-900">
                Assoc. Prof. Dr. Agung Ramadhanu, S.Kom, M.Kom, MTA, CM.NLP
              </p>
              <p className="text-red-600 font-medium">Ketua LPPM UPI YPTK</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tujuan Lembaga Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <Trophy className="h-4 w-4" />
              <span>Tujuan Lembaga</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Mengembangkan Penelitian dan
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Pengabdian Masyarakat
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Mengembangkan penelitian dan pengabdian kepada masyarakat
              Universitas Putra Indonesia YPTK Padang beserta sarana dan
              prasarananya agar dapat tercapai pengembangan LPPM UPI-YPTK
              sebagai inspirator pembangunan regional, nasional dan
              Internasional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Koordinasi & Perencanaan",
                description:
                  "Mengkoordinasikan, merencanakan, melaksanakan, memantau, dan menilai kegiatan penelitian dan pengabdian kepada masyarakat",
              },
              {
                number: "02",
                title: "Daya Saing Dosen",
                description:
                  "Meningkatkan daya saing dosen dalam kegiatan penelitian dan pengabdian kepada masyarakat di tingkat nasional dan internasional",
              },
              {
                number: "03",
                title: "Sistem Informasi",
                description:
                  "Mengarahkan dan membangun sistem informasi dalam kegiatan penelitian dan pengabdian kepada masyarakat",
              },
              {
                number: "04",
                title: "Diseminasi Hasil",
                description:
                  "Mendiseminasikan hasil penelitian dan pengabdian kepada masyarakat untuk pengembangan pembelajaran",
              },
              {
                number: "05",
                title: "Keterlibatan Mahasiswa",
                description:
                  "Meningkatkan keterlibatan mahasiswa dalam kegiatan penelitian dan pengabdian kepada masyarakat",
              },
              {
                number: "06",
                title: "Jejaring Kerjasama",
                description:
                  "Menciptakan jejaring kerjasama intra universitas, antar universitas, dan lembaga tingkat nasional-internasional",
              },
            ].map((goal, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="relative">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {goal.number}
                    </div>
                    <CardTitle className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                      {goal.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {goal.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <Target className="h-4 w-4" />
              <span>Fungsi Lembaga</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Fungsi
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Lembaga
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sasaran strategis dan indikator ketercapaian dalam bidang
              penelitian dan pengabdian kepada masyarakat
            </p>
          </div>

          {/* A. Bidang Penelitian */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-3xl p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">
                    A. Bidang Penelitian
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Untuk ketercapaian tujuan strategis bidang kelembagaan
                    diperlukan sejumlah sasaran strategis beserta indikator
                    ketercapaian sasaran yang menggambarkan kondisi yang harus
                    dicapai. Untuk mempercepat peningkatan kualitas penelitian
                    ditetapkan sasaran berikut:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  number: "1",
                  title: "Penelitian Unggulan & Publikasi",
                  description:
                    "Meningkatkan jumlah penelitian unggulan dengan tingkat kompetisi tinggi, Meningkatkan jumlah publikasi hasil riset di jurnal nasional terakreditasi dan jurnal internasional terindeks",
                },
                {
                  number: "2",
                  title: "Penelitian Berciri Teknologi & Spiritual",
                  description:
                    "Meningkatkan jumlah penelitian unggulan UPI-YPTK Padang berciri Teknologi dan Spiritual",
                },
                {
                  number: "3",
                  title: "Kolaborasi Penelitian",
                  description:
                    "Meningkatkan jumlah penelitian kolaborasi dengan institusi lain baik didalam maupun diluar negeri",
                },
                {
                  number: "4",
                  title: "HKI dan Paten",
                  description:
                    "Meningkatkan perolehan HKI dan paten dari hasil riset",
                },
                {
                  number: "5",
                  title: "Keterlibatan Mahasiswa",
                  description:
                    "Meningkatkan keterlibatan mahasiswa dalam kegiatan penelitian",
                },
                {
                  number: "6",
                  title: "Jurnal Ilmiah LPPM",
                  description: "Pengembangan Jurnal Ilmiah LPPM",
                },
                {
                  number: "7",
                  title: "Layanan Administrasi TIK",
                  description:
                    "Meningkatkan layanan administrasi penelitian melalui sistem layanan administrasi berbasis TIK",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                        {item.number}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* B. Bidang Pengabdian kepada Masyarakat */}
          <div>
            <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-3xl p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">
                    B. Bidang Pengabdian kepada Masyarakat
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Sasaran Pengabdian kepada Masyarakat yang dikembangkan LPPM
                    adalah meningkatkan kontribusi perguruan tinggi pada
                    pembangunan masyarakat dan pencapaian MDGs. Sasaran bidang
                    pengabdian kepada masyarakat dapat dirinci menurut kelompok
                    sasaran sebagai berikut:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  number: "1",
                  title: "Pengabdian Kompetitif",
                  description:
                    "Meningkatkan jumlah pengabdian kepada masyarakat dengan tingkat kompetisi tinggi",
                },
                {
                  number: "2",
                  title: "Desa Binaan",
                  description: "Meningkatkan jumlah desa binaan",
                },
                {
                  number: "3",
                  title: "Pengabdian Berbasis Riset",
                  description:
                    "Meningkatkan jumlah pengabdian kepada masyarakat berbasis riset",
                },
                {
                  number: "4",
                  title: "Mitra Pemberdayaan",
                  description:
                    "Meningkatkan jumlah mitra baik institusi Pemerintah maupun Swasta dalam program pemberdayaan masyarakat",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                        {item.number}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
