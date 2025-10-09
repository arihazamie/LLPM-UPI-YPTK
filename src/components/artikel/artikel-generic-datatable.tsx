"use client";

import { useMemo, useState, useCallback } from "react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { User, FileText, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Artikel } from "@/types/pkm-types";
import { KategoriArtikel } from "@/types/pkm-types";
import { ArtikelAddEditModal } from "./artikel-add-edit-modal";

const KATEGORI_COLORS: { [key in KategoriArtikel]?: string } = {
  [KategoriArtikel.OJS]: "bg-green-100 text-green-800",
  [KategoriArtikel.SINTA]: "bg-blue-100 text-blue-800",
  [KategoriArtikel.INTERNASIONAL]: "bg-purple-100 text-purple-800",
  [KategoriArtikel.WOS]: "bg-orange-100 text-orange-800",
  [KategoriArtikel.SCOPUS]: "bg-red-100 text-red-800",
};

interface ArtikelGenericDataTableProps {
  data: Artikel[];
  onEdit: (artikel: Artikel) => void;
  onDelete: (artikel: Artikel) => void;
  isLoading?: boolean;
}

export function ArtikelGenericDataTable({
  data,
  onEdit,
  onDelete,
  isLoading,
}: ArtikelGenericDataTableProps) {
  // Modal state for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState<Artikel | undefined>(
    undefined
  );

  // Date helpers
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Badge color helpers
  const getKategoriColor = useCallback(
    (kategori: KategoriArtikel) =>
      KATEGORI_COLORS[kategori] || "bg-gray-100 text-gray-800",
    []
  );

  const getLevelColor = useCallback((level?: string) => {
    if (!level) return "bg-gray-100 text-gray-800";
    const levelLower = level.toLowerCase();
    if (levelLower.includes("internasional"))
      return "bg-purple-100 text-purple-800";
    if (levelLower.includes("nasional")) return "bg-blue-100 text-blue-800";
    if (levelLower.includes("provinsi")) return "bg-green-100 text-green-800";
    if (levelLower.includes("kota") || levelLower.includes("kabupaten"))
      return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  }, []);

  // Columns without "Dibuat Oleh" and "Terakhir Update"
  const columns: Column<Artikel>[] = useMemo(
    () => [
      {
        key: "judul",
        header: "Judul",
        sortable: true,
        render: (artikel) => <div className="font-medium">{artikel.judul}</div>,
      },
      {
        key: "namaArtikel",
        header: "Nama Artikel",
        sortable: true,
        render: (artikel) => (
          <div className="font-medium">{artikel.namaArtikel}</div>
        ),
      },
      {
        key: "kategori",
        header: "Kategori",
        sortable: true,
        width: "120px",
        render: (artikel) => (
          <Badge className={getKategoriColor(artikel.kategori)}>
            {artikel.kategori}
          </Badge>
        ),
      },
      {
        key: "level",
        header: "Level",
        sortable: true,
        width: "140px",
        render: (artikel) => (
          <Badge className={getLevelColor(artikel.level)}>
            {artikel.level || "-"}
          </Badge>
        ),
      },
      {
        key: "publisher",
        header: "Publisher",
        sortable: true,
        render: (artikel) => (
          <div
            className="text-sm text-muted-foreground max-w-xs truncate"
            title={artikel.publisher}>
            {artikel.publisher}
          </div>
        ),
      },
      {
        key: "tanggalPublisher",
        header: "Tanggal Terbit",
        sortable: true,
        width: "120px",
        render: (artikel) => (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">
              {formatDate(artikel.tanggalPublisher)}
            </span>
          </div>
        ),
      },
      {
        key: "linkArtikel",
        header: "Link",
        width: "100px",
        render: (artikel) =>
          artikel.linkArtikel ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2">
              <a
                href={artikel.linkArtikel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
                aria-label="Buka link artikel">
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">Lihat</span>
              </a>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      },
      {
        key: "author",
        header: "Author",
        render: (artikel) =>
          artikel.author && artikel.author.length > 0 ? (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span
                className="text-sm text-muted-foreground truncate"
                title={artikel.author.join(", ")}>
                {artikel.author.join(", ")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      },
      // Removed:
      // { key: "createdBy", header: "Dibuat Oleh", ... }
      // { key: "updatedAt", header: "Terakhir Update", ... }
    ],
    [formatDate, getKategoriColor, getLevelColor]
  );

  // When Edit action is clicked in the table, open modal with row data
  const handleRowEdit = (row: Artikel) => {
    setEditingArtikel(row);
    setIsModalOpen(true);
  };

  const handleModalSave = (partial: Partial<Artikel>) => {
    if (!editingArtikel) return;
    // Merge changes onto the original artikel to satisfy onEdit(Artikel)
    const merged: Artikel = {
      ...editingArtikel,
      ...partial,
      // Ensure dates remain Date objects if partial provided a string date
      tanggalPublisher:
        partial.tanggalPublisher instanceof Date
          ? partial.tanggalPublisher
          : editingArtikel.tanggalPublisher,
    };
    onEdit(merged);
    setIsModalOpen(false);
    setEditingArtikel(undefined);
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        searchFields={[
          "judul",
          "namaArtikel",
          "publisher",
          "kategori",
          "level",
        ]}
        searchPlaceholder="Cari berdasarkan judul, publisher, dll..."
        onEdit={handleRowEdit}
        onDelete={onDelete}
        isLoading={isLoading}
        emptyMessage="Tidak ada data artikel yang ditemukan"
        emptyIcon={<FileText className="w-8 h-8 text-muted-foreground" />}
      />

      <ArtikelAddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArtikel(undefined);
        }}
        onSave={handleModalSave}
        artikel={editingArtikel}
      />
    </>
  );
}
