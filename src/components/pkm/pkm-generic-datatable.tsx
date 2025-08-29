"use client";

import { DataTable, Column } from "@/components/ui/data-table";
import { User, Award, FileText, Book, Eye } from "lucide-react";
import type { PKM, Publikasi, HKI, Buku } from "@/types/pkm-types";
import { ExternalLinkButton } from "./external-link-button";
import { Button } from "@/components/ui/button";

interface PKMGenericDataTableProps {
  data: PKM[];
  onEdit: (pkm: PKM) => void;
  onDelete: (pkm: PKM) => void;
  onViewDetail: (
    type: "publikasi" | "hki" | "buku",
    data: Publikasi[] | HKI[] | Buku[],
    title: string
  ) => void;
  isLoading?: boolean;
}

export function PKMGenericDataTable({
  data,
  onEdit,
  onDelete,
  onViewDetail,
  isLoading,
}: PKMGenericDataTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cek apakah ada data publikasi, HKI, atau buku di seluruh dataset
  const hasPublikasi = data.some(
    (pkm) => pkm.publikasi && pkm.publikasi.length > 0
  );
  const hasHKI = data.some((pkm) => pkm.hki && pkm.hki.length > 0);
  const hasBuku = data.some((pkm) => pkm.buku && pkm.buku.length > 0);

  const columns: Column<PKM>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      render: (pkm: PKM) => `#${pkm.id}`,
      width: "80px",
    },
    {
      key: "proposal",
      header: "Proposal",
      sortable: true,
      render: (pkm: PKM) => (
        <ExternalLinkButton
          href={pkm.proposal}
          label="Lihat Proposal"
          variant="proposal"
        />
      ),
    },
    {
      key: "laporan",
      header: "Laporan",
      sortable: true,
      render: (pkm: PKM) => (
        <ExternalLinkButton
          href={pkm.laporan}
          label="Lihat Laporan"
          variant="laporan"
        />
      ),
    },
    // Hanya tampilkan kolom Publikasi jika ada data
    ...(hasPublikasi
      ? [
          {
            key: "publikasi",
            header: "Publikasi",
            render: (pkm: PKM) => (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-red-500" />
                  <span className="text-sm">
                    {pkm.publikasi && pkm.publikasi.length > 0 ? (
                      <span className="text-red-600 font-medium">
                        {pkm.publikasi.length}
                      </span>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </span>
                </div>
                {pkm.publikasi && pkm.publikasi.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onViewDetail(
                        "publikasi",
                        pkm.publikasi!,
                        `Detail Publikasi PKM #${pkm.id}`
                      )
                    }
                    className="h-6 w-6 p-0 hover:bg-red-50">
                    <Eye className="w-3 h-3 text-red-500" />
                  </Button>
                )}
              </div>
            ),
            width: "120px",
          },
        ]
      : []),
    // Hanya tampilkan kolom HKI jika ada data
    ...(hasHKI
      ? [
          {
            key: "hki",
            header: "HKI",
            render: (pkm: PKM) => (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">
                    {pkm.hki && pkm.hki.length > 0 ? (
                      <span className="text-red-600 font-medium">
                        {pkm.hki.length}
                      </span>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </span>
                </div>
                {pkm.hki && pkm.hki.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onViewDetail("hki", pkm.hki!, `Detail HKI PKM #${pkm.id}`)
                    }
                    className="h-6 w-6 p-0 hover:bg-yellow-50">
                    <Eye className="w-3 h-3 text-yellow-500" />
                  </Button>
                )}
              </div>
            ),
            width: "100px",
          },
        ]
      : []),
    // Hanya tampilkan kolom Buku jika ada data
    ...(hasBuku
      ? [
          {
            key: "buku",
            header: "Buku",
            render: (pkm: PKM) => (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Book className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    {pkm.buku && pkm.buku.length > 0 ? (
                      <span className="text-red-600 font-medium">
                        {pkm.buku.length}
                      </span>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </span>
                </div>
                {pkm.buku && pkm.buku.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onViewDetail(
                        "buku",
                        pkm.buku!,
                        `Detail Buku PKM #${pkm.id}`
                      )
                    }
                    className="h-6 w-6 p-0 hover:bg-orange-50">
                    <Eye className="w-3 h-3 text-orange-500" />
                  </Button>
                )}
              </div>
            ),
            width: "100px",
          },
        ]
      : []),
    {
      key: "createdBy",
      header: "Dibuat Oleh",
      render: (pkm: PKM) =>
        pkm.createdBy && (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-sm">
              {pkm.createdBy.name || pkm.createdBy.email}
            </span>
          </div>
        ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (pkm: PKM) => formatDate(pkm.createdAt.toString()),
      width: "120px",
    },
    {
      key: "updatedAt",
      header: "Terakhir Update",
      sortable: true,
      render: (pkm: PKM) => formatDateTime(pkm.updatedAt.toString()),
      width: "140px",
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchFields={["id", "proposal", "laporan"]}
      searchPlaceholder="Cari PKM..."
      onEdit={onEdit}
      onDelete={onDelete}
      isLoading={isLoading}
      emptyMessage="Tidak ada data PKM ditemukan"
      emptyIcon={<FileText className="w-8 h-8 text-gray-400" />}
    />
  );
}
