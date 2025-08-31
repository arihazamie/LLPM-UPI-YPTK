"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface DosenOnlyProps {
  children: React.ReactNode;
}

export default function DosenOnly({ children }: DosenOnlyProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "DOSEN") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold">Akses Ditolak</h2>
            </div>
            <p className="text-gray-600">
              Anda harus login terlebih dahulu untuk mengakses halaman ini.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.user.role !== "DOSEN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold">Akses Ditolak</h2>
            </div>
            <p className="text-gray-600">
              Halaman ini hanya dapat diakses oleh dosen. Role Anda saat ini:{" "}
              <span className="font-semibold capitalize">
                {session.user.role.toLowerCase()}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
} 