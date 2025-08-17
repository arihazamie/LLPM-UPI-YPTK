"use client";

import type React from "react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  ArrowUpDown,
  User,
  CalendarDays,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
} from "@/lib/api-utils";
import Image from "next/image";

export function AgendaTab() {
  const [agenda, setAgenda] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgenda, setSelectedAgenda] = useState<Post | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Post>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAgenda = async () => {
      try {
        setLoading(true);
        const response = await fetchPosts({ type: "AGENDA" });
        setAgenda(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load agenda");
      } finally {
        setLoading(false);
      }
    };

    loadAgenda();
  }, []);

  const filteredAgenda = agenda.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author.name || item.author.email)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedAgenda = [...filteredAgenda].sort((a, b) => {
    let aValue: unknown = a[sortBy];
    let bValue: unknown = b[sortBy];

    // handle nested author khusus
    if (sortBy === "author") {
      aValue = a.author.name || a.author.email;
      bValue = b.author.name || b.author.email;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const handleSort = (column: keyof Post) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleCreateAgenda = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("type", "AGENDA");

      const response = await createPost(formData);
      setAgenda([response.data, ...agenda]);
      setIsCreateOpen(false);
      toast.success("Agenda berhasil ditambahkan!");
      e.currentTarget.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menambahkan agenda"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAgenda = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAgenda) return;

    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("type", "AGENDA");

      const thumbnailInput = formData.get("thumbnail") as File;
      if (!thumbnailInput || thumbnailInput.size === 0) {
        formData.delete("thumbnail");
        if (selectedAgenda.thumbnail) {
          formData.set("existingThumbnail", selectedAgenda.thumbnail);
        }
      }

      const response = await updatePost(selectedAgenda.id, formData);
      setAgenda(
        agenda.map((item) =>
          item.id === selectedAgenda.id ? response.data : item
        )
      );
      setIsEditOpen(false);
      setSelectedAgenda(null);
      toast.success("Agenda berhasil diperbarui!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui agenda"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: Post) => {
    setSelectedAgenda(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAgenda) return;

    setSubmitting(true);

    try {
      await deletePost(selectedAgenda.id);
      setAgenda(agenda.filter((item) => item.id !== selectedAgenda.id));
      setIsDeleteOpen(false);
      setSelectedAgenda(null);
      toast.success("Agenda berhasil dihapus!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus agenda"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat agenda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
            Manajemen Agenda
          </h1>
          <p className="text-muted-foreground">
            Kelola jadwal acara dan kegiatan
          </p>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl">
              <Plus size={16} />
              Tambah Agenda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Agenda Baru</DialogTitle>
              <DialogDescription>Buat agenda acara baru</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleCreateAgenda}
              className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Acara</Label>
                  <Input
                    name="title"
                    id="title"
                    placeholder="Masukkan judul acara"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    name="location"
                    id="location"
                    placeholder="Masukkan lokasi acara"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    name="startDate"
                    id="startDate"
                    type="date"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    name="endDate"
                    id="endDate"
                    type="date"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                    name="thumbnail"
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Deskripsi Acara</Label>
                <Textarea
                  name="content"
                  id="content"
                  placeholder="Tulis deskripsi acara di sini..."
                  className="min-h-32 rounded-xl"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl">
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Simpan Agenda
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl">
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          placeholder="Cari agenda berdasarkan judul, konten, atau lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <Card className="h-full border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-600 to-yellow-500 text-white border-b-0 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <CalendarDays
                  size={24}
                  className="text-white"
                />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Agenda
                </CardTitle>
                <CardDescription className="text-white/90 text-sm font-medium mt-1">
                  {sortedAgenda.length} agenda tersedia
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full overflow-auto p-0">
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="border-b-2">
                    <TableHead className="w-[30%] py-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("title")}
                        className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start rounded-lg">
                        Judul Acara
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[20%] py-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("location")}
                        className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start rounded-lg">
                        Lokasi
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[15%] py-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("startDate")}
                        className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start rounded-lg">
                        Tanggal
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[15%] py-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("author")}
                        className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start rounded-lg">
                        Penyelenggara
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[20%] text-center py-4">
                      <span className="font-semibold">Aksi</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAgenda.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={`hover:bg-gradient-to-r hover:from-red-50/50 hover:to-yellow-50/50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                      }`}>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-gray-900 leading-tight">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {item.content.substring(0, 100)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin
                            size={14}
                            className="text-red-500"
                          />
                          <span className="font-medium">
                            {item.location || "TBA"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar
                            size={14}
                            className="text-red-500"
                          />
                          <div className="flex flex-col">
                            <span>
                              {item.startDate
                                ? new Date(item.startDate).toLocaleDateString(
                                    "id-ID"
                                  )
                                : "TBA"}
                            </span>
                            {item.endDate &&
                              item.endDate !== item.startDate && (
                                <span className="text-xs text-gray-500">
                                  s/d{" "}
                                  {new Date(item.endDate).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center">
                            <User
                              size={14}
                              className="text-red-600"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.author.name || item.author.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgenda(item);
                              setIsPreviewOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-lg"
                            title="Lihat agenda">
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgenda(item);
                              setIsEditOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-yellow-100 hover:text-yellow-600 transition-colors rounded-lg"
                            title="Edit agenda">
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors rounded-lg"
                            title="Hapus agenda">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedAgenda.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground">
                        Data tidak ada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">
              {selectedAgenda?.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {selectedAgenda?.location || "TBA"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {selectedAgenda?.startDate
                  ? new Date(selectedAgenda.startDate).toLocaleDateString(
                      "id-ID"
                    )
                  : "TBA"}
                {selectedAgenda?.endDate &&
                  selectedAgenda.endDate !== selectedAgenda.startDate &&
                  ` - ${new Date(selectedAgenda.endDate).toLocaleDateString(
                    "id-ID"
                  )}`}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="prose max-w-none">
            {selectedAgenda?.thumbnail && (
              <Image
                src={selectedAgenda.thumbnail || "/placeholder.svg"}
                alt={selectedAgenda.title}
                className="w-full max-h-64 object-cover rounded-lg mb-4"
                width={500}
                height={500}
              />
            )}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedAgenda?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Agenda</DialogTitle>
            <DialogDescription>Ubah informasi agenda</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleUpdateAgenda}
            className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Judul Acara</Label>
                <Input
                  name="title"
                  id="edit-title"
                  defaultValue={selectedAgenda?.title}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Lokasi</Label>
                <Input
                  name="location"
                  id="edit-location"
                  defaultValue={selectedAgenda?.location || ""}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Tanggal Mulai</Label>
                <Input
                  name="startDate"
                  id="edit-startDate"
                  type="date"
                  defaultValue={
                    selectedAgenda?.startDate
                      ? selectedAgenda.startDate.split("T")[0]
                      : ""
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Tanggal Selesai</Label>
                <Input
                  name="endDate"
                  id="edit-endDate"
                  type="date"
                  defaultValue={
                    selectedAgenda?.endDate
                      ? selectedAgenda.endDate.split("T")[0]
                      : ""
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail</Label>
              <Input
                name="thumbnail"
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                className="rounded-xl"
              />
              {selectedAgenda?.thumbnail && (
                <div className="text-sm text-gray-600">
                  Thumbnail saat ini:{" "}
                  <a
                    href={selectedAgenda.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    Lihat
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Deskripsi Acara</Label>
              <Textarea
                name="content"
                id="edit-content"
                defaultValue={selectedAgenda?.content}
                className="min-h-32 rounded-xl"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Simpan Perubahan
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl">
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Agenda</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {selectedAgenda && (
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {selectedAgenda.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {selectedAgenda.location || "TBA"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {selectedAgenda.startDate
                    ? new Date(selectedAgenda.startDate).toLocaleDateString(
                        "id-ID"
                      )
                    : "TBA"}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl"
              disabled={submitting}>
              Batal
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 rounded-xl">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
