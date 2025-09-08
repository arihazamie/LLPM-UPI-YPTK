"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Penelitian {
  id: string;
  judulPenelitian: string;
  abstrak: string;
  statusPenelitian: string;
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  dosenPenelitian: Array<{
    dosen: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

interface ApiResponse {
  message: string;
  data: Penelitian[];
}

const statusConfig = {
  DIAJUKAN: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  REVIEW: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  ACC_PROPOSAL: {
    label: "Proposal Disetujui",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  DITOLAK: {
    label: "Ditolak",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  REVIEW_LAPORAN_KEMAJUAN_60: {
    label: "Review Laporan 60%",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  ACC_LAPORAN_KEMAJUAN_60: {
    label: "Laporan 60% Disetujui",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  REVIEW_LAPORAN_KEMAJUAN_100: {
    label: "Review Laporan 100%",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  ACC_LAPORAN_KEMAJUAN_100: {
    label: "Laporan 100% Disetujui",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  SELESAI: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-800",
    icon: CheckCircle,
  },
};

export default function PenelitianReviewTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Penelitian | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDecision, setReviewDecision] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [penelitianData, setPenelitianData] = useState<Penelitian[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPenelitianData();
  }, []);

  const fetchPenelitianData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/penelitian");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result: ApiResponse = await response.json();
      setPenelitianData(result.data);
    } catch (error) {
      console.error("Error fetching penelitian data:", error);
      // You could add toast notification here
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = penelitianData.filter((submission) => {
    const matchesSearch =
      submission.judulPenelitian
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.createdBy.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission.statusPenelitian === statusFilter;
    // Note: Category filtering removed as it's not in the API data structure
    // You can add category field to the database if needed

    return matchesSearch && matchesStatus;
  });

  const handleReviewSubmit = async () => {
    if (!selectedSubmission || !reviewDecision) return;

    try {
      setSubmitting(true);

      const response = await fetch(
        `/api/admin/penelitian/${selectedSubmission.id}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: reviewDecision,
            reviewNotes: reviewComment,
            approvalNotes: reviewComment, // Using same comment for approval notes
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const result = await response.json();
      console.log("Review submitted successfully:", result);

      // Refresh data after successful review
      await fetchPenelitianData();

      handleModalClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      // You could add toast notification here
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
    setReviewComment("");
    setReviewDecision("");
  };

  const handleOpenModal = (submission: Penelitian) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Memuat data penelitian...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Review Penelitian
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola dan review proposal penelitian yang masuk
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Menunggu Review</p>
                  <p className="text-2xl font-bold">
                    {
                      penelitianData.filter(
                        (s) => s.statusPenelitian === "DIAJUKAN"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sedang Direview</p>
                  <p className="text-2xl font-bold">
                    {
                      penelitianData.filter(
                        (s) => s.statusPenelitian === "REVIEW"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold">
                    {
                      penelitianData.filter(
                        (s) => s.statusPenelitian === "ACC_PROPOSAL"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold">
                    {
                      penelitianData.filter(
                        (s) => s.statusPenelitian === "DITOLAK"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan judul atau nama peneliti..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="DIAJUKAN">Menunggu Review</SelectItem>
                  <SelectItem value="REVIEW">Sedang Direview</SelectItem>
                  <SelectItem value="ACC_PROPOSAL">
                    Proposal Disetujui
                  </SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Penelitian</TableHead>
                <TableHead>Peneliti</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tanggal Submit</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const StatusIcon =
                  statusConfig[
                    submission.statusPenelitian as keyof typeof statusConfig
                  ]?.icon || AlertCircle;

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {submission.judulPenelitian}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {submission.abstrak}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{submission.createdBy.name}</TableCell>
                    <TableCell>{submission.createdBy.email}</TableCell>
                    <TableCell>
                      {new Date(submission.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell>
                      Rp{" "}
                      {submission.totalBudget?.toLocaleString("id-ID") || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusConfig[
                            submission.statusPenelitian as keyof typeof statusConfig
                          ]?.color || "bg-gray-100 text-gray-800"
                        }>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[
                          submission.statusPenelitian as keyof typeof statusConfig
                        ]?.label || submission.statusPenelitian}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(submission)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-50">
                          <DialogHeader>
                            <DialogTitle>
                              Review Proposal Penelitian
                            </DialogTitle>
                            <DialogDescription>
                              Review dan berikan keputusan untuk proposal
                              penelitian ini
                            </DialogDescription>
                          </DialogHeader>

                          {selectedSubmission && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Detail Proposal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Judul Penelitian
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {selectedSubmission.judulPenelitian}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Peneliti Utama
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {selectedSubmission.createdBy.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Email
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {selectedSubmission.createdBy.email}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Status Saat Ini
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {statusConfig[
                                        selectedSubmission.statusPenelitian as keyof typeof statusConfig
                                      ]?.label ||
                                        selectedSubmission.statusPenelitian}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Budget
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      Rp{" "}
                                      {selectedSubmission.totalBudget?.toLocaleString(
                                        "id-ID"
                                      ) || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Tanggal Submit
                                    </Label>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {new Date(
                                        selectedSubmission.createdAt
                                      ).toLocaleDateString("id-ID")}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">
                                    Abstrak
                                  </Label>
                                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                    {selectedSubmission.abstrak}
                                  </p>
                                </div>

                                {selectedSubmission.dosenPenelitian.length >
                                  0 && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Tim Peneliti
                                    </Label>
                                    <div className="mt-1 space-y-1">
                                      {selectedSubmission.dosenPenelitian.map(
                                        (member, index) => (
                                          <p
                                            key={index}
                                            className="text-sm text-gray-700">
                                            {member.dosen.name} (
                                            {member.dosen.email})
                                          </p>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="border-t pt-4 space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Form Review
                                </h3>
                                <div>
                                  <Label htmlFor="decision">
                                    Keputusan Review
                                  </Label>
                                  <Select
                                    value={reviewDecision}
                                    onValueChange={setReviewDecision}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih keputusan review" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ACC_PROPOSAL">
                                        Setujui Proposal
                                      </SelectItem>
                                      <SelectItem value="DITOLAK">
                                        Tolak
                                      </SelectItem>
                                      <SelectItem value="REVIEW">
                                        Perlu Review Lebih Lanjut
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="comment">
                                    Catatan Review
                                  </Label>
                                  <Textarea
                                    id="comment"
                                    placeholder="Berikan catatan dan saran untuk proposal ini..."
                                    value={reviewComment}
                                    onChange={(e) =>
                                      setReviewComment(e.target.value)
                                    }
                                    rows={6}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={handleModalClose}
                                    disabled={submitting}>
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={handleReviewSubmit}
                                    disabled={
                                      !reviewDecision ||
                                      !reviewComment ||
                                      submitting
                                    }>
                                    {submitting ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Mengirim...
                                      </>
                                    ) : (
                                      "Kirim Review"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredSubmissions.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada proposal ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah filter pencarian atau tunggu proposal baru masuk.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
