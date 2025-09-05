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

import { ExternalLink, Save, Eye } from "lucide-react";
import type { Penelitian } from "@/types/pkm-types";
import {
  StatusPenelitian,
  KategoriPenelitian,
  LuaranPenelitian,
  RoleDosenPenelitian,
} from "@/types/pkm-types";

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
  const labels: Record<string, string> = {
    [KategoriPenelitian.PENELITIAN_DOSEN_PEMULA]: "Penelitian Dosen Pemula",
    [KategoriPenelitian.PENELITIAN_TERAPAN]: "Penelitian Terapan",
    [KategoriPenelitian.PENELITIAN_PENGEMBANGAN]: "Penelitian Pengembangan",
    [KategoriPenelitian.PENELITIAN_UNGGULAN_PERGURUAN_TINGGI]:
      "Penelitian Unggulan Perguruan Tinggi",
    [KategoriPenelitian.PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR]:
      "Penelitian Guru Besar (Percepatan Profesor)",
    [KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_NASIONAL]:
      "Penelitian Bekerjasama Mitra Nasional",
    [KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL]:
      "Penelitian Bekerjasama Mitra Internasional",
  };
  return labels[kategori] || kategori;
};

const getLuaranLabel = (value: string) => {
  const labels: Record<string, string> = {
    [LuaranPenelitian.SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS]:
      "Seminar Internasional (Scopus/Atlantis/WOS)",
    [LuaranPenelitian.ARTIKEL_JURNAL_NASIONAL_SINTA_5]:
      "Artikel Jurnal Nasional Sinta 5",
    [LuaranPenelitian.ARTIKEL_JURNAL_NASIONAL_SINTA_4]:
      "Artikel Jurnal Nasional Sinta 4",
    [LuaranPenelitian.ARTIKEL_JURNAL_NASIONAL_SINTA_3]:
      "Artikel Jurnal Nasional Sinta 3",
    [LuaranPenelitian.ARTIKEL_JURNAL_NASIONAL_SINTA_2]:
      "Artikel Jurnal Nasional Sinta 2",
    [LuaranPenelitian.PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS]:
      "Publikasi Jurnal International Bereputasi (Scopus/WOS)",
    [LuaranPenelitian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS]:
      "Publikasi Jurnal International (Scopus Q4/WOS)",
    [LuaranPenelitian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS]:
      "Publikasi Jurnal International (Scopus Q3/WOS)",
    [LuaranPenelitian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS]:
      "Publikasi Jurnal International (Scopus Q2/WOS)",
    [LuaranPenelitian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS]:
      "Publikasi Jurnal International (Scopus Q1/WOS)",
    [LuaranPenelitian.HKI_PATEN]: "HKI Paten",
    [LuaranPenelitian.BUKU_ISBN]: "Buku (ber ISBN)",
    [LuaranPenelitian.PROTOTYPE]: "Prototype",
  };
  return labels[value] || value;
};

