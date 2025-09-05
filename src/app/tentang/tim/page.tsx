import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Sparkles,
  BookOpen,
  Cog,
  Globe,
  Database,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

interface BasePerson {
  name: string;
  position: string;
  faculty: string;
  image: string;
  gradient: string;
}

interface Coordinator extends BasePerson {
  icon: LucideIcon;
}

type TimPerson = BasePerson | Coordinator;

export default function TimLppmPage() {
  const coordinators = [
    {
      name: "Febri Hadi, S.Kom, M.Kom",
      position: "Koordinator Bidang Penelitian dan Pengelonan",
      faculty: "Fakultas Ilmu Komputer",
      image: "/economics-coordinator.png",
      gradient: "from-orange-500 to-orange-600",
      icon: BookOpen,
    },
    {
      name: "Dr. Ramdani Bayu Putra, SE, MM",
      position: "Koordinator Bidang Ekonomi dan Bisnis",
      faculty: "Fakultas Ekonomi dan Bisnis",
      image: "/economics-coordinator.png",
      gradient: "from-orange-500 to-orange-600",
      icon: BookOpen,
    },
    {
      name: "Omia Crefioza, S.E., M.M",
      position: "Koordinator Bidang Proof Reading",
      faculty: "Fakultas Ekonomi dan Bisnis",
      image: "/proof-reading-coordinator.png",
      gradient: "from-teal-500 to-teal-600",
      icon: Globe,
    },
    {
      name: "Chintya Ones Charli, SE, MM",
      position: "Koordinator Bidang Pengabdian kepada Masyarakat",
      faculty: "Fakultas Ekonomi dan Bisnis",
      image: "/community-service-coordinator.png",
      gradient: "from-indigo-500 to-indigo-600",
      icon: Users,
    },
    {
      name: "Della Asmaria Putri, SE, MM",
      position: "Koordinator Bidang Kesekretariatan dan Laboratorium Riset",
      faculty: "",
      image: "/secretariat-coordinator.png",
      gradient: "from-pink-500 to-pink-600",
      icon: Cog,
    },
    {
      name: "Vina Yelmalia, A.Md. Kom",
      position:
        "Staf Koordinator Bidang Kesekretariatan dan Laboratorium Riset",
      faculty: "Fakultas Ilmu Komputer",
      image: "/staff-coordinator.png",
      gradient: "from-cyan-500 to-cyan-600",
      icon: Database,
    },
  ];

  const facultyRepresentatives = [
    {
      name: "Silky Safira, S.Kom., M.Kom",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Ilmu Komputer",
      image: "/computer-science-faculty-coordinator.png",
      gradient: "from-slate-500 to-slate-600",
    },
    {
      name: "Ade Irma Wahyudi, S.Ak., M",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Ekonomi dan Bisnis",
      image: "/economics-faculty-coordinator.png",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      name: "Isna Asrini Syahrina, S.Psi, MM, M.Psi",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Psikologi",
      image: "/psychology-faculty-coordinator.png",
      gradient: "from-rose-500 to-rose-600",
    },
    {
      name: "Dr. Tedy Wirasepta, M.Ds",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Desain Komunikasi Visual",
      image: "/design-faculty-coordinator.png",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      name: "Rita Nasmirawti, ST., MT",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Teknik",
      image: "/engineering-faculty-coordinator.png",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Desep Pria Panari, S.Pd., M.Pd, Kons",
      position: "Gugus LPPM Fakultas",
      faculty: "Fakultas Keguruan dan Ilmu Pendidikan",
      image: "/education-faculty-coordinator.png",
      gradient: "from-lime-500 to-lime-600",
    },
  ];

  const TimCard = ({
    person,
    showIcon = false,
  }: {
    person: TimPerson;
    showIcon?: boolean;
  }) => {
    const IconComponent = "icon" in person ? person.icon : UserCheck;
    return (
      <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/95 backdrop-blur-lg">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${person.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}></div>
        <CardContent className="relative p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={person.image || "/placeholder.svg"}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              {showIcon && "icon" in person && (
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br ${person.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 leading-tight text-balance">
              {person.name}
            </CardTitle>
            <div className="space-y-2">
              <div
                className={`inline-block px-3 py-1 bg-gradient-to-r ${person.gradient} text-white text-xs font-semibold rounded-full`}>
                {person.position}
              </div>
              <CardDescription className="text-gray-600 text-sm font-medium">
                {person.faculty}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="flex-1">
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
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 text-white/90 text-sm font-semibold mb-8 border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span>Tim • Profesional • Dukungan</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
              Tim
            </span>
            <br />
            <span className="text-white/95 text-4xl md:text-5xl lg:text-6xl drop-shadow-xl">
              LPPM UPI YPTK
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8 font-medium">
            Mengenal tim profesional yang mendukung operasional dan program
            penelitian serta pengabdian masyarakat di UPI YPTK Padang
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Coordinators Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-700 text-sm font-bold mb-4">
              <Cog className="h-4 w-4" />
              <span>Koordinator Bidang</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 text-balance">
              Para
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Koordinator
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Koordinator bidang yang memimpin berbagai aspek operasional LPPM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {coordinators.map((coordinator, index) => (
              <TimCard
                key={index}
                person={coordinator}
                showIcon={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Representatives Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-6 py-3 text-orange-700 text-sm font-bold mb-4">
              <Users className="h-4 w-4" />
              <span>Perwakilan Fakultas</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 text-balance">
              Gugus
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                LPPM Fakultas
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Perwakilan dari setiap fakultas yang menjembatani komunikasi dan
              koordinasi program LPPM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyRepresentatives.map((representative, index) => (
              <TimCard
                key={index}
                person={representative}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
