import type React from "react";
import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  badge,
  icon,
}: PageHeaderProps) {
  return (
    <>
      {/* Hero Section */}
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
            <span>{badge}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              {title}
            </span>{" "}
            <span className="bg-gradient-to-r from-red-300 via-red-200 to-white bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Content Header */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full px-6 py-3 text-red-600 text-sm font-bold mb-4">
              {icon}
              <span>{badge}</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Daftar
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                {title}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
