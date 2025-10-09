"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { ExternalLink, Save } from "lucide-react";
import type { Penelitian } from "@/types/pkm-types";
import { StatusPenelitian, KategoriPenelitian } from "@/types/pkm-types";

interface PenelitianDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  penelitian?: Penelitian | null;
  modalType: "60%" | "100%";
  onUpdate?: (data: {
    linkLaporanKemajuan?: string;
    linkLaporanAkhir?: string;
  }) => void;
}

const getKategoriLabel = (kategori: KategoriPenelitian) => {
  switch (kategori) {
    case KategoriPenelitian.PENELITIAN_DOSEN_PEMULA:
      return "Penelitian Dosen Pemula";
    case KategoriPenelitian.PENELITIAN_TERAPAN:
      return "Penelitian Terapan";
    case KategoriPenelitian.PENELITIAN_PENGEMBANGAN:
      return "Penelitian Pengembangan";
    case KategoriPenelitian.PENELITIAN_UNGGULAN_PERGURUAN_TINGGI:
      return "Penelitian Unggulan Perguruan Tinggi";
    case KategoriPenelitian.PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR:
      return "Penelitian Guru Besar Percepatan Profesor";
    case KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_NASIONAL:
      return "Penelitian Bekerjasama Mitra Nasional";
    case KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL:
      return "Penelitian Bekerjasama Mitra Internasional";
    default:
      return kategori;
  }
};

const getStatusLabel = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "Review Proposal";
    case StatusPenelitian.ACC_PROPOSAL:
      return "Proposal Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "Review Laporan 60%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "Laporan 60% Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "Review Laporan 100%";
    case StatusPenelitian.SELESAI:
      return "Selesai";
    case StatusPenelitian.DITOLAK:
      return "Ditolak";
    default:
      return status;
  }
};

