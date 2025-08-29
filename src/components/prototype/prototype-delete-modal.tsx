"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Prototype } from "@/types/pkm-types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface PrototypeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // support async
  prototype: Prototype | null;
}

export function PrototypeDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  prototype,
}: PrototypeDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!prototype) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      toast.error("Gagal menghapus prototype", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border border-red-200 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            Hapus Prototype
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 font-medium">
            Apakah Anda yakin ingin menghapus prototype{" "}
            <span className="font-bold text-slate-800">
              {prototype.namaPrototype}
            </span>
            ?
            <br />
            <br />
            <span className="text-red-600 font-semibold">
              Tindakan ini tidak dapat dibatalkan
            </span>{" "}
            dan akan menghapus semua data yang terkait dengan prototype ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">
            Batal
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg font-medium">
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
