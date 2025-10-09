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
  Trash2,
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
import { DeleteModal } from "@/components/dashboard/admin/modals/DeleteModal";
import { PostType } from "@/types/post-type";

// Types based on Prisma schema
type StatusPenelitian =
  | "REVIEW"
  | "ACC_PROPOSAL"
  | "REVIEW_LAPORAN_KEMAJUAN_60"
  | "ACC_LAPORAN_KEMAJUAN_60"
  | "REVIEW_LAPORAN_AKHIR"
  | "SELESAI"
  | "DITOLAK";

type KategoriPenelitian =
  | "PENELITIAN_DOSEN_PEMULA"
  | "PENELITIAN_TERAPAN"
  | "PENELITIAN_PENGEMBANGAN"
  | "PENELITIAN_UNGGULAN_PERGURUAN_TINGGI"
  | "PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR"
  | "PENELITIAN_BEKERJASAMA_MITRA_NASIONAL"
  | "PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL";

interface DosenPenelitian {
  id: string;
  namaDosen: string;
  NIDN: string;
  roleDosenPenelitian: "KETUA" | "ANGGOTA";
  programStudiDosenPenelitian: string;
  dosen: {
    id: string;
    name: string;
    email: string;
  };
}

interface PenelitianSubmission {
  id: string;
  judulPenelitian: string;
  kategoriPenelitian: KategoriPenelitian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran: number | null;
  sumberAnggaran: string | null;
  luaran: string[];
  statusPenelitian: StatusPenelitian;
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
  dosenPenelitian: DosenPenelitian[];
}

const statusColors: Record<StatusPenelitian, string> = {
  REVIEW: "bg-yellow-100 text-yellow-800",
  ACC_PROPOSAL: "bg-green-100 text-green-800",
  REVIEW_LAPORAN_KEMAJUAN_60: "bg-blue-100 text-blue-800",
  ACC_LAPORAN_KEMAJUAN_60: "bg-green-100 text-green-800",
  REVIEW_LAPORAN_AKHIR: "bg-blue-100 text-blue-800",
  SELESAI: "bg-emerald-100 text-emerald-800",
  DITOLAK: "bg-red-100 text-red-800",
};

const statusLabels: Record<StatusPenelitian, string> = {
  REVIEW: "Review",
  ACC_PROPOSAL: "Proposal Diterima",
  REVIEW_LAPORAN_KEMAJUAN_60: "Review Laporan 60%",
  ACC_LAPORAN_KEMAJUAN_60: "Laporan 60% Diterima",
  REVIEW_LAPORAN_AKHIR: "Review Laporan Akhir",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const kategoriLabels: Record<KategoriPenelitian, string> = {
  PENELITIAN_DOSEN_PEMULA: "Penelitian Dosen Pemula",
  PENELITIAN_TERAPAN: "Penelitian Terapan",
  PENELITIAN_PENGEMBANGAN: "Penelitian Pengembangan",
  PENELITIAN_UNGGULAN_PERGURUAN_TINGGI: "Penelitian Unggulan PT",
  PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR: "Penelitian Guru Besar",
  PENELITIAN_BEKERJASAMA_MITRA_NASIONAL: "Penelitian Mitra Nasional",
  PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL: "Penelitian Mitra Internasional",
};

export default function PenelitianReviewTab() {
  const [submissions, setSubmissions] = useState<PenelitianSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    PenelitianSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<PenelitianSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] =
    useState<PenelitianSubmission | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kategoriFilter, setKategoriFilter] = useState<string>("all");

  // Review form states
  const [reviewStatus, setReviewStatus] =
    useState<StatusPenelitian>("ACC_PROPOSAL");
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  // Fetch penelitian data
  useEffect(() => {
    fetchPenelitianData();
  }, []);

  const fetchPenelitianData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/penelitian");

      if (!response.ok) {
        throw new Error("Failed to fetch penelitian data");
      }

      const result = await response.json();
      setSubmissions(result.data || []);
      setFilteredSubmissions(result.data || []);
    } catch (error) {
      console.error("Error fetching penelitian:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data penelitian",
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
          submission.judulPenelitian
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.createdBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.statusPenelitian === statusFilter
      );
    }

    if (kategoriFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.kategoriPenelitian === kategoriFilter
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
        `/api/admin/penelitian/${selectedSubmission.id}/review`,
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
                statusPenelitian: reviewStatus,
                reviewNotes,
                approvalNotes,
              }
            : sub
        )
      );

      toast({
        title: "Berhasil",
        description: "Review penelitian berhasil disimpan",
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

  const getStatusIcon = (status: StatusPenelitian) => {
    switch (status) {
      case "SELESAI":
        return <CheckCircle className="h-4 w-4" />;
      case "DITOLAK":
        return <XCircle className="h-4 w-4" />;
      case "REVIEW":
      case "REVIEW_LAPORAN_KEMAJUAN_60":
      case "REVIEW_LAPORAN_AKHIR":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const requestDelete = (submission: PenelitianSubmission) => {
    setPendingDelete(submission);
    setConfirmOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const resp = await fetch(`/api/admin/penelitian?id=${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Gagal menghapus penelitian");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setFilteredSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Berhasil", description: "Penelitian dihapus" });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Gagal menghapus penelitian",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data penelitian...</p>
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
            Review Penelitian
          </h1>
          <p className="text-gray-600">
            Kelola dan review submission penelitian
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
                  Total Penelitian
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
                    submissions.filter((s) => s.statusPenelitian === "REVIEW")
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
                      (s) => s.statusPenelitian === "ACC_PROPOSAL"
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
                    submissions.filter((s) => s.statusPenelitian === "SELESAI")
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
                <SelectItem value="PENELITIAN_DOSEN_PEMULA">
                  Dosen Pemula
                </SelectItem>
                <SelectItem value="PENELITIAN_TERAPAN">Terapan</SelectItem>
                <SelectItem value="PENELITIAN_PENGEMBANGAN">
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
            Daftar Penelitian ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Penelitian</TableHead>
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
                        title={submission.judulPenelitian}>
                        {submission.judulPenelitian}
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
                        {kategoriLabels[submission.kategoriPenelitian]}
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
                          statusColors[submission.statusPenelitian]
                        } flex items-center gap-1`}>
                        {getStatusIcon(submission.statusPenelitian)}
                        {statusLabels[submission.statusPenelitian]}
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
                            <DialogTitle>Review Penelitian</DialogTitle>
                          </DialogHeader>

                          {selectedSubmission && (
                            <div className="space-y-6">
                              {/* Detail Penelitian */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Detail Penelitian
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Judul Penelitian
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {selectedSubmission.judulPenelitian}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                      Kategori
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                      {
                                        kategoriLabels[
                                          selectedSubmission.kategoriPenelitian
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
                                    Tim Penelitian
                                  </Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedSubmission.dosenPenelitian.map(
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
                                              dosen.roleDosenPenelitian ===
                                              "KETUA"
                                                ? "default"
                                                : "secondary"
                                            }>
                                            {dosen.roleDosenPenelitian}
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
                                      setReviewStatus(value as StatusPenelitian)
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
                                      <SelectItem value="SELESAI">
                                        Selesaikan Penelitian
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
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                        onClick={() => requestDelete(submission)}
                        disabled={deletingId === submission.id}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Tidak ada data penelitian yang ditemukan
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete.id)}
        title={pendingDelete?.judulPenelitian || ""}
        type={PostType.ARTIKEL}
        loading={!!(pendingDelete && deletingId === pendingDelete.id)}
        labelOverride="Penelitian"
      />
    </div>
  );
}
