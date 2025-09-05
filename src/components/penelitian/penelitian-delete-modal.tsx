"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Penelitian } from "@/types/pkm-types";

interface PenelitianDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  penelitian: Penelitian | null;
}

export function PenelitianDeleteModal({
  isOpen,
  onClose,
  onDelete,
  penelitian,
}: PenelitianDeleteModalProps) {
  const handleDelete = async () => {
    if (penelitian) {
      await onDelete(penelitian.id);
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
            Hapus Penelitian
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Anda yakin ingin menghapus penelitian ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
          </div>

          {penelitian && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 mb-2">
                Detail Penelitian:
              </h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Judul:</span>{" "}
                  {penelitian.judulPenelitian}
                </p>
                <p>
                  <span className="font-medium">Kategori:</span>{" "}
                  {penelitian.kategoriPenelitian}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {penelitian.statusPenelitian}
                </p>
                <p>
                  <span className="font-medium">Tahun Kegiatan:</span>{" "}
                  {penelitian.tahunKegiatan}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}>
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Penelitian
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
