"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Calendar,
  User,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types based on Prisma schema
type StatusPengabdian =
  | "REVIEW"
  | "ACC_PROPOSAL"
  | "REVIEW_LAPORAN_KEMAJUAN_60"
  | "ACC_LAPORAN_KEMAJUAN_60"
  | "REVIEW_LAPORAN_KEMAJUAN_100"
  | "ACC_LAPORAN_KEMAJUAN_100"
  | "SELESAI"
  | "DITOLAK";

type KategoriPengabdian =
  | "PENGABDIAN_DOSEN_PEMULA"
  | "PENGABDIAN_TERAPAN"
  | "PENGABDIAN_PENGEMBANGAN"
  | "PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI"
  | "PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR"
  | "PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL"
  | "PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL";

interface DosenPengabdian {
  id: string;
  namaDosen: string;
  NIDN: string;
  roleDosenPengabdian: "KETUA" | "ANGGOTA";
  programStudiDosenPengabdian: string;
  dosen: {
    id: string;
    name: string;
    email: string;
  };
}

interface PengabdianSubmission {
  id: string;
  judulPengabdian: string;
  kategoriPengabdian: KategoriPengabdian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran: number | null;
  sumberAnggaran: string | null;
  luaran: string[];
  statusPengabdian: StatusPengabdian;
  linkProposal: string;
  linkLaporanKemajuan: string | null;
  linkLaporanAkhir: string | null;
  reviewNotes: string | null;
  approvalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  dosenPengabdian: DosenPengabdian[];
}

const statusColors: Record<StatusPengabdian, string> = {
  REVIEW: "bg-yellow-100 text-yellow-800",
  ACC_PROPOSAL: "bg-green-100 text-green-800",
  REVIEW_LAPORAN_KEMAJUAN_60: "bg-blue-100 text-blue-800",
  ACC_LAPORAN_KEMAJUAN_60: "bg-green-100 text-green-800",
  REVIEW_LAPORAN_KEMAJUAN_100: "bg-blue-100 text-blue-800",
  ACC_LAPORAN_KEMAJUAN_100: "bg-green-100 text-green-800",
  SELESAI: "bg-emerald-100 text-emerald-800",
  DITOLAK: "bg-red-100 text-red-800",
};

