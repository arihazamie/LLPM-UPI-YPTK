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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Pengabdian } from "@/types/pkm-types";
import { StatusPengabdian, KategoriPengabdian } from "@/types/pkm-types";
import { ExternalLink } from "lucide-react";

interface PengabdianReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengabdian: Pengabdian;
  onSubmit: (data: {
    status: StatusPengabdian;
    reviewNotes: string;
    approvalNotes?: string;
  }) => void;
}

const getKategoriLabel = (kategori: KategoriPengabdian) => {
  switch (kategori) {
    case KategoriPengabdian.PENGABDIAN_DOSEN_PEMULA:
      return "Pengabdian Dosen Pemula";
    case KategoriPengabdian.PENGABDIAN_TERAPAN:
      return "Pengabdian Terapan";
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
      return kategori.replace(/_/g, " ");
  }
};

const getStatusColor = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return "bg-yellow-100 text-yellow-800";
    case StatusPengabdian.ACC_PROPOSAL:
      return "bg-blue-100 text-blue-800";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "bg-orange-100 text-orange-800";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return "bg-blue-100 text-blue-800";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "bg-purple-100 text-purple-800";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_100:
      return "bg-blue-100 text-blue-800";
    case StatusPengabdian.SELESAI:
      return "bg-green-100 text-green-800";
    case StatusPengabdian.DITOLAK:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return "Review";
    case StatusPengabdian.ACC_PROPOSAL:
      return "Proposal Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "Review Laporan Kemajuan 60%";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return "Laporan Kemajuan 60% Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "Review Laporan Kemajuan 100%";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_100:
      return "Laporan Kemajuan 100% Disetujui";
    case StatusPengabdian.SELESAI:
      return "Selesai";
    case StatusPengabdian.DITOLAK:
      return "Ditolak";
    default:
      return status;
  }
};

export default function PengabdianReviewModal({
  isOpen,
  onClose,
  pengabdian,
  onSubmit,
}: PengabdianReviewModalProps) {
  const [status, setStatus] = useState<StatusPengabdian>(pengabdian.statusPengabdian);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewNotes.trim()) {
      toast.error("Catatan review wajib diisi");
      return;
    }

    onSubmit({
      status,
      reviewNotes: reviewNotes.trim(),
      approvalNotes: approvalNotes.trim() || undefined,
    });
  };

  const ketua = pengabdian.dosenPengabdian.find(
    (d) => d.roleDosenPengabdian === "KETUA"
  );
  const anggota = pengabdian.dosenPengabdian.filter(
    (d) => d.roleDosenPengabdian === "ANGGOTA"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Review Pengabdian
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Judul Pengabdian</h3>
              <p className="text-gray-700">{pengabdian.judulPengabdian}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status Saat Ini</h3>
              <Badge className={getStatusColor(pengabdian.statusPengabdian)}>
                {getStatusLabel(pengabdian.statusPengabdian)}
              </Badge>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Kategori Pengabdian</h3>
              <p className="text-gray-700">
                {getKategoriLabel(pengabdian.kategoriPengabdian)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Lama Kegiatan</h3>
              <p className="text-gray-700">{pengabdian.lamaKegiatan}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tahun Kegiatan</h3>
              <p className="text-gray-700">{pengabdian.tahunKegiatan}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Anggaran</h3>
              <p className="text-gray-700">
                {pengabdian.anggaran
                  ? `Rp ${pengabdian.anggaran.toLocaleString("id-ID")}`
                  : "Tidak ada anggaran"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Sumber Anggaran</h3>
              <p className="text-gray-700">
                {pengabdian.sumberAnggaran || "Tidak ada sumber anggaran"}
              </p>
            </div>
          </div>

          {/* Luaran */}
          {pengabdian.luaran && pengabdian.luaran.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Luaran</h3>
              <div className="flex flex-wrap gap-2">
                {pengabdian.luaran.map((luaran, index) => (
                  <Badge key={index} variant="outline">
                    {luaran.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dosen Pengabdian */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dosen Pengabdian</h3>
            <div className="space-y-4">
              {/* Ketua */}
              {ketua && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-blue-600 mb-2">Ketua Pengabdian</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><span className="font-medium">Nama:</span> {ketua.namaDosen}</p>
                    <p><span className="font-medium">NIDN:</span> {ketua.NIDN}</p>
                    <p><span className="font-medium">Program Studi:</span> {ketua.programStudiDosenPengabdian.replace(/_/g, " ")}</p>
                  </div>
                </div>
              )}

              {/* Anggota */}
              {anggota.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-green-600 mb-2">Anggota Pengabdian</h4>
                  <div className="space-y-2">
                    {anggota.map((dosen, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p><span className="font-medium">Nama:</span> {dosen.namaDosen}</p>
                        <p><span className="font-medium">NIDN:</span> {dosen.NIDN}</p>
                        <p><span className="font-medium">Program Studi:</span> {dosen.programStudiDosenPengabdian.replace(/_/g, " ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dokumen</h3>
            
            {/* Link Proposal */}
            <div>
              <Label className="text-sm font-medium">Link Proposal</Label>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-600 flex-1 truncate">
                  {pengabdian.linkProposal}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pengabdian.linkProposal, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Link Laporan Kemajuan */}
            {pengabdian.linkLaporanKemajuan && (
              <div>
                <Label className="text-sm font-medium">Link Laporan Kemajuan</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 flex-1 truncate">
                    {pengabdian.linkLaporanKemajuan}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(pengabdian.linkLaporanKemajuan, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Link Laporan Akhir */}
            {pengabdian.linkLaporanAkhir && (
              <div>
                <Label className="text-sm font-medium">Link Laporan Akhir</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 flex-1 truncate">
                    {pengabdian.linkLaporanAkhir}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(pengabdian.linkLaporanAkhir, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Form Review</h3>
            
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as StatusPengabdian)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(StatusPengabdian).map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {getStatusLabel(statusOption)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Review Notes */}
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Catatan Review *</Label>
              <Textarea
                id="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Masukkan catatan review..."
                rows={4}
                required
              />
            </div>

            {/* Approval Notes */}
            <div className="space-y-2">
              <Label htmlFor="approvalNotes">Catatan Approval (Opsional)</Label>
              <Textarea
                id="approvalNotes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Masukkan catatan approval..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
