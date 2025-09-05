"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import type {
  Penelitian,
  KategoriPenelitian,
  LuaranPenelitian,
  RoleDosenPenelitian,
  ProgramStudiDosenPenelitian,
} from "@/types/pkm-types";
import { PenelitianAddEditModal } from "@/components/penelitian/penelitian-add-edit-modal";
import { PenelitianDeleteModal } from "@/components/penelitian/penelitian-delete-modal";
import { PenelitianGenericDataTable } from "@/components/penelitian/penelitian-generic-datatable";
import { PenelitianExcelExportButton } from "@/components/penelitian/penelitian-excel-export-button";
import { useSession } from "next-auth/react";
import DosenOnly from "@/components/auth/DosenOnly";

// Form data interface for API communication
interface PenelitianFormData {
  judulPenelitian: string;
  kategoriPenelitian: KategoriPenelitian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran?: number;
  sumberAnggaran?: string;
  luaran: LuaranPenelitian[];
  dosenPenelitian: Array<{
    namaDosen: string;
    NIDN: string;
    roleDosenPenelitian: RoleDosenPenelitian;
    programStudiDosenPenelitian: ProgramStudiDosenPenelitian;
  }>;
  linkProposal: string;
  linkLaporanKemajuan?: string;
  linkLaporanAkhir?: string;
}

export default function PenelitianPage() {
  const [penelitians, setPenelitians] = useState<Penelitian[]>([]);
  const { data: session } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPenelitian, setEditingPenelitian] = useState<
    Penelitian | undefined
  >();
  const [deletingPenelitian, setDeletingPenelitian] = useState<
    Penelitian | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPenelitians();
  }, []);

  const fetchPenelitians = async () => {
    try {
      const response = await fetch("/api/dosen/penelitian");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setPenelitians(
          data.map((item: Penelitian) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))
        );
      } else {
        throw new Error("Failed to fetch penelitian");
      }
    } catch (error) {
      toast.error("Gagal memuat data penelitian", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPenelitian = async (penelitianData: PenelitianFormData) => {
    try {
      const response = await fetch("/api/dosen/penelitian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...penelitianData,
          createdById: session?.user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPenelitians([
          {
            ...result.data,
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          },
          ...penelitians,
        ]);
        toast.success(result.message || "Penelitian berhasil ditambahkan");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal menambahkan penelitian");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal menambahkan penelitian", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleEditPenelitian = async (penelitianData: PenelitianFormData) => {
    if (!editingPenelitian) return false;

    try {
      const response = await fetch(
        `/api/dosen/penelitian/${editingPenelitian.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(penelitianData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPenelitians(
          penelitians.map((penelitian) =>
            penelitian.id === editingPenelitian.id
              ? {
                  ...result.data,
                  createdAt: new Date(result.data.createdAt),
                  updatedAt: new Date(result.data.updatedAt),
                }
              : penelitian
          )
        );
        toast.success(result.message || "Penelitian berhasil diperbarui");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal memperbarui penelitian");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal memperbarui penelitian", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleDeletePenelitian = async (id: string) => {
    const penelitianToDelete = penelitians.find((p) => p.id === id);
    if (!penelitianToDelete) return;

    try {
      const response = await fetch(`/api/dosen/penelitian/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setPenelitians(penelitians.filter((p) => p.id !== id));
        toast.success(result.message || "Penelitian berhasil dihapus");
      } else {
        toast.error(result.message || "Gagal menghapus penelitian");
      }
    } catch (error) {
      toast.error("Gagal menghapus penelitian", {
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
                Manajemen Penelitian - {session?.user?.name}
              </h1>
              <p className="text-lg text-white font-medium drop-shadow-sm">
                Kelola data penelitian UPI YPTK Padang
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <PenelitianExcelExportButton
                disabled={penelitians.length === 0 || isLoading}
              />
              <Button
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Penelitian
              </Button>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {penelitians.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Belum ada data penelitian
                  </h3>
                  <p className="text-slate-500 text-center mb-6 max-w-sm">
                    Mulai dengan menambahkan penelitian pertama Anda untuk UPI
                    YPTK Padang
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Penelitian
                  </Button>
                </div>
              ) : (
                <PenelitianGenericDataTable
                  data={penelitians}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>

          <PenelitianAddEditModal
            isOpen={showAddModal || !!editingPenelitian}
            onClose={() => {
              setShowAddModal(false);
              setEditingPenelitian(undefined);
            }}
            onSave={
              editingPenelitian ? handleEditPenelitian : handleAddPenelitian
            }
            penelitian={editingPenelitian}
          />

          <PenelitianDeleteModal
            isOpen={!!deletingPenelitian}
            onClose={() => setDeletingPenelitian(undefined)}
            onDelete={handleDeletePenelitian}
            penelitian={deletingPenelitian ?? null}
          />
        </div>
      </div>
    </DosenOnly>
  );
}
