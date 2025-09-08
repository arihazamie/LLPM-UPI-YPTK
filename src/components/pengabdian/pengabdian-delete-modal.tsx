"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Pengabdian } from "@/types/pkm-types";

interface PengabdianDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  pengabdian: Pengabdian | null;
}

export function PengabdianDeleteModal({
  isOpen,
  onClose,
  onDelete,
  pengabdian,
}: PengabdianDeleteModalProps) {
  const handleDelete = async () => {
    if (pengabdian) {
      await onDelete(pengabdian.id);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Hapus Pengabdian
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Anda yakin ingin menghapus pengabdian ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
          </div>

          {pengabdian && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 mb-2">
                Detail Pengabdian:
              </h4>
              <p className="text-sm text-slate-600 mb-1">
                <span className="font-medium">Judul:</span>{" "}
                {pengabdian.judulPengabdian}
              </p>
              <p className="text-sm text-slate-600 mb-1">
                <span className="font-medium">Kategori:</span>{" "}
                {pengabdian.kategoriPengabdian.replace(/_/g, " ")}
              </p>
              <p className="text-sm text-slate-600 mb-1">
                <span className="font-medium">Tahun:</span>{" "}
                {pengabdian.tahunKegiatan}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Status:</span>{" "}
                {pengabdian.statusPengabdian.replace(/_/g, " ")}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800">
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Pengabdian
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
