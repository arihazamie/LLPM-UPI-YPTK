"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import type { Prestasi } from "@/types/pkm-types";

interface PrestasiDeleteModalProps {
  prestasi: Prestasi | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function PrestasiDeleteModal({
  prestasi,
  isOpen,
  onClose,
  onDelete,
}: PrestasiDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!prestasi) return;

    setIsDeleting(true);
    try {
      await onDelete(prestasi.id);
      onClose();
    } catch (error) {
      console.error("Error deleting prestasi:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-slate-800">
                Hapus Prestasi
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-600">
                Tindakan ini tidak dapat dibatalkan
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {prestasi && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-red-800">
                Prestasi yang akan dihapus:
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-700">
                  <span className="font-medium">Nama:</span>{" "}
                  {prestasi.namaPrestasi}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Jenis:</span>{" "}
                  {prestasi.jenisPretasi}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Peringkat:</span>{" "}
                  {prestasi.peringkatJuara}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Tingkat:</span>{" "}
                  {prestasi.tingkat}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Penyelenggara:</span>{" "}
                  {prestasi.penyelenggara}
                </p>
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter className="space-x-3 pt-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="px-6">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 px-6">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Prestasi
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
