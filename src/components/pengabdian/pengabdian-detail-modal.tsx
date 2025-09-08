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
import type { Pengabdian } from "@/types/pkm-types";
import { StatusPengabdian, KategoriPengabdian } from "@/types/pkm-types";

interface PengabdianDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengabdian?: Pengabdian | null;
  modalType: "60%" | "100%";
  onUpdate?: (data: {
    linkLaporanKemajuan?: string;
    linkLaporanAkhir?: string;
  }) => void;
}

const getKategoriLabel = (kategori: KategoriPengabdian) => {
  switch (kategori) {
    case KategoriPengabdian.PENGABDIAN_MASYARAKAT:
      return "Pengabdian Masyarakat";
    case KategoriPengabdian.PENGABDIAN_DOSEN_PEMULA:
      return "Pengabdian Dosen Pemula";
    case KategoriPengabdian.PENGABDIAN_TERAPAN:
      return "Pengabdian Terapan";
    case KategoriPengabdian.PENGABDIAN_ILMU:
      return "Pengabdian Keilmuan";
    case KategoriPengabdian.PENGABDIAN_PENGEMBANGAN:
      return "Pengabdian Pengembangan";
    case KategoriPengabdian.PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI:
      return "Pengabdian Unggulan Perguruan Tinggi";
    case KategoriPengabdian.PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR:
      return "Pengabdian Guru Besar Percepatan Profesor";
    case KategoriPengabdian.PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL:
      return "Pengabdian Bekerjasama Mitra Nasional";
    case KategoriPengabdian.PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL:
      return "Pengabdian Bekerjasama Mitra Internasional";
    default:
      return kategori;
  }
};

const getStatusLabel = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return "Review Proposal";
    case StatusPengabdian.ACC_PROPOSAL:
      return "Proposal Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "Review Laporan 60%";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return "Laporan 60% Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "Review Laporan 100%";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_100:
      return "Laporan 100% Disetujui";
    case StatusPengabdian.SELESAI:
      return "Selesai";
    case StatusPengabdian.DITOLAK:
      return "Ditolak";
    default:
      return status;
  }
};

export default function PengabdianDetailModal({
  isOpen,
  onClose,
  pengabdian,
  modalType,
  onUpdate,
}: PengabdianDetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states untuk modal 60%
  const [linkLaporanKemajuan, setLinkLaporanKemajuan] = useState("");
  const [statusLuaran, setStatusLuaran] = useState("");

  // Form states untuk modal 100%
  const [linkLaporanAkhir, setLinkLaporanAkhir] = useState("");
  const [linkLuaran, setLinkLuaran] = useState("");

  if (!pengabdian) return null;

  const getRelevantLink = () => {
    if (modalType === "60%") {
      return pengabdian.linkLaporanKemajuan;
    } else {
      return pengabdian.linkLaporanAkhir;
    }
  };

  // Check if user can input based on current status
  const canInput60 = () => {
    return pengabdian.statusPengabdian === StatusPengabdian.ACC_PROPOSAL;
  };

  const canInput100 = () => {
    return (
      pengabdian.statusPengabdian === StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60
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
      const updateData =
        modalType === "60%"
          ? {
              linkLaporanKemajuan:
                linkLaporanKemajuan || pengabdian.linkLaporanKemajuan,
            }
          : {
              linkLaporanAkhir: linkLaporanAkhir || pengabdian.linkLaporanAkhir,
            };

      const response = await fetch(`/api/admin/pengabdian/${pengabdian.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update pengabdian");
      }

      toast.success(
        `${
          modalType === "60%" ? "Laporan kemajuan" : "Laporan akhir"
        } berhasil disimpan`
      );

      if (onUpdate) {
        onUpdate(updateData);
      }

      // Reset form
      if (modalType === "60%") {
        setLinkLaporanKemajuan("");
        setStatusLuaran("");
      } else {
        setLinkLaporanAkhir("");
        setLinkLuaran("");
      }
    } catch (error) {
      console.error("Error updating pengabdian:", error);
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
            Detail Pengabdian - {modalType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informasi Pengabdian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Judul Pengabdian
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {pengabdian.judulPengabdian}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Kategori Pengabdian
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {getKategoriLabel(pengabdian.kategoriPengabdian)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Status Pengabdian
              </Label>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    pengabdian.statusPengabdian === StatusPengabdian.SELESAI
                      ? "bg-green-100 text-green-800 border-green-200"
                      : pengabdian.statusPengabdian === StatusPengabdian.DITOLAK
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }>
                  {getStatusLabel(pengabdian.statusPengabdian)}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Tahun Kegiatan
              </Label>
              <p className="text-sm text-gray-900 mt-1">
                {pengabdian.tahunKegiatan}
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
                  placeholder="Deskripsikan status luaran pengabdian (opsional)"
                  value={statusLuaran}
                  onChange={(e) => setStatusLuaran(e.target.value)}
                  disabled={!isInputEnabled() || isSubmitting}
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {modalType === "100%" && (
              <div>
                <Label
                  htmlFor="linkLuaran"
                  className="text-sm font-medium">
                  Link Luaran
                </Label>
                <Input
                  id="linkLuaran"
                  type="url"
                  placeholder="Masukkan link luaran pengabdian"
                  value={linkLuaran}
                  onChange={(e) => setLinkLuaran(e.target.value)}
                  disabled={!isInputEnabled() || isSubmitting}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Tim Pengabdian */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Tim Pengabdian
            </Label>
            <div className="mt-2 space-y-2">
              {pengabdian.dosenPengabdian.map((dosen, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{dosen.namaDosen}</p>
                    <p className="text-xs text-gray-600">NIDN: {dosen.NIDN}</p>
                    <p className="text-xs text-gray-600">
                      {dosen.roleDosenPengabdian} -{" "}
                      {dosen.programStudiDosenPengabdian}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luaran Pengabdian */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Luaran yang Diharapkan
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {pengabdian.luaran.map((luaran, index) => (
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
