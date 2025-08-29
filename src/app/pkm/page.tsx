"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import type { PKM } from "@/types/pkm-types";
import { PKMAddEditModal } from "@/components/pkm/pkm-add-edit-modal";
import { PKMDeleteModal } from "@/components/pkm/pkm-delete-modal";
import { PKMGenericDataTable } from "@/components/pkm/pkm-generic-datatable";
import { DetailModal } from "@/components/pkm/detail-modal";
import { toast } from "sonner";

export default function PKMPage() {
  const [pkms, setPkms] = useState<PKM[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPkm, setEditingPkm] = useState<PKM | undefined>();
  const [deletingPkm, setDeletingPkm] = useState<PKM | undefined>();
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    type: "publikasi" | "hki" | "buku";
    data: unknown[];
    title: string;
  }>({
    isOpen: false,
    type: "publikasi",
    data: [],
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPkms();
  }, []);

  const fetchPkms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dosen/pkm");
      if (response.ok) {
        const result = await response.json();
        setPkms(result.data || []);
      }
      toast.success("Berhasil memuat data PKM");
    } catch (error) {
      console.error("Error fetching PKMs:", error);
      toast.error("Gagal memuat data PKM", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPkm = async (pkmData: Partial<PKM>) => {
    try {
      setIsLoading(true);
      const payload = {
        proposal: pkmData.proposal || "",
        laporan: pkmData.laporan || "",
        ...(pkmData.publikasi &&
          pkmData.publikasi.length > 0 && {
            publikasi: pkmData.publikasi.map((pub) => ({
              judul: pub.judul,
              author: pub.author,
              namaJurnal: pub.namaJurnal,
              publisher: pub.publisher,
              kategori: pub.kategori,
              level: pub.level,
            })),
          }),
        ...(pkmData.hki &&
          pkmData.hki.length > 0 && {
            hki: pkmData.hki.map((h) => ({
              author: h.author,
              nomorPenciptaan: h.nomorPenciptaan,
              tanggalPermohonan: h.tanggalPermohonan,
              jenisCiptaan: h.jenisCiptaan,
              judulCiptaan: h.judulCiptaan,
              linkSertifikat: h.linkSertifikat,
            })),
          }),
        ...(pkmData.buku &&
          pkmData.buku.length > 0 && {
            buku: pkmData.buku.map((b) => ({
              author: b.author,
              judulBuku: b.judulBuku,
              penerbit: b.penerbit,
              isbn: b.isbn,
              tahun: b.tahun,
              jenisBuku: b.jenisBuku,
              linkBuku: b.linkBuku,
            })),
          }),
      };

      const response = await fetch("/api/dosen/pkm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setPkms((prev) => [...prev, result.data]);
        setShowAddModal(false);
        toast.success(result.message, {
          description: `ID PKM baru: ${result.data.id}`,
        });
      } else {
        throw new Error(result.message || "Gagal menambahkan PKM");
      }
    } catch (error) {
      console.error("Error creating PKM:", error);
      toast.error("Gagal menambahkan PKM", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPkm = async (pkmData: Partial<PKM>) => {
    if (!editingPkm) return;

    try {
      setIsLoading(true);
      const payload = {
        proposal: pkmData.proposal || "",
        laporan: pkmData.laporan || "",
        ...(pkmData.publikasi &&
          pkmData.publikasi.length > 0 && {
            publikasi: pkmData.publikasi.map((pub) => ({
              judul: pub.judul,
              author: pub.author,
              namaJurnal: pub.namaJurnal,
              publisher: pub.publisher,
              kategori: pub.kategori,
              level: pub.level,
            })),
          }),
        ...(pkmData.hki &&
          pkmData.hki.length > 0 && {
            hki: pkmData.hki.map((h) => ({
              author: h.author,
              nomorPenciptaan: h.nomorPenciptaan,
              tanggalPermohonan: h.tanggalPermohonan,
              jenisCiptaan: h.jenisCiptaan,
              judulCiptaan: h.judulCiptaan,
              linkSertifikat: h.linkSertifikat,
            })),
          }),
        ...(pkmData.buku &&
          pkmData.buku.length > 0 && {
            buku: pkmData.buku.map((b) => ({
              author: b.author,
              judulBuku: b.judulBuku,
              penerbit: b.penerbit,
              isbn: b.isbn,
              tahun: b.tahun,
              jenisBuku: b.jenisBuku,
              linkBuku: b.linkBuku,
            })),
          }),
      };

      const response = await fetch(`/api/dosen/pkm/${editingPkm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setPkms((prev) =>
          prev.map((pkm) => (pkm.id === editingPkm.id ? result.data : pkm))
        );
        setEditingPkm(undefined);
        toast.success(result.message, {
          description: `PKM ID: ${result.data.id}`,
        });
      } else {
        throw new Error(result.message || "Gagal memperbarui PKM");
      }
    } catch (error) {
      console.error("Error updating PKM:", error);
      toast.error("Gagal memperbarui PKM", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePkm = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dosen/pkm/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setPkms((prev) => prev.filter((pkm) => pkm.id !== id));
        setDeletingPkm(undefined);
        toast.success(result.message, { description: `ID PKM: ${id}` });
      } else {
        throw new Error(result.message || "Gagal menghapus PKM");
      }
    } catch (error) {
      console.error("Error deleting PKM:", error);
      toast.error("Gagal menghapus PKM", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (
    type: "publikasi" | "hki" | "buku",
    data: unknown[],
    title: string
  ) => {
    setDetailModal({
      isOpen: true,
      type,
      data,
      title,
    });
  };

  return (
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
              Manajemen PKM
            </h1>
            <p className="text-lg text-white font-medium drop-shadow-sm">
              Kelola data Pengabdian Kepada Masyarakat UPI YPTK Padang
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
            <Plus className="w-4 h-4 mr-2" />
            Tambah PKM
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            {pkms.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Belum ada data PKM
                </h3>
                <p className="text-slate-500 text-center mb-6 max-w-sm">
                  Mulai dengan menambahkan PKM pertama Anda untuk UPI YPTK
                  Padang
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah PKM
                </Button>
              </div>
            ) : (
              <PKMGenericDataTable
                data={pkms}
                onEdit={setEditingPkm}
                onDelete={setDeletingPkm}
                onViewDetail={handleViewDetail}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        <PKMAddEditModal
          isOpen={showAddModal || !!editingPkm}
          onClose={() => {
            setShowAddModal(false);
            setEditingPkm(undefined);
          }}
          onSave={editingPkm ? handleEditPkm : handleAddPkm}
          pkm={editingPkm}
        />

        <PKMDeleteModal
          isOpen={!!deletingPkm}
          onClose={() => setDeletingPkm(undefined)}
          onConfirm={() => deletingPkm && handleDeletePkm(deletingPkm.id)}
          title={`PKM #${deletingPkm?.id || ""}`}
          loading={isLoading}
        />

        <DetailModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal((prev) => ({ ...prev, isOpen: false }))}
          type={detailModal.type}
          data={detailModal.data}
          title={detailModal.title}
        />
      </div>
    </div>
  );
}