const getStatusColor = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "bg-yellow-100 text-yellow-800";
    case StatusPenelitian.ACC_PROPOSAL:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "bg-orange-100 text-orange-800";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "bg-purple-100 text-purple-800";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.SELESAI:
      return "bg-green-100 text-green-800";
    case StatusPenelitian.DITOLAK:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "📋 Review";
    case StatusPenelitian.ACC_PROPOSAL:
      return "✅ Proposal Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "📊 Review Laporan 60%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "✅ Laporan 60% Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "📊 Review Laporan 100%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "✅ Laporan 100% Disetujui";
    case StatusPenelitian.SELESAI:
      return "🎉 Selesai";
    case StatusPenelitian.DITOLAK:
      return "❌ Ditolak";
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
  const [linkLuaran, setLinkLuaran] = useState("");

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
      const updateData =
        modalType === "60%"
          ? {
              linkLaporanKemajuan:
                linkLaporanKemajuan || penelitian.linkLaporanKemajuan,
              statusLuaran: statusLuaran,
            }
          : {
              linkLaporanAkhir: linkLaporanAkhir || penelitian.linkLaporanAkhir,
              linkLuaran: linkLuaran,
            };

      const response = await fetch(`/api/dosen/penelitian/${penelitian.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update penelitian");
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {modalType === "60%"
              ? "Laporan Kemajuan (60%)"
              : "Laporan Akhir (100%)"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Judul Penelitian */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              {penelitian.judulPenelitian}
            </h3>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(penelitian.statusPenelitian)}>
                {getStatusLabel(penelitian.statusPenelitian)}
              </Badge>
              <span className="text-sm text-gray-500">
                {penelitian.tahunKegiatan}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {penelitian.lamaKegiatan}
              </span>
            </div>
          </div>

          {/* Tim Peneliti */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tim Peneliti</h4>
            <div className="space-y-2">
              {penelitian.dosenPenelitian.map((dosen, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{dosen.namaDosen}</div>
                    <div className="text-xs text-gray-500">
                      NIDN: {dosen.NIDN}
                    </div>
                  </div>
                  <Badge
                    variant={
                      dosen.roleDosenPenelitian === RoleDosenPenelitian.KETUA
                        ? "default"
                        : "outline"
                    }
                    className="text-xs">
                    {dosen.roleDosenPenelitian === RoleDosenPenelitian.KETUA
                      ? "Ketua"
                      : "Anggota"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Kategori:</span>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className="text-xs">
                  {getKategoriLabel(penelitian.kategoriPenelitian)}
                </Badge>
              </div>
            </div>
            {penelitian.anggaran && (
              <div>
                <span className="text-gray-500">Anggaran:</span>
                <p className="font-medium">
                  Rp {penelitian.anggaran.toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>

          {/* Luaran */}
          {penelitian.luaran.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Target Luaran</h4>
              <div className="flex flex-wrap gap-1">
                {penelitian.luaran.map((luaran, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs">
                    {getLuaranLabel(luaran)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Form Input untuk Modal 60% atau 100% */}
          <div
            className={`p-4 rounded-lg border ${
              modalType === "60%"
                ? "bg-blue-50 border-blue-200"
                : "bg-green-50 border-green-200"
            }`}>
            <h4
              className={`font-medium mb-4 ${
                modalType === "60%" ? "text-blue-900" : "text-green-900"
              }`}>
              {modalType === "60%"
                ? "📄 Laporan Kemajuan (60%)"
                : "📄 Laporan Akhir (100%)"}
            </h4>

            {/* Status Information */}
            {!isInputEnabled() && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  modalType === "60%"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}>
                <p className="text-sm font-medium">
                  {modalType === "60%"
                    ? penelitian.statusPenelitian === StatusPenelitian.REVIEW
                      ? "🔍 Proposal sedang direview admin"
                      : penelitian.statusPenelitian ===
                        StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60
                      ? "🔍 Laporan kemajuan sedang direview admin"
                      : penelitian.statusPenelitian ===
                        StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60
                      ? "✅ Laporan kemajuan sudah disetujui admin"
                      : penelitian.statusPenelitian ===
                        StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100
                      ? "🔍 Laporan akhir sedang direview admin"
                      : penelitian.statusPenelitian === StatusPenelitian.SELESAI
                      ? "🎉 Penelitian telah selesai"
                      : "❌ Penelitian ditolak"
                    : penelitian.statusPenelitian === StatusPenelitian.REVIEW
                    ? "🔍 Proposal sedang direview admin"
                    : penelitian.statusPenelitian ===
                      StatusPenelitian.ACC_PROPOSAL
                    ? "📋 Silakan input laporan kemajuan 60% terlebih dahulu"
                    : penelitian.statusPenelitian ===
                      StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60
                    ? "🔍 Laporan kemajuan sedang direview admin"
                    : penelitian.statusPenelitian ===
                      StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100
                    ? "🔍 Laporan akhir sedang direview admin"
                    : penelitian.statusPenelitian === StatusPenelitian.SELESAI
                    ? "🎉 Penelitian telah selesai"
                    : "❌ Penelitian ditolak"}
                </p>
              </div>
            )}

            {isInputEnabled() && modalType === "60%" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkLaporanKemajuan">
                    Link Laporan Kemajuan
                  </Label>
                  <Input
                    id="linkLaporanKemajuan"
                    type="url"
                    value={linkLaporanKemajuan}
                    onChange={(e) => setLinkLaporanKemajuan(e.target.value)}
                    placeholder={
                      penelitian.linkLaporanKemajuan ||
                      "Masukkan link laporan kemajuan..."
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="statusLuaran">Status Luaran</Label>
                  <Textarea
                    id="statusLuaran"
                    value={statusLuaran}
                    onChange={(e) => setStatusLuaran(e.target.value)}
                    placeholder="Jelaskan status progress luaran penelitian..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            ) : isInputEnabled() && modalType === "100%" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkLaporanAkhir">Link Laporan Akhir</Label>
                  <Input
                    id="linkLaporanAkhir"
                    type="url"
                    value={linkLaporanAkhir}
                    onChange={(e) => setLinkLaporanAkhir(e.target.value)}
                    placeholder={
                      penelitian.linkLaporanAkhir ||
                      "Masukkan link laporan akhir..."
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="linkLuaran">Link Luaran</Label>
                  <Textarea
                    id="linkLuaran"
                    value={linkLuaran}
                    onChange={(e) => setLinkLuaran(e.target.value)}
                    placeholder="Masukkan link-link luaran penelitian (publikasi, HKI, dll)..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex gap-2 mt-4">
              {isInputEnabled() && (
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className={
                    modalType === "60%"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                  size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              )}

              {getRelevantLink() && (
                <Button
                  onClick={() => window.open(getRelevantLink()!, "_blank")}
                  variant="outline"
                  size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Dokumen
                </Button>
              )}
            </div>
          </div>

          {/* Dokumen Lainnya */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Dokumen Lainnya</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">📄 Proposal Penelitian</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(penelitian.linkProposal, "_blank")
                  }>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka di Tab Baru
                </Button>
              </div>

              {penelitian.linkLaporanKemajuan && modalType !== "60%" && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">📊 Laporan Kemajuan (60%)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(penelitian.linkLaporanKemajuan!, "_blank")
                    }>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buka di Tab Baru
                  </Button>
                </div>
              )}

              {penelitian.linkLaporanAkhir && modalType !== "100%" && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">📋 Laporan Akhir (100%)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(penelitian.linkLaporanAkhir!, "_blank")
                    }>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buka di Tab Baru
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