const statusLabels: Record<StatusPengabdian, string> = {
  REVIEW: "Review",
  ACC_PROPOSAL: "Proposal Diterima",
  REVIEW_LAPORAN_KEMAJUAN_60: "Review Laporan 60%",
  ACC_LAPORAN_KEMAJUAN_60: "Laporan 60% Diterima",
  REVIEW_LAPORAN_KEMAJUAN_100: "Review Laporan 100%",
  ACC_LAPORAN_KEMAJUAN_100: "Laporan 100% Diterima",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const kategoriLabels: Record<KategoriPengabdian, string> = {
  PENGABDIAN_DOSEN_PEMULA: "Pengabdian Dosen Pemula",
  PENGABDIAN_TERAPAN: "Pengabdian Terapan",
  PENGABDIAN_PENGEMBANGAN: "Pengabdian Pengembangan",
  PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI: "Pengabdian Unggulan PT",
  PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR: "Pengabdian Guru Besar",
  PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL: "Pengabdian Mitra Nasional",
  PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL: "Pengabdian Mitra Internasional",
};

export default function PengabdianReviewTab() {
  const [submissions, setSubmissions] = useState<PengabdianSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    PengabdianSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<PengabdianSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kategoriFilter, setKategoriFilter] = useState<string>("all");

  // Review form states
  const [reviewStatus, setReviewStatus] =
    useState<StatusPengabdian>("ACC_PROPOSAL");
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  // Fetch pengabdian data
  useEffect(() => {
    fetchPengabdianData();
  }, []);

  const fetchPengabdianData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/pengabdian");

      if (!response.ok) {
        throw new Error("Failed to fetch pengabdian data");
      }

      const result = await response.json();
      setSubmissions(result.data || []);
      setFilteredSubmissions(result.data || []);
    } catch (error) {
      console.error("Error fetching pengabdian:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengabdian",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.judulPengabdian
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.createdBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.statusPengabdian === statusFilter
      );
    }

    if (kategoriFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.kategoriPengabdian === kategoriFilter
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, kategoriFilter]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
    setReviewStatus("ACC_PROPOSAL");
    setReviewNotes("");
    setApprovalNotes("");
  };

  const handleReviewSubmit = async () => {
    if (!selectedSubmission || !reviewNotes.trim()) {
      toast({
        title: "Error",
        description: "Catatan review wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/admin/pengabdian/${selectedSubmission.id}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: reviewStatus,
            reviewNotes: reviewNotes.trim(),
            approvalNotes: approvalNotes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? {
                ...sub,
                statusPengabdian: reviewStatus,
                reviewNotes,
                approvalNotes,
              }
            : sub
        )
      );

      toast({
        title: "Berhasil",
        description: "Review pengabdian berhasil disimpan",
      });

      handleModalClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Gagal menyimpan review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Tidak ada";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: StatusPengabdian) => {
    switch (status) {
      case "SELESAI":
        return <CheckCircle className="h-4 w-4" />;
      case "DITOLAK":
        return <XCircle className="h-4 w-4" />;
      case "REVIEW":
      case "REVIEW_LAPORAN_KEMAJUAN_60":
      case "REVIEW_LAPORAN_KEMAJUAN_100":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengabdian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Review Pengabdian
          </h1>
          <p className="text-gray-600">
            Kelola dan review submission pengabdian masyarakat
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pengabdian
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Menunggu Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    submissions.filter((s) => s.statusPengabdian === "REVIEW")
                      .length
                  }
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    submissions.filter(
                      (s) => s.statusPengabdian === "ACC_PROPOSAL"
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {
                    submissions.filter((s) => s.statusPengabdian === "SELESAI")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan judul atau nama pengusul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="ACC_PROPOSAL">Proposal Diterima</SelectItem>
                <SelectItem value="SELESAI">Selesai</SelectItem>
                <SelectItem value="DITOLAK">Ditolak</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={kategoriFilter}
              onValueChange={setKategoriFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="PENGABDIAN_DOSEN_PEMULA">
                  Dosen Pemula
                </SelectItem>
                <SelectItem value="PENGABDIAN_TERAPAN">Terapan</SelectItem>
                <SelectItem value="PENGABDIAN_PENGEMBANGAN">
                  Pengembangan
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Daftar Pengabdian ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Pengabdian</TableHead>
                  <TableHead>Pengusul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Anggaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Submit</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div
                        className="truncate"
                        title={submission.judulPengabdian}>
                        {submission.judulPengabdian}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{submission.createdBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {kategoriLabels[submission.kategoriPengabdian]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{submission.tahunKegiatan}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatCurrency(submission.anggaran)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusColors[submission.statusPengabdian]
                        } flex items-center gap-1`}>
                        {getStatusIcon(submission.statusPengabdian)}
                        {statusLabels[submission.statusPengabdian]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={
                          isModalOpen &&
                          selectedSubmission?.id === submission.id
                        }
                        onOpenChange={(open) => {
                          if (open) {
                            setSelectedSubmission(submission);
                            setIsModalOpen(true);
                          } else {
                            handleModalClose();
                          }
                        }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Review Pengabdian</DialogTitle>
                          </DialogHeader>

                          {selectedSubmission && (
                            <div className="space-y-6">
                              {/* Detail Pengabdian */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Detail Pengabdian
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Judul Pengabdian
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {selectedSubmission.judulPengabdian}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Kategori
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {
                                        kategoriLabels[
                                          selectedSubmission.kategoriPengabdian
                                        ]
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Lama Kegiatan
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {selectedSubmission.lamaKegiatan}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Tahun Kegiatan
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {selectedSubmission.tahunKegiatan}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Anggaran
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {formatCurrency(
                                        selectedSubmission.anggaran
                                      )}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Sumber Anggaran
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {selectedSubmission.sumberAnggaran ||
                                        "Tidak ada"}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-600">
                                    Luaran
                                  </Label>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {selectedSubmission.luaran.map(
                                      (luaran, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs">
                                          {luaran.replace(/_/g, " ")}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-600">
                                    Tim Pengabdian
                                  </Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedSubmission.dosenPengabdian.map(
                                      (dosen) => (
                                        <div
                                          key={dosen.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                          <div>
                                            <p className="font-medium text-sm">
                                              {dosen.namaDosen}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              NIDN: {dosen.NIDN}
                                            </p>
                                          </div>
                                          <Badge
                                            variant={
                                              dosen.roleDosenPengabdian ===
                                              "KETUA"
                                                ? "default"
                                                : "secondary"
                                            }>
                                            {dosen.roleDosenPengabdian}
                                          </Badge>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-600">
                                    Link Proposal
                                  </Label>
                                  <p className="mt-1">
                                    <a
                                      href={selectedSubmission.linkProposal}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline text-sm">
                                      Lihat Proposal
                                    </a>
                                  </p>
                                </div>

                                {selectedSubmission.reviewNotes && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Catatan Review Sebelumnya
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                      {selectedSubmission.reviewNotes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Form Review */}
                              <div className="space-y-4 border-t pt-4">
                                <h3 className="text-lg font-semibold">
                                  Form Review
                                </h3>

                                <div>
                                  <Label htmlFor="reviewStatus">
                                    Status Review
                                  </Label>
                                  <Select
                                    value={reviewStatus}
                                    onValueChange={(value) =>
                                      setReviewStatus(value as StatusPengabdian)
                                    }>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ACC_PROPOSAL">
                                        Terima Proposal
                                      </SelectItem>
                                      <SelectItem value="ACC_LAPORAN_KEMAJUAN_60">
                                        Terima Laporan 60%
                                      </SelectItem>
                                      <SelectItem value="ACC_LAPORAN_KEMAJUAN_100">
                                        Terima Laporan 100%
                                      </SelectItem>
                                      <SelectItem value="SELESAI">
                                        Selesaikan Pengabdian
                                      </SelectItem>
                                      <SelectItem value="DITOLAK">
                                        Tolak
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="reviewNotes">
                                    Catatan Review *
                                  </Label>
                                  <Textarea
                                    id="reviewNotes"
                                    placeholder="Berikan catatan review yang detail..."
                                    value={reviewNotes}
                                    onChange={(e) =>
                                      setReviewNotes(e.target.value)
                                    }
                                    rows={4}
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="approvalNotes">
                                    Catatan Persetujuan (Opsional)
                                  </Label>
                                  <Textarea
                                    id="approvalNotes"
                                    placeholder="Catatan tambahan untuk persetujuan..."
                                    value={approvalNotes}
                                    onChange={(e) =>
                                      setApprovalNotes(e.target.value)
                                    }
                                    rows={3}
                                    className="mt-1"
                                  />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={handleModalClose}>
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={handleReviewSubmit}
                                    disabled={
                                      isSubmitting || !reviewNotes.trim()
                                    }>
                                    {isSubmitting
                                      ? "Menyimpan..."
                                      : "Simpan Review"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Tidak ada data pengabdian yang ditemukan
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
