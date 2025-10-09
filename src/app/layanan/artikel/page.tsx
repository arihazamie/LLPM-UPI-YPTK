"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Artikel } from "@/types/pkm-types";
import { ArtikelAddEditModal } from "@/components/artikel/artikel-add-edit-modal";
import { ArtikelDeleteModal } from "@/components/artikel/artikel-delete-modal";
import { ArtikelGenericDataTable } from "@/components/artikel/artikel-generic-datatable";
import { ArtikelExcelExportButton } from "@/components/artikel/artikel-excel-export-button";
import { useSession } from "next-auth/react";
import DosenOnly from "@/components/auth/DosenOnly";

export default function ArtikelPage() {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const { data: session } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState<Artikel | undefined>();
  const [deletingArtikel, setDeletingArtikel] = useState<Artikel | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    try {
      const response = await fetch("/api/dosen/artikel");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setArtikels(
          data.map((item: Artikel) => ({
            ...item,
            tanggalPublisher: new Date(item.tanggalPublisher),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))
        );
      } else {
        throw new Error("Failed to fetch artikel");
      }
    } catch (error) {
      toast.error("Gagal memuat data artikel", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArtikel = async (artikelData: Partial<Artikel>) => {
    try {
      const response = await fetch("/api/dosen/artikel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...artikelData,
          createdById: session?.user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setArtikels([
          {
            ...result.data,
            tanggalPublisher: new Date(result.data.tanggalPublisher),
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          },
          ...artikels,
        ]);
        toast.success(result.message || "Artikel berhasil ditambahkan");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal menambahkan artikel");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal menambahkan artikel", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleEditArtikel = async (artikelData: Partial<Artikel>) => {
    if (!editingArtikel) return false;

    try {
      const response = await fetch(`/api/dosen/artikel/${editingArtikel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artikelData),
      });

      const result = await response.json();

      if (response.ok) {
        setArtikels(
          artikels.map((artikel) =>
            artikel.id === editingArtikel.id
              ? {
                  ...result.data,
                  tanggalPublisher: new Date(result.data.tanggalPublisher),
                  createdAt: new Date(result.data.createdAt),
                  updatedAt: new Date(result.data.updatedAt),
                }
              : artikel
          )
        );
        toast.success(result.message || "Artikel berhasil diperbarui");
        return true;
      } else {
        if (result.errors) {
          result.errors.forEach((err: { path: string; message: string }) =>
            toast.error(`${err.path}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal memperbarui artikel");
        }
        return false;
      }
    } catch (error) {
      toast.error("Gagal memperbarui artikel", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleDeleteArtikel = async (id: string) => {
    const artikelToDelete = artikels.find((p) => p.id === id);
    if (!artikelToDelete) return;

    try {
      const response = await fetch(`/api/dosen/artikel/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setArtikels(artikels.filter((p) => p.id !== id));
        toast.success(result.message || "Artikel berhasil dihapus");
      } else {
        toast.error(result.message || "Gagal menghapus artikel");
      }
    } catch (error) {
      toast.error("Gagal menghapus artikel", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <DosenOnly>
      <div className="min-h-screen relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-cyan-500 to-green-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-green-400/10 rounded-full blur-3xl animate-spin"
              style={{ animationDuration: "20s" }}></div>
          </div>
        </div>
        <div className="relative z-10 container mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight bg-white bg-clip-text text-transparent drop-shadow-2xl">
                Manajemen Artikel - {session?.user?.name}
              </h1>
              <p className="text-lg text-white font-medium drop-shadow-sm">
                Kelola data artikel dan publikasi ilmiah UPI YPTK Padang
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ArtikelExcelExportButton
                disabled={artikels.length === 0 || isLoading}
              />
              <Button
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Artikel
                </span>
              </Button>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {artikels.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Belum ada data artikel
                  </h3>
                  <p className="text-slate-500 text-center mb-6 max-w-sm">
                    Mulai dengan menambahkan artikel pertama Anda untuk UPI YPTK
                    Padang
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 shadow-lg">
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Artikel
                    </span>
                  </Button>
                </div>
              ) : (
                <ArtikelGenericDataTable
                  data={artikels}
                  onEdit={setEditingArtikel}
                  onDelete={setDeletingArtikel}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>

          <ArtikelAddEditModal
            isOpen={showAddModal || !!editingArtikel}
            onClose={() => {
              setShowAddModal(false);
              setEditingArtikel(undefined);
            }}
            onSave={editingArtikel ? handleEditArtikel : handleAddArtikel}
            artikel={editingArtikel}
          />

          <ArtikelDeleteModal
            isOpen={!!deletingArtikel}
            onClose={() => setDeletingArtikel(undefined)}
            onDelete={handleDeleteArtikel}
            artikel={deletingArtikel ?? null}
          />
        </div>
      </div>
    </DosenOnly>
  );
}
