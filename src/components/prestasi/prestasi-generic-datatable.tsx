"use client";

import { DataTable, Column } from "@/components/ui/data-table";
import { User, Trophy, ExternalLink, Calendar } from "lucide-react";
import type { Prestasi } from "@/types/pkm-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PrestasiGenericDataTableProps {
  data: Prestasi[];
  onEdit: (prestasi: Prestasi) => void;
  onDelete: (prestasi: Prestasi) => void;
  isLoading?: boolean;
}

export function PrestasiGenericDataTable({
  data,
  onEdit,
  onDelete,
  isLoading,
}: PrestasiGenericDataTableProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTingkatColor = (tingkat: string) => {
    const tingkatLower = tingkat.toLowerCase();
    if (tingkatLower.includes("nasional")) return "bg-blue-100 text-blue-800";
    if (tingkatLower.includes("internasional"))
      return "bg-purple-100 text-purple-800";
    if (tingkatLower.includes("provinsi")) return "bg-green-100 text-green-800";
    if (tingkatLower.includes("kota") || tingkatLower.includes("kabupaten"))
      return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPeringkatColor = (peringkat: string) => {
    const peringkatLower = peringkat.toLowerCase();
    if (peringkatLower.includes("1") || peringkatLower.includes("pertama"))
      return "bg-yellow-100 text-yellow-800";
    if (peringkatLower.includes("2") || peringkatLower.includes("kedua"))
      return "bg-gray-100 text-gray-800";
    if (peringkatLower.includes("3") || peringkatLower.includes("ketiga"))
      return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  const columns: Column<Prestasi>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <span className="font-mono text-sm text-red-600">#{prestasi.id}</span>
      ),
      width: "80px",
    },
    {
      key: "namaPrestasi",
      header: "Nama Prestasi",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-800">
            {prestasi.namaPrestasi}
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <Badge
              variant="secondary"
              className="text-xs">
              {prestasi.jenisPretasi}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "peringkatJuara",
      header: "Peringkat",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <Badge className={getPeringkatColor(prestasi.peringkatJuara)}>
          {prestasi.peringkatJuara}
        </Badge>
      ),
      width: "120px",
    },
    {
      key: "tingkat",
      header: "Tingkat",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <Badge className={getTingkatColor(prestasi.tingkat)}>
          {prestasi.tingkat}
        </Badge>
      ),
      width: "140px",
    },
    {
      key: "penyelenggara",
      header: "Penyelenggara",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <div className="text-sm text-slate-600 max-w-xs truncate">
          {prestasi.penyelenggara}
        </div>
      ),
    },
    {
      key: "tanggal",
      header: "Tanggal",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-sm">{formatDate(prestasi.tanggal)}</span>
        </div>
      ),
      width: "120px",
    },
    {
      key: "linkSertifikat",
      header: "Sertifikat",
      render: (prestasi: Prestasi) =>
        prestasi.linkSertifikat ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600">
            <a
              href={prestasi.linkSertifikat}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span className="text-xs">Lihat</span>
            </a>
          </Button>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
      width: "100px",
    },
    {
      key: "createdBy",
      header: "Dibuat Oleh",
      render: (prestasi: Prestasi) =>
        prestasi.createdBy && (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-slate-400" />
            <span className="text-sm text-slate-600">
              {prestasi.createdBy.name || prestasi.createdBy.email}
            </span>
          </div>
        ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <div className="text-sm text-slate-500">
          {formatDate(prestasi.createdAt)}
        </div>
      ),
      width: "120px",
    },
    {
      key: "updatedAt",
      header: "Terakhir Update",
      sortable: true,
      render: (prestasi: Prestasi) => (
        <div className="text-sm text-slate-500">
          {formatDateTime(prestasi.updatedAt)}
        </div>
      ),
      width: "140px",
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchFields={[
        "namaPrestasi",
        "jenisPretasi",
        "penyelenggara",
        "tingkat",
      ]}
      searchPlaceholder="Cari prestasi..."
      onEdit={onEdit}
      onDelete={onDelete}
      isLoading={isLoading}
      emptyMessage="Tidak ada data prestasi ditemukan"
      emptyIcon={<Trophy className="w-8 h-8 text-slate-400" />}
    />
  );
}
