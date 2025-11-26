"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  FileText,
  Book,
  ExternalLink,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Artikel {
  id: string;
  judul: string;
  author: string[];
  namaArtikel: string;
  publisher: string;
  kategori: string;
  level?: string;
  linkArtikel: string;
}

interface HKI {
  id: string;
  author: string[];
  nomorPenciptaan: string;
  tanggalPermohonan: string;
  jenisCiptaan: string;
  judulCiptaan: string;
  linkSertifikat: string;
}

interface Buku {
  id: string;
  author: string[];
  judulBuku: string;
  penerbit: string;
  isbn: string;
  tahun: number;
  jenisBuku: string;
  linkBuku: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "artikel" | "hki" | "buku";
  data: unknown[] | null | undefined;
  title: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "artikel":
      return <Award className="w-5 h-5 text-red-500" />;
    case "hki":
      return <FileText className="w-5 h-5 text-yellow-500" />;
    case "buku":
      return <Book className="w-5 h-5 text-orange-500" />;
    default:
      return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "artikel":
      return "bg-red-50 border-red-200 text-red-700";
    case "hki":
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    case "buku":
      return "bg-orange-50 border-orange-200 text-orange-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

export function DetailModal({
  isOpen,
  onClose,
  type,
  data,
  title,
}: DetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderArtikel = (artikel: Artikel) => (
    <Card
      key={artikel.id}
      className="mb-4 border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {artikel.judul}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200">
            {artikel.kategori}
          </Badge>
          {artikel.level && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200">
              Level: {artikel.level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Penulis:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {artikel.author.join(", ")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Artikel:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">{artikel.namaArtikel}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Publisher:
            </span>
          </div>
          <p className="text-sm text-gray-600 ml-6">{artikel.publisher}</p>
        </div>
        {artikel.linkArtikel && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(artikel.linkArtikel, "_blank")}
              className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Artikel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderHKI = (hki: HKI) => (
    <Card
      key={hki.id}
      className="mb-4 border-l-4 border-l-yellow-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {hki.judulCiptaan}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {hki.jenisCiptaan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Pencipta:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {hki.author.join(", ")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Nomor Penciptaan:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">{hki.nomorPenciptaan}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Tanggal Permohonan:
            </span>
          </div>
          <p className="text-sm text-gray-600 ml-6">
            {formatDate(hki.tanggalPermohonan)}
          </p>
        </div>
        {hki.linkSertifikat && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(hki.linkSertifikat, "_blank")}
              className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Sertifikat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBuku = (buku: Buku) => (
    <Card
      key={buku.id}
      className="mb-4 border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {buku.judulBuku}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200">
            {buku.jenisBuku}
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200">
            {buku.tahun}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Penulis:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {buku.author.join(", ")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Penerbit:
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-6">{buku.penerbit}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">ISBN:</span>
          </div>
          <p className="text-sm text-gray-600 ml-6">{buku.isbn}</p>
        </div>
        {buku.linkBuku && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(buku.linkBuku, "_blank")}
              className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Buku
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getTypeColor(
              type
            )}`}>
            {getTypeIcon(type)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada data {type}
          </h3>
          <p className="text-gray-500 text-center">
            Belum ada data {type} yang ditambahkan untuk Penelitian ini.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {type === "artikel" &&
          (data as unknown[]).map((a) => renderArtikel(a as Artikel))}
        {type === "hki" && (data as unknown[]).map((h) => renderHKI(h as HKI))}
        {type === "buku" &&
          (data as unknown[]).map((b) => renderBuku(b as Buku))}
      </div>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTypeIcon(type)}
            <span>{title}</span>
            <Badge
              variant="secondary"
              className="ml-2">
              {Array.isArray(data) ? data.length : 0} item
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="py-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
