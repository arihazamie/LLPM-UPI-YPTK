"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trophy } from "lucide-react";
import { toast } from "sonner";
import type { Prestasi } from "@/types/pkm-types";
import { PrestasiAddEditModal } from "@/components/prestasi/prestasi-add-edit-modal";
import { PrestasiDeleteModal } from "@/components/prestasi/prestasi-delete-modal";
import { PrestasiGenericDataTable } from "@/components/prestasi/prestasi-generic-datatable";
import { PrestasiExcelExportButton } from "@/components/prestasi/prestasi-excel-export-button";
import { useSession } from "next-auth/react";
import DosenOnly from "@/components/auth/DosenOnly";

export default function PrestasiPage() {
  const [prestasis, setPrestasis] = useState<Prestasi[]>([]);
  const { data: session } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrestasi, setEditingPrestasi] = useState<
    Prestasi | undefined
  >();
  const [deletingPrestasi, setDeletingPrestasi] = useState<
    Prestasi | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrestasis();
  }, []);

  const fetchPrestasis = async () => {
    try {
      const response = await fetch("/api/dosen/prestasi");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setPrestasis(
          data.map((item: Prestasi) => ({
            ...item,
            tanggal: new Date(item.tanggal),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))
        );
      } else {
        throw new Error("Failed to fetch prestasi");
      }
    } catch (error) {
      toast.error("Gagal memuat data prestasi", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrestasi = async (prestasiData: Partial<Prestasi>) => {
    try {
      const response = await fetch("/api/dosen/prestasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...prestasiData,
          createdById: session?.user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPrestasis([
          {
            ...result.data,
            tanggal: new Date(result.data.tanggal),
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          },
          ...prestasis,
        ]);
        toast.success(result.message || "Prestasi berhasil ditambahkan");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal menambahkan prestasi");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal menambahkan prestasi", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleEditPrestasi = async (prestasiData: Partial<Prestasi>) => {
    if (!editingPrestasi) return false;

    try {
      const response = await fetch(
        `/api/dosen/prestasi/${editingPrestasi.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prestasiData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPrestasis(
          prestasis.map((prestasi) =>
            prestasi.id === editingPrestasi.id
              ? {
                  ...result.data,
                  tanggal: new Date(result.data.tanggal),
                  createdAt: new Date(result.data.createdAt),
                  updatedAt: new Date(result.data.updatedAt),
                }
              : prestasi
          )
        );
        toast.success(result.message || "Prestasi berhasil diperbarui");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal memperbarui prestasi");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal memperbarui prestasi", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleDeletePrestasi = async (id: string) => {
    const prestasiToDelete = prestasis.find((p) => p.id === id);
    if (!prestasiToDelete) return;

    try {
      const response = await fetch(`/api/dosen/prestasi/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setPrestasis(prestasis.filter((p) => p.id !== id));
        toast.success(result.message || "Prestasi berhasil dihapus");
      } else {
        toast.error(result.message || "Gagal menghapus prestasi");
      }
    } catch (error) {
      toast.error("Gagal menghapus prestasi", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <DosenOnly>
      <div className="min-h-screen relative py-32 overflow-hidden">
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
      <div className="relative z-10 container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-white bg-clip-text text-transparent drop-shadow-2xl">
              Manajemen Prestasi - {session?.user?.name}
            </h1>
            <p className="text-lg text-white font-medium drop-shadow-sm">
              Kelola data prestasi dan pencapaian akademik UPI YPTK Padang
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <PrestasiExcelExportButton 
              disabled={prestasis.length === 0 || isLoading}
            />
            <Button
              onClick={() => setShowAddModal(true)}
              disabled={isLoading}
              className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Prestasi
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            {prestasis.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Belum ada data prestasi
                </h3>
                <p className="text-slate-500 text-center mb-6 max-w-sm">
                  Mulai dengan menambahkan prestasi pertama Anda untuk UPI YPTK
                  Padang
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Prestasi
                </Button>
              </div>
            ) : (
              <PrestasiGenericDataTable
                data={prestasis}
                onEdit={setEditingPrestasi}
                onDelete={setDeletingPrestasi}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        <PrestasiAddEditModal
          isOpen={showAddModal || !!editingPrestasi}
          onClose={() => {
            setShowAddModal(false);
            setEditingPrestasi(undefined);
          }}
          onSave={editingPrestasi ? handleEditPrestasi : handleAddPrestasi}
          prestasi={editingPrestasi}
        />

        <PrestasiDeleteModal
          isOpen={!!deletingPrestasi}
          onClose={() => setDeletingPrestasi(undefined)}
          onDelete={handleDeletePrestasi}
          prestasi={deletingPrestasi ?? null}
        />
      </div>
    </div>
    </DosenOnly>
  );
}
