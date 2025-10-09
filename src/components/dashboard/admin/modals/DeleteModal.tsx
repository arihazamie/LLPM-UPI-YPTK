"use client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { PostType } from "@/types/post-type";
import Image from "next/image";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  type: PostType;
  loading?: boolean;
  labelOverride?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  type,
  loading = false,
  labelOverride,
}: DeleteModalProps) {
  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case PostType.ARTIKEL:
        return "Artikel";
      case PostType.BERITA:
        return "Berita";
      case PostType.PENGUMUMAN:
        return "Pengumuman";
      case PostType.AGENDA:
        return "Agenda";
      case PostType.WEBINAR:
        return "Webinar";
      default:
        return "Konten";
    }
  };

  const label = labelOverride ?? getTypeLabel(type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
          <Image
            src="/logo.png"
            alt="UPI YPTK Logo"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm text-gray-600">LPPM UPI YPTK Padang</p>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangleIcon className="w-8 h-8 text-red-500" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hapus {label}?
            </h3>
            <p className="text-gray-600 text-sm">
              Apakah Anda yakin ingin menghapus {`"${title}"`}? Tindakan ini
              tidak dapat dibatalkan.
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
    </Modal>
  );
}
