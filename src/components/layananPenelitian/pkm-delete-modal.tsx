"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";

interface PKMDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export function PKMDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading = false,
}: PKMDeleteModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
            <Image
              src="/logo.png"
              alt="UPI YPTK Logo"
              width={48}
              height={48}
            />
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Konfirmasi Hapus
              </DialogTitle>
              <p className="text-sm text-gray-600">LPPM UPI YPTK Padang</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="w-8 h-8 text-red-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Penelitian?
              </h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus Penelitian {`"${title}"`}?
                Semua data terkait termasuk artikel, HKI, dan buku akan ikut
                terhapus. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              disabled={loading}>
              Batal
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={loading}>
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
