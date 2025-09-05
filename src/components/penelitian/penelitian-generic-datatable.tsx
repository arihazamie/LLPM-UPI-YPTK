"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, BookOpen } from "lucide-react";
import type { Penelitian } from "@/types/pkm-types";
import { StatusPenelitian } from "@/types/pkm-types";
import { Skeleton } from "@/components/ui/skeleton";
import PenelitianDetailModal from "./penelitian-detail-modal";

interface PenelitianGenericDataTableProps {
  data: Penelitian[];
  isLoading?: boolean;
}

const getStatusColor = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "bg-yellow-100 text-yellow-800";
    case StatusPenelitian.ACC_PROPOSAL:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "bg-orange-100 text-orange-800";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "bg-purple-100 text-purple-800";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "bg-blue-100 text-blue-800";
    case StatusPenelitian.SELESAI:
      return "bg-green-100 text-green-800";
    case StatusPenelitian.DITOLAK:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "📋 Review";
    case StatusPenelitian.ACC_PROPOSAL:
      return "✅ Proposal Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "📊 Review Laporan 60%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "✅ Laporan 60% Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "📊 Review Laporan 100%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "✅ Laporan 100% Disetujui";
    case StatusPenelitian.SELESAI:
      return "🎉 Selesai";
    case StatusPenelitian.DITOLAK:
      return "❌ Ditolak";
    default:
      return status;
  }
};

export function PenelitianGenericDataTable({
  data,
  isLoading = false,
}: PenelitianGenericDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedPenelitian, setSelectedPenelitian] =
    useState<Penelitian | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"60%" | "100%">("60%");

  const filteredData = useMemo(() => {
    return data.filter(
      (penelitian) =>
        penelitian.judulPenelitian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        penelitian.kategoriPenelitian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        penelitian.statusPenelitian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        penelitian.lamaKegiatan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        penelitian.dosenPenelitian.some((dosen) =>
          dosen.namaDosen.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        penelitian.luaran.some((luaran) =>
          luaran.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDetailModal = (penelitian: Penelitian, type: "60%" | "100%") => {
    setSelectedPenelitian(penelitian);
    setModalType(type);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPenelitian(null);
  };

  const handlePenelitianUpdate = (updatedData: {
    linkLaporanKemajuan?: string;
    linkLaporanAkhir?: string;
  }) => {
    // Refresh data setelah update
    // Bisa ditambahkan callback ke parent component jika diperlukan
    console.log("Penelitian updated:", updatedData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari penelitian..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Card className="p-3">
            <div className="text-sm text-gray-600">Total Penelitian</div>
            <div className="text-2xl font-bold">{data.length}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-gray-600">Hasil Pencarian</div>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </Card>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Data Penelitian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Penelitian</TableHead>
                  <TableHead>Lama Kegiatan</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">
                          {searchTerm
                            ? "Tidak ada hasil yang ditemukan"
                            : "Belum ada data penelitian"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((penelitian) => (
                    <TableRow key={penelitian.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium">
                            {penelitian.judulPenelitian}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {penelitian.lamaKegiatan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {penelitian.tahunKegiatan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            penelitian.statusPenelitian
                          )}>
                          {getStatusLabel(penelitian.statusPenelitian)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          {/* Tombol 60% */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDetailModal(penelitian, "60%")}
                            className="h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                            60%
                          </Button>

                          {/* Tombol 100% */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDetailModal(penelitian, "100%")
                            }
                            className="h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                            100%
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} dari{" "}
                {filteredData.length} hasil
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}>
                  Sebelumnya
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <div
                      key={page}
                      className="flex gap-2">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 py-1 text-sm">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}>
                        {page}
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <PenelitianDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        penelitian={selectedPenelitian}
        modalType={modalType}
        onUpdate={handlePenelitianUpdate}
      />
    </div>
  );
}
