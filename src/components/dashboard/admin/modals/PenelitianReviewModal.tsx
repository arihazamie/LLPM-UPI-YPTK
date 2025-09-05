"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusPenelitian } from "@/types/pkm-types";
import type { Penelitian } from "@/types/pkm-types";

interface PenelitianReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    status: StatusPenelitian;
    reviewNotes: string;
    approvalNotes?: string;
  }) => Promise<boolean>;
  penelitian: Penelitian | null;
}

export default function PenelitianReviewModal({
  isOpen,
  onClose,
  onSubmit,
  penelitian,
}: PenelitianReviewModalProps) {
  const [status, setStatus] = useState<StatusPenelitian>(
    StatusPenelitian.ACC_PROPOSAL
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewNotes.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        status,
        reviewNotes: reviewNotes.trim(),
        approvalNotes: approvalNotes.trim() || undefined,
      });

      if (success) {
        setReviewNotes("");
        setApprovalNotes("");
        setStatus(StatusPenelitian.ACC_PROPOSAL);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReviewNotes("");
      setApprovalNotes("");
      setStatus(StatusPenelitian.ACC_PROPOSAL);
      onClose();
    }
  };

  if (!penelitian) return null;

  // Determine available status options based on current status
  const getAvailableStatuses = (currentStatus: StatusPenelitian) => {
    switch (currentStatus) {
      case StatusPenelitian.REVIEW:
        return [
          { value: StatusPenelitian.ACC_PROPOSAL, label: "Setujui Proposal" },
          { value: StatusPenelitian.DITOLAK, label: "Tolak" },
        ];
      case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
        return [
          {
            value: StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60,
            label: "Setujui Laporan 60%",
          },
          { value: StatusPenelitian.DITOLAK, label: "Tolak" },
        ];
      case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
        return [
          {
            value: StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100,
            label: "Setujui Laporan 100%",
          },
          { value: StatusPenelitian.DITOLAK, label: "Tolak" },
        ];
      case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
        return [
          { value: StatusPenelitian.SELESAI, label: "Selesaikan Penelitian" },
          { value: StatusPenelitian.DITOLAK, label: "Tolak" },
        ];
      default:
        return [{ value: StatusPenelitian.DITOLAK, label: "Tolak" }];
    }
  };

  const availableStatuses = getAvailableStatuses(penelitian.statusPenelitian);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Penelitian</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Penelitian Info */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Judul Penelitian</Label>
              <p className="text-sm text-gray-600 mt-1">
                {penelitian.judulPenelitian}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {penelitian.kategoriPenelitian}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Tahun Kegiatan</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {penelitian.tahunKegiatan}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tim Peneliti</Label>
              <div className="text-sm text-gray-600 mt-1">
                {penelitian.dosenPenelitian.map((dosen, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2">
                    <span className="font-medium">{dosen.namaDosen}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {dosen.roleDosenPenelitian}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status Review</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as StatusPenelitian)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reviewNotes">Catatan Review *</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Masukkan catatan review..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="approvalNotes">
                Catatan Persetujuan (Opsional)
              </Label>
              <Textarea
                id="approvalNotes"
                placeholder="Masukkan catatan persetujuan..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reviewNotes.trim()}
            className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Menyimpan..." : "Simpan Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
