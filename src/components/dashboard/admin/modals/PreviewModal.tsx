"use client";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, MapPinIcon } from "lucide-react";
import { type Post, PostType } from "@/types/post-type";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Post | null;
}

export function PreviewModal({ isOpen, onClose, data }: PreviewModalProps) {
  if (!data) return null;

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

  const getTypeBadgeColor = (type: PostType) => {
    switch (type) {
      case PostType.ARTIKEL:
        return "bg-blue-500 text-white";
      case PostType.BERITA:
        return "bg-red-500 text-white";
      case PostType.PENGUMUMAN:
        return "bg-yellow-500 text-white";
      case PostType.AGENDA:
        return "bg-green-500 text-white";
      case PostType.WEBINAR:
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6">
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
            <h2 className="text-2xl font-bold text-gray-900">
              Preview {getTypeLabel(data.type)}
            </h2>
            <p className="text-sm text-gray-600">LPPM UPI YPTK Padang</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {data.title}
            </h3>

            {/* Type badge and metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={getTypeBadgeColor(data.type)}>
                {getTypeLabel(data.type)}
              </Badge>
            </div>

            {/* Thumbnail */}
            {data.thumbnail && (
              <div className="mb-4">
                <Image
                  src={data.thumbnail || "/placeholder.svg"}
                  alt={data.title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  width={800}
                  height={600}
                />
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-yellow-500" />
                <span>Penulis: {data.author.name || data.author.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-red-500" />
                <span>Dibuat: {formatDate(data.createdAt)}</span>
              </div>

              {data.startDate && (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-green-500" />
                  <span>Mulai: {formatDate(data.startDate)}</span>
                </div>
              )}

              {data.endDate && (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-red-500" />
                  <span>Selesai: {formatDate(data.endDate)}</span>
                </div>
              )}

              {data.location && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-yellow-500" />
                  <span>Lokasi: {data.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content preview */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Konten:</h4>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {data.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white">
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
