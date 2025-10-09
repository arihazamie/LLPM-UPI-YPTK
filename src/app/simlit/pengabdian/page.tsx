"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Pengabdian,
  KategoriPengabdian,
  LuaranPengabdian,
  RoleDosenPengabdian,
  ProgramStudiDosenPenelitian,
  StatusPengabdian,
} from "@/types/pkm-types";
import { PengabdianAddEditModal } from "@/components/pengabdian/pengabdian-add-edit-modal";
import { PengabdianDeleteModal } from "@/components/pengabdian/pengabdian-delete-modal";
import { PengabdianGenericDataTable } from "@/components/pengabdian/pengabdian-generic-datatable";
import { PengabdianExcelExportButton } from "@/components/pengabdian/pengabdian-excel-export-button";
import { useSession } from "next-auth/react";
import DosenOnly from "@/components/auth/DosenOnly";

// Form data interface for API communication
interface PengabdianFormData {
  judulPengabdian: string;
  kategoriPengabdian: KategoriPengabdian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran?: number;
  sumberAnggaran?: string;
  luaran: LuaranPengabdian[];
  statusPengabdian?: StatusPengabdian;
  dosenPengabdian: Array<{
    namaDosen: string;
    NIDN: string;
    roleDosenPengabdian: RoleDosenPengabdian;
    programStudiDosenPengabdian: ProgramStudiDosenPenelitian;
  }>;
  linkProposal: string;
  linkLaporanKemajuan?: string;
  linkLaporanAkhir?: string;
}

export default function PengabdianPage() {
  const [pengabdians, setPengabdians] = useState<Pengabdian[]>([]);
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPengabdian, setEditingPengabdian] = useState<
    Pengabdian | undefined
  >();
  const [deletingPengabdian, setDeletingPengabdian] = useState<
    Pengabdian | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pengabdian data
  const fetchPengabdians = async () => {
    try {
      const response = await fetch("/api/dosen/pengabdian");
      if (response.status === 401) {
        toast.error(
          "Anda harus login terlebih dahulu untuk mengakses halaman ini."
        );
        return;
      }
      const result = await response.json();

      if (response.ok) {
        setPengabdians(result.data);
      } else {
        toast.error(result.message || "Gagal mengambil data pengabdian");
      }
    } catch (error) {
      console.error("Error fetching pengabdians:", error);
      toast.error("Terjadi kesalahan saat mengambil data pengabdian");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchPengabdians();
    } else if (status === "unauthenticated") {
      toast.error(
        "Anda harus login terlebih dahulu untuk mengakses halaman ini."
      );
      setIsLoading(false);
    }
  }, [status]);

  // Handle add pengabdian
  const handleAddPengabdian = async (data: PengabdianFormData) => {
    try {
      // Set initial status as REVIEW when adding new pengabdian
      const dataWithStatus = {
        ...data,
        statusPengabdian: StatusPengabdian.REVIEW,
      };

      const response = await fetch("/api/dosen/pengabdian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithStatus),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Pengabdian berhasil ditambahkan dengan status Review");
        setShowAddModal(false);
        fetchPengabdians();
      } else {
        toast.error(result.message || "Gagal menambahkan pengabdian");
      }
    } catch (error) {
      console.error("Error adding pengabdian:", error);
      toast.error("Terjadi kesalahan saat menambahkan pengabdian");
    }
  };

  // Handle edit pengabdian
  const handleEditPengabdian = async (data: PengabdianFormData) => {
    if (!editingPengabdian) return;

    try {
      // Preserve existing status unless explicitly changed
      const dataWithStatus = {
        ...data,
        statusPengabdian:
          data.statusPengabdian || editingPengabdian.statusPengabdian,
      };

      const response = await fetch(
        `/api/dosen/pengabdian/${editingPengabdian.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataWithStatus),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Pengabdian berhasil diperbarui");
        setEditingPengabdian(undefined);
        fetchPengabdians();
      } else {
        toast.error(result.message || "Gagal memperbarui pengabdian");
      }
    } catch (error) {
      console.error("Error updating pengabdian:", error);
      toast.error("Terjadi kesalahan saat memperbarui pengabdian");
    }
  };

  // Handle delete pengabdian
  const handleDeletePengabdian = async () => {
    if (!deletingPengabdian) return;

    try {
      const response = await fetch(
        `/api/dosen/pengabdian/${deletingPengabdian.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Pengabdian berhasil dihapus");
        setDeletingPengabdian(undefined);
        fetchPengabdians();
      } else {
        toast.error(result.message || "Gagal menghapus pengabdian");
      }
    } catch (error) {
      console.error("Error deleting pengabdian:", error);
      toast.error("Terjadi kesalahan saat menghapus pengabdian");
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
                Manajemen Pengabdian - {session?.user?.name}
              </h1>
              <p className="text-lg text-white font-medium drop-shadow-sm">
                Kelola data pengabdian masyarakat UPI YPTK Padang
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <PengabdianExcelExportButton
                disabled={pengabdians.length === 0 || isLoading}
              />
              <Button
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengabdian
              </Button>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {pengabdians.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Belum ada data pengabdian
                  </h3>
                  <p className="text-slate-500 text-center mb-6 max-w-sm">
                    Mulai dengan menambahkan pengabdian masyarakat pertama Anda
                    untuk UPI YPTK Padang
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Pengabdian
                  </Button>
                </div>
              ) : (
                <PengabdianGenericDataTable
                  data={pengabdians}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>

          <PengabdianAddEditModal
            isOpen={showAddModal || !!editingPengabdian}
            onOpenChange={(open: boolean) => {
              if (!open) {
                setShowAddModal(false);
                setEditingPengabdian(undefined);
              }
            }}
            onSubmit={
              editingPengabdian ? handleEditPengabdian : handleAddPengabdian
            }
            initialData={editingPengabdian}
          />

          <PengabdianDeleteModal
            isOpen={!!deletingPengabdian}
            onClose={() => setDeletingPengabdian(undefined)}
            onDelete={async () => {
              if (deletingPengabdian) {
                await handleDeletePengabdian();
              }
            }}
            pengabdian={deletingPengabdian || null}
          />
        </div>
      </div>
    </DosenOnly>
  );
}
