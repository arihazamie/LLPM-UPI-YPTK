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
import type { Pengabdian } from "@/types/pkm-types";
import { StatusPengabdian } from "@/types/pkm-types";
import { Skeleton } from "@/components/ui/skeleton";
import PengabdianDetailModal from "./pengabdian-detail-modal";

interface PengabdianGenericDataTableProps {
  data: Pengabdian[];
  isLoading?: boolean;
}

const getStatusColor = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return "bg-yellow-100 text-yellow-800";
    case StatusPengabdian.ACC_PROPOSAL:
      return "bg-blue-100 text-blue-800";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "bg-orange-100 text-orange-800";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return "bg-blue-100 text-blue-800";
    case StatusPengabdian.SELESAI:
      return "bg-green-100 text-green-800";
    case StatusPengabdian.DITOLAK:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return "📋 Review";
    case StatusPengabdian.ACC_PROPOSAL:
      return "✅ Proposal Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "📊 Review Laporan 60%";
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return "✅ Laporan 60% Disetujui";
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "📊 Review Laporan 100%";
    case StatusPengabdian.SELESAI:
      return "🎉 Selesai";
    case StatusPengabdian.DITOLAK:
      return "❌ Ditolak";
    default:
      return status;
  }
};

// Fungsi untuk mendapatkan persentase kemajuan berdasarkan status
const getProgressPercentage = (status: StatusPengabdian) => {
  switch (status) {
    case StatusPengabdian.REVIEW:
      return 10;
    case StatusPengabdian.ACC_PROPOSAL:
      return 20;
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60:
      return 40;
    case StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60:
      return 60;
    case StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_100:
      return 90;
    case StatusPengabdian.SELESAI:
      return 100;
    case StatusPengabdian.DITOLAK:
      return 0;
    default:
      return 0;
  }
};

export function PengabdianGenericDataTable({
  data,
  isLoading = false,
}: PengabdianGenericDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedPengabdian, setSelectedPengabdian] =
    useState<Pengabdian | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"60%" | "100%">("60%");

  const filteredData = useMemo(() => {
    return data.filter(
      (pengabdian) =>
        pengabdian.judulPengabdian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pengabdian.kategoriPengabdian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pengabdian.statusPengabdian
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pengabdian.lamaKegiatan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pengabdian.dosenPengabdian.some((dosen) =>
          dosen.namaDosen.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        pengabdian.luaran.some((luaran) =>
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

  const handleDetailModal = (pengabdian: Pengabdian, type: "60%" | "100%") => {
    setSelectedPengabdian(pengabdian);
    setModalType(type);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPengabdian(null);
  };

  const handlePengabdianUpdate = (updatedData: {
    linkLaporanKemajuan?: string;
    linkLaporanAkhir?: string;
  }) => {
    // Refresh data setelah update
    // Bisa ditambahkan callback ke parent component jika diperlukan
    console.log("Pengabdian updated:", updatedData);
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
            placeholder="Cari pengabdian..."
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
            <div className="text-sm text-gray-600">Total Pengabdian</div>
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
            Data Pengabdian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Pengabdian</TableHead>
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
                            : "Belum ada data Pengabdian"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((pengabdian) => (
                    <TableRow key={pengabdian.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium">
                            {pengabdian.judulPengabdian}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {pengabdian.lamaKegiatan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {pengabdian.tahunKegiatan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            className={getStatusColor(
                              pengabdian.statusPengabdian
                            )}>
                            {getStatusLabel(pengabdian.statusPengabdian)}
                          </Badge>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${getProgressPercentage(
                                  pengabdian.statusPengabdian
                                )}%`,
                              }}
                              title={`Progress: ${getProgressPercentage(
                                pengabdian.statusPengabdian
                              )}%`}></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Progress:{" "}
                            {getProgressPercentage(pengabdian.statusPengabdian)}
                            %
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDetailModal(pengabdian, "60%")}
                            className="h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                            60%
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDetailModal(pengabdian, "100%")
                            }
                            className="h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                            100%
                          </Button>

                          {/* Tampilkan dua tombol cetak setelah proposal ACC hingga seterusnya */}
                          {[
                            StatusPengabdian.ACC_PROPOSAL,
                            StatusPengabdian.REVIEW_LAPORAN_KEMAJUAN_60,
                            StatusPengabdian.ACC_LAPORAN_KEMAJUAN_60,
                            StatusPengabdian.SELESAI,
                          ].includes(pengabdian.statusPengabdian) && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `/simlit/pengabdian/surat-tugas?id=${pengabdian.id}`,
                                    "_blank"
                                  )
                                }
                                className="h-8 bg-white hover:bg-gray-100 text-gray-700 border-gray-200">
                                Cetak Surat Tugas
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `/simlit/pengabdian/surat-pengambilan-data?id=${pengabdian.id}`,
                                    "_blank"
                                  )
                                }
                                className="h-8 bg-white hover:bg-gray-100 text-gray-700 border-gray-200">
                                Cetak Surat Pengambilan Data
                              </Button>
                            </>
                          )}
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
      <PengabdianDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        pengabdian={selectedPengabdian}
        modalType={modalType}
        onUpdate={handlePengabdianUpdate}
      />
    </div>
  );
}
