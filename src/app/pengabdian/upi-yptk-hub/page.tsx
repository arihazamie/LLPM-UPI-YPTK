import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, LinkIcon } from "lucide-react";

export default function UnandHubPage() {
  return (
    <main className="flex-1">
      {/* Hero Section for UnandHub */}
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
            <span>Kolaborasi • Jaringan • Inovasi</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              UPI YPTK
            </span>{" "}
            <span className="bg-gradient-to-r from-red-300 via-red-200 to-white bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Informasi mengenai UPI YPTK HUB
          </p>
        </div>
      </section>

      {/* Content Section for UnandHub */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              <LinkIcon className="h-4 w-4" />
              <span>Kemitraan Strategis</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                UPI YPTK HUB
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Detail mengenai LPPM UPI YPTK Padang.
            </p>
          </div>

          <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-lg p-8 text-center">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-black text-gray-900">
                Informasi UpiYPTKHub
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-gray-600 leading-relaxed">
                Detail mengenai UPI YPTK HUB akan segera ditambahkan di sini.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
