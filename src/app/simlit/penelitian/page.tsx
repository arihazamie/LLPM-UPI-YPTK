"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Penelitian,
  KategoriPenelitian,
  LuaranPenelitian,
  RoleDosenPenelitian,
  ProgramStudiDosenPenelitian,
  StatusPenelitian,
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
  statusPenelitian?: StatusPenelitian;
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
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPenelitian, setEditingPenelitian] = useState<
    Penelitian | undefined
  >();
  const [deletingPenelitian, setDeletingPenelitian] = useState<
    Penelitian | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch penelitian data
  const fetchPenelitians = async () => {
    try {
      const response = await fetch("/api/dosen/penelitian");
      if (response.status === 401) {
        toast.error(
          "Anda harus login terlebih dahulu untuk mengakses halaman ini."
        );
        return;
      }
      const result = await response.json();

      if (response.ok) {
        setPenelitians(result.data);
      } else {
        toast.error(result.message || "Gagal mengambil data penelitian");
      }
    } catch (error) {
      console.error("Error fetching penelitians:", error);
      toast.error("Terjadi kesalahan saat mengambil data penelitian");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchPenelitians();
    } else if (status === "unauthenticated") {
      toast.error(
        "Anda harus login terlebih dahulu untuk mengakses halaman ini."
      );
      setIsLoading(false);
    }
  }, [status]);

  // Handle add penelitian
  const handleAddPenelitian = async (data: PenelitianFormData) => {
    try {
      // Set initial status as REVIEW when adding new penelitian
      const dataWithStatus = {
        ...data,
        statusPenelitian: StatusPenelitian.REVIEW,
      };

      const response = await fetch("/api/dosen/penelitian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithStatus),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Penelitian berhasil ditambahkan dengan status Review");
        setShowAddModal(false);
        fetchPenelitians();
      } else {
        toast.error(result.message || "Gagal menambahkan penelitian");
      }
    } catch (error) {
      console.error("Error adding penelitian:", error);
      toast.error("Terjadi kesalahan saat menambahkan penelitian");
    }
  };

  // Handle edit penelitian
  const handleEditPenelitian = async (data: PenelitianFormData) => {
    if (!editingPenelitian) return;

    try {
      // Preserve existing status unless explicitly changed
      const dataWithStatus = {
        ...data,
        statusPenelitian:
          data.statusPenelitian || editingPenelitian.statusPenelitian,
      };

      const response = await fetch(
        `/api/dosen/penelitian/${editingPenelitian.id}`,
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
        toast.success("Penelitian berhasil diperbarui");
        setEditingPenelitian(undefined);
        fetchPenelitians();
      } else {
        toast.error(result.message || "Gagal memperbarui penelitian");
      }
    } catch (error) {
      console.error("Error updating penelitian:", error);
      toast.error("Terjadi kesalahan saat memperbarui penelitian");
    }
  };

  // Handle delete penelitian
  const handleDeletePenelitian = async () => {
    if (!deletingPenelitian) return;

    try {
      const response = await fetch(
        `/api/dosen/penelitian/${deletingPenelitian.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Penelitian berhasil dihapus");
        setDeletingPenelitian(undefined);
        fetchPenelitians();
      } else {
        toast.error(result.message || "Gagal menghapus penelitian");
      }
    } catch (error) {
      console.error("Error deleting penelitian:", error);
      toast.error("Terjadi kesalahan saat menghapus penelitian");
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
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
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg">
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
            onOpenChange={(open: boolean) => {
              if (!open) {
                setShowAddModal(false);
                setEditingPenelitian(undefined);
              }
            }}
            onSubmit={
              editingPenelitian ? handleEditPenelitian : handleAddPenelitian
            }
            initialData={editingPenelitian}
          />

          <PenelitianDeleteModal
            isOpen={!!deletingPenelitian}
            onClose={() => setDeletingPenelitian(undefined)}
            onDelete={async () => {
              if (deletingPenelitian) {
                await handleDeletePenelitian();
              }
            }}
            penelitian={deletingPenelitian || null}
          />
        </div>
      </div>
    </DosenOnly>
  );
}
