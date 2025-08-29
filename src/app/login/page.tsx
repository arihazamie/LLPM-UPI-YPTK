"use client";

import { signIn, getSession, useSession } from "next-auth/react";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      name,
      password,
    });

    if (res?.ok) {
      toast.success("Login berhasil 🎉", {
        description: "Selamat datang di LPPM UPI YPTK Padang",
      });
      const session = await getSession();
      switch (session?.user.role) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "PIMPINAN":
          router.push("/dashboard/pimpinan");
          break;
        case "DOSEN":
          router.push("/");
          break;
        default:
          router.push("/");
      }
    } else {
      toast.error("Login gagal", { description: res?.error });
    }
    setLoading(false);
  };

  return (
    <main className="flex-1">
      {/* Hero Section for Login */}
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
            <span>Akses • Keamanan • Data</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Masuk
            </span>{" "}
            ke{" "}
            <span className="bg-gradient-to-r from-red-300 via-red-200 to-white bg-clip-text text-transparent">
              Akun Anda
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Silakan masukkan kredensial Anda untuk mengakses portal LPPM.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>
      {/* Login Form Section */}
      <section className="py-20 bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto relative overflow-hidden border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 p-[2px] rounded-3xl">
            <div className="bg-white rounded-3xl h-full w-full"></div>
          </div>
          <div className="relative p-8">
            <CardHeader className="p-0 mb-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Selamat Datang Kembali
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Masukkan detail Anda di bawah ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form
                onSubmit={handleSubmit}
                className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap"
                    className="h-12 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    required
                    className="h-12 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                  disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memuat...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    href="#"
                    className="font-medium text-red-600 hover:underline">
                    Daftar Sekarang
                  </Link>
                </div>
              </form>
            </CardContent>
          </div>
        </Card>
      </section>
    </main>
  );
}
