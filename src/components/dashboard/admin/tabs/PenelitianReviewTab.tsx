"use client";

import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  FileText,
  BookOpen,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { Penelitian } from "@/types/pkm-types";
import { StatusPenelitian, KategoriPenelitian } from "@/types/pkm-types";
import { Skeleton } from "@/components/ui/skeleton";
import PenelitianReviewModal from "../modals/PenelitianReviewModal";

const getStatusColor = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case StatusPenelitian.ACC_PROPOSAL:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case StatusPenelitian.SELESAI:
      return "bg-green-100 text-green-800 border-green-200";
    case StatusPenelitian.DITOLAK:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusLabel = (status: StatusPenelitian) => {
  switch (status) {
    case StatusPenelitian.REVIEW:
      return "Review Proposal";
    case StatusPenelitian.ACC_PROPOSAL:
      return "Proposal Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60:
      return "Review Laporan 60%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60:
      return "Laporan 60% Disetujui";
    case StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100:
      return "Review Laporan 100%";
    case StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100:
      return "Laporan 100% Disetujui";
    case StatusPenelitian.SELESAI:
      return "Selesai";
    case StatusPenelitian.DITOLAK:
      return "Ditolak";
    default:
      return status;
  }
};

const getKategoriLabel = (kategori: KategoriPenelitian) => {
  switch (kategori) {
    case KategoriPenelitian.PENELITIAN_DOSEN_PEMULA:
      return "Dosen Pemula";
    case KategoriPenelitian.PENELITIAN_TERAPAN:
      return "Terapan";
    case KategoriPenelitian.PENELITIAN_PENGEMBANGAN:
      return "Pengembangan";
    case KategoriPenelitian.PENELITIAN_UNGGULAN_PERGURUAN_TINGGI:
      return "Unggulan PT";
    case KategoriPenelitian.PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR:
      return "Guru Besar";
    case KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_NASIONAL:
      return "Mitra Nasional";
    case KategoriPenelitian.PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL:
      return "Mitra Internasional";
    default:
      return kategori;
  }
};

export default function PenelitianReviewTab() {
  console.log("PenelitianReviewTab rendered"); // Debug log
  const [penelitian, setPenelitian] = useState<Penelitian[]>([]);
  const [filteredData, setFilteredData] = useState<Penelitian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPenelitian, setSelectedPenelitian] =
    useState<Penelitian | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPenelitian = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/penelitian");
      if (!response.ok) {
        throw new Error("Failed to fetch penelitian");
      }
      const data = await response.json();
      setPenelitian(data.data || []);
    } catch (error) {
      console.error("Error fetching penelitian:", error);
      toast.error("Gagal mengambil data penelitian");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenelitian();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = penelitian;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.judulPenelitian.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.dosenPenelitian.some((d) =>
            d.namaDosen.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.statusPenelitian === statusFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [penelitian, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleReview = (penelitian: Penelitian) => {
    setSelectedPenelitian(penelitian);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData: {
    status: StatusPenelitian;
    reviewNotes: string;
    approvalNotes?: string;
  }) => {
    if (!selectedPenelitian?.id) {
      toast.error("Penelitian tidak ditemukan");
      return false;
    }

    try {
      console.log("Submitting review data:", {
        penelitianId: selectedPenelitian.id,
        reviewData,
      });

      const response = await fetch(
        `/api/admin/penelitian/${selectedPenelitian.id}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Review submission failed:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to submit review: ${response.status} ${response.statusText}`
        );
      }

      toast.success("Review berhasil disimpan");
      setIsReviewModalOpen(false);
      setSelectedPenelitian(null);
      fetchPenelitian(); // Refresh data
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        `Gagal menyimpan review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Review Penelitian
          </h1>
          <p className="text-muted-foreground">
            Kelola dan review proposal penelitian yang diajukan dosen
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan judul, pembuat, atau nama dosen..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="all">Semua Status</option>
            <option value={StatusPenelitian.REVIEW}>Review Proposal</option>
            <option value={StatusPenelitian.ACC_PROPOSAL}>
              Proposal Disetujui
            </option>
            <option value={StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60}>
              Review Laporan 60%
            </option>
            <option value={StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60}>
              Laporan 60% Disetujui
            </option>
            <option value={StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100}>
              Review Laporan 100%
            </option>
            <option value={StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100}>
              Laporan 100% Disetujui
            </option>
            <option value={StatusPenelitian.SELESAI}>Selesai</option>
            <option value={StatusPenelitian.DITOLAK}>Ditolak</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Menunggu Review
                </p>
                <p className="text-2xl font-bold">
                  {
                    penelitian.filter(
                      (p) =>
                        p.statusPenelitian === StatusPenelitian.REVIEW ||
                        p.statusPenelitian ===
                          StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_60 ||
                        p.statusPenelitian ===
                          StatusPenelitian.REVIEW_LAPORAN_KEMAJUAN_100
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Sedang Berjalan
                </p>
                <p className="text-2xl font-bold">
                  {
                    penelitian.filter((p) =>
                      [
                        StatusPenelitian.ACC_PROPOSAL,
                        StatusPenelitian.ACC_LAPORAN_KEMAJUAN_60,
                        StatusPenelitian.ACC_LAPORAN_KEMAJUAN_100,
                      ].includes(p.statusPenelitian)
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold">
                  {
                    penelitian.filter(
                      (p) => p.statusPenelitian === StatusPenelitian.SELESAI
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{penelitian.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Data Penelitian ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penelitian</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tim Peneliti</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Diajukan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">
                          {searchTerm || statusFilter !== "all"
                            ? "Tidak ada hasil yang ditemukan"
                            : "Belum ada data penelitian"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">
                            {p.judulPenelitian}
                          </div>
                          <div className="text-sm text-gray-500">
                            oleh {p.createdBy.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs">
                          {getKategoriLabel(p.kategoriPenelitian)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {p.dosenPenelitian.length} dosen
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ketua:{" "}
                          {p.dosenPenelitian.find(
                            (d) => d.roleDosenPenelitian === "KETUA"
                          )?.namaDosen || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{p.tahunKegiatan}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(p.statusPenelitian)}>
                          {getStatusLabel(p.statusPenelitian)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(p.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReview(p)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review & Detail
                            </DropdownMenuItem>
                            {p.statusPenelitian === StatusPenelitian.REVIEW && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleReview(p)}
                                  className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Setujui
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReview(p)}
                                  className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {startIndex + 1} -{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
                {filteredData.length} penelitian
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}>
                  Sebelumnya
                </Button>
                <span className="text-sm">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <PenelitianReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedPenelitian(null);
        }}
        onSubmit={handleReviewSubmit}
        penelitian={selectedPenelitian}
      />
    </div>
  );
}