export default function PenelitianDetailModal({
  isOpen,
  onClose,
  penelitian,
  modalType,
  onUpdate,
}: PenelitianDetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states untuk modal 60%
  const [linkLaporanKemajuan, setLinkLaporanKemajuan] = useState("");
  const [statusLuaran, setStatusLuaran] = useState("");

  // Form states untuk modal 100%
  const [linkLaporanAkhir, setLinkLaporanAkhir] = useState("");
  const [linkLuaran, setLinkLuaran] = useState<Record<string, string>>({});

  // Status penelitian akan otomatis diubah berdasarkan jenis laporan yang diupload
  const getUpdatedStatus = () => {
    if (modalType === "60%") {
      return StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60;
    } else {
      return StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100;
    }
  };

  if (!penelitian) return null;

  const getRelevantLink = () => {
    if (modalType === "60%") {
      return penelitian.linkLaporanKemajuan;
    } else {
      return penelitian.linkLaporanAkhir;
    }
  };

  // Check if user can input based on current status
  const canInput60 = () => {
    return penelitian.statusPenelitian === StatusPenelitian.ACC_PROPOSAL;
  };

  const canInput100 = () => {
    return (
      penelitian.statusPenelitian === StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60
    );
  };

  const isInputEnabled = () => {
    if (modalType === "60%") {
      return canInput60();
    } else {
      return canInput100();
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Tambahkan status baru berdasarkan jenis laporan yang diupload
      const newStatus = getUpdatedStatus();

      // Definir updateData fuera de los bloques condicionales
      let updateData;

      if (modalType === "60%") {
        updateData = {
          linkLaporanKemajuan:
            linkLaporanKemajuan || penelitian.linkLaporanKemajuan,
          statusLuaran,
          statusPenelitian: newStatus,
        };

        const response = await fetch(`/api/dosen/penelitian/${penelitian.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          toast.error(errorData.message || "Gagal memperbarui penelitian");
          return;
        }
      } else {
        // Konversi object linkLuaran menjadi string JSON
        const linkLuaranJSON =
          Object.keys(linkLuaran).length > 0
            ? JSON.stringify(linkLuaran)
            : penelitian.linkLuaran;

        updateData = {
          linkLaporanAkhir: linkLaporanAkhir || penelitian.linkLaporanAkhir,
          linkLuaran: linkLuaranJSON,
          statusPenelitian: newStatus,
        };

        const response = await fetch(`/api/dosen/penelitian/${penelitian.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          toast.error(errorData.message || "Gagal memperbarui penelitian");
          return;
        }
      }

      toast.success(
        `${
          modalType === "60%" ? "Laporan kemajuan" : "Laporan akhir"
        } berhasil disimpan dan status diperbarui menjadi ${getStatusLabel(
          newStatus
        )}`
      );

      if (onUpdate) {
        // Solo pasar las propiedades que coinciden con la interfaz
        const onUpdateData = {
          ...(modalType === "60%"
            ? { linkLaporanKemajuan: updateData.linkLaporanKemajuan }
            : {}),
          ...(modalType === "100%"
            ? { linkLaporanAkhir: updateData.linkLaporanAkhir }
            : {}),
        };
        onUpdate(onUpdateData);
      }

      // Reset form
      if (modalType === "60%") {
        setLinkLaporanKemajuan("");
        setStatusLuaran("");
      } else {
        setLinkLaporanAkhir("");
        setLinkLuaran({});
      }

      // Tutup modal setelah berhasil menyimpan
      onClose();
    } catch (error) {
      console.error("Error updating penelitian:", error);
      toast.error("Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detail Penelitian - {modalType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informasi Penelitian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Judul Penelitian
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {penelitian.judulPenelitian}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Kategori Penelitian
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {getKategoriLabel(penelitian.kategoriPenelitian)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Status Penelitian
              </Label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    penelitian.statusPenelitian === StatusPenelitian.SELESAI
                      ? "bg-green-100 text-green-800 border-green-200"
                      : penelitian.statusPenelitian === StatusPenelitian.DITOLAK
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }>
                  {getStatusLabel(penelitian.statusPenelitian)}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Tahun Kegiatan
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {penelitian.tahunKegiatan}
              </p>
            </div>
          </div>

          {/* Form Input */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="linkLaporan"
                className="text-sm font-medium">
                {modalType === "60%"
                  ? "Link Laporan Kemajuan 60%"
                  : "Link Laporan Akhir"}
              </Label>
              <div className="mt-1 space-y-2">
                <Input
                  id="linkLaporan"
                  type="url"
                  placeholder={
                    modalType === "60%"
                      ? "Masukkan link laporan kemajuan 60%"
                      : "Masukkan link laporan akhir"
                  }
                  value={
                    modalType === "60%" ? linkLaporanKemajuan : linkLaporanAkhir
                  }
                  onChange={(e) => {
                    if (modalType === "60%") {
                      setLinkLaporanKemajuan(e.target.value);
                    } else {
                      setLinkLaporanAkhir(e.target.value);
                    }
                  }}
                  disabled={!isInputEnabled() || isSubmitting}
                  className="w-full"
                />
                {getRelevantLink() && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <a
                      href={getRelevantLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline">
                      Lihat laporan saat ini
                    </a>
                  </div>
                )}
              </div>
            </div>

            {modalType === "60%" && (
              <div>
                <Label
                  htmlFor="statusLuaran"
                  className="text-sm font-medium">
                  Status Luaran
                </Label>
                <Textarea
                  id="statusLuaran"
                  placeholder="Deskripsikan status luaran penelitian (opsional)"
                  value={statusLuaran}
                  onChange={(e) => setStatusLuaran(e.target.value)}
                  disabled={!isInputEnabled() || isSubmitting}
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {modalType === "100%" && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">Link Luaran</Label>

                {penelitian.luaran && penelitian.luaran.length > 0 ? (
                  penelitian.luaran.map((luaran, index) => (
                    <div
                      key={index}
                      className="space-y-2">
                      <Label
                        htmlFor={`linkLuaran-${index}`}
                        className="text-sm">
                        {luaran}
                      </Label>
                      <Input
                        id={`linkLuaran-${index}`}
                        type="url"
                        placeholder={`Masukkan link luaran untuk ${luaran}`}
                        value={linkLuaran[luaran] || ""}
                        onChange={(e) => {
                          setLinkLuaran((prev) => ({
                            ...prev,
                            [luaran]: e.target.value,
                          }));
                        }}
                        disabled={!isInputEnabled() || isSubmitting}
                        className="mt-1"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    Tidak ada luaran yang ditentukan
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tim Penelitian */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Tim Penelitian
            </Label>
            <div className="mt-2 space-y-2">
              {penelitian.dosenPenelitian.map((dosen, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{dosen.namaDosen}</p>
                    <p className="text-xs text-gray-600">NIDN: {dosen.NIDN}</p>
                    <p className="text-xs text-gray-600">
                      {dosen.roleDosenPenelitian} -{" "}
                      {dosen.programStudiDosenPenelitian}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luaran Penelitian */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Luaran yang Diharapkan
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {penelitian.luaran.map((luaran, index) => (
                <Badge
                  key={index}
                  variant="secondary">
                  {luaran.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}>
            Tutup
          </Button>
          {isInputEnabled() && (
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
