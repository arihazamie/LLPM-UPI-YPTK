"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  X,
  ExternalLink,
  FileTextIcon,
  BookOpenIcon,
  AwardIcon,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useState, useEffect } from "react";
import type { PKM, Artikel, HKI, Buku } from "@/types/pkm-types";
import { KategoriArtikel, JenisBuku } from "@/types/pkm-types";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PKMGenericDataTable } from "@/components/pkm/pkm-generic-datatable";
import { AdminExcelExportButton } from "@/components/pkm/admin-excel-export-button";

export default function PKMTab() {
  const [pkms, setPkms] = useState<PKM[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPkm, setSelectedPkm] = useState<PKM | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [totalItems, setTotalItems] = useState(0);

  // Form states
  const [judul, setJudul] = useState("");
  const [proposal, setProposal] = useState("");
  const [laporan, setLaporan] = useState("");
  const [artikel, setArtikel] = useState<Artikel | undefined>(undefined);
  const [hki, setHki] = useState<HKI | undefined>(undefined);
  const [buku, setBuku] = useState<Buku | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Sub-modals
  const [showArtikelModal, setShowArtikelModal] = useState(false);
  const [showHkiModal, setShowHkiModal] = useState(false);
  const [showBukuModal, setShowBukuModal] = useState(false);

  const addEditModal = useModal();
  const deleteModal = useModal();
  const detailModal = useModal();

  useEffect(() => {
    fetchPKMs();
  }, []);

  const fetchPKMs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/pkm");
      const result = await response.json();

      if (response.ok) {
        setPkms(result.data.pkms || []);
        setTotalItems(result.data.pagination.total);
      } else {
        throw new Error(result.message || "Gagal memuat data PKM");
      }
    } catch (error) {
      console.error("Error fetching PKMs:", error);
      toast.error("Gagal memuat data PKM");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode("add");
    setSelectedPkm(null);
    // Reset form
    setJudul("");
    setProposal("");
    setLaporan("");
    setArtikel(undefined);
    setHki(undefined);
    setBuku(undefined);
    addEditModal.openModal();
  };

  const handleEdit = (pkm: PKM) => {
    setModalMode("edit");
    setSelectedPkm(pkm);
    // Populate form with existing data
    setJudul(pkm.judul || "");
    setProposal(pkm.proposal || "");
    setLaporan(pkm.laporan || "");
    setArtikel(pkm.artikel || undefined);
    setHki(pkm.hki || undefined);
    setBuku(pkm.buku || undefined);
    addEditModal.openModal();
  };

  const handleDelete = (pkm: PKM) => {
    setSelectedPkm(pkm);
    deleteModal.openModal();
  };

  const handleViewDetail = () => {
    // For now, we'll just show the detail modal with the selected PKM
    // This can be enhanced later to show specific related data
    if (selectedPkm) {
      detailModal.openModal();
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!judul.trim() || !proposal.trim() || !laporan.trim()) {
        toast.error("Judul, proposal dan laporan harus diisi");
        return;
      }

      const pkmData = {
        judul: judul.trim(),
        proposal: proposal.trim(),
        laporan: laporan.trim(),
        ...(artikel && {
          artikel: {
            judul: artikel.judul,
            author: artikel.author,
            namaArtikel: artikel.namaArtikel,
            publisher: artikel.publisher,
            kategori: artikel.kategori,
            level: artikel.level,
            linkArtikel: artikel.linkArtikel,
          },
        }),
        ...(hki && {
          hki: {
            author: hki.author,
            nomorPenciptaan: hki.nomorPenciptaan,
            tanggalPermohonan:
              hki.tanggalPermohonan instanceof Date
                ? hki.tanggalPermohonan.toISOString()
                : hki.tanggalPermohonan,
            jenisCiptaan: hki.jenisCiptaan,
            judulCiptaan: hki.judulCiptaan,
            linkSertifikat: hki.linkSertifikat,
          },
        }),
        ...(buku && {
          buku: {
            author: buku.author,
            judulBuku: buku.judulBuku,
            penerbit: buku.penerbit,
            isbn: buku.isbn,
            tahun: buku.tahun,
            jenisBuku: buku.jenisBuku,
            linkBuku: buku.linkBuku,
          },
        }),
      };

      // Debug logging
      console.log("PKM Data being sent:", pkmData);
      console.log("Artikel state:", artikel);
      console.log("Modal mode:", modalMode);

      const url =
        modalMode === "add"
          ? "/api/admin/pkm"
          : `/api/admin/pkm?id=${selectedPkm?.id}`;
      const method = modalMode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pkmData),
      });

      const result = await response.json();

      console.log("API Response:", result); // Debug log

      if (response.ok) {
        toast.success(
          modalMode === "add"
            ? "PKM berhasil dibuat"
            : "PKM berhasil diperbarui"
        );
        addEditModal.closeModal();

        // Add small delay before refreshing to ensure database is updated
        setTimeout(() => {
          fetchPKMs();
        }, 500);
      } else {
        // Log the detailed error for debugging
        console.error("API Error:", result);
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors
            .map(
              (err: { field: string; message: string }) =>
                `${err.field}: ${err.message}`
            )
            .join(", ");
          throw new Error(`Validasi gagal: ${errorMessages}`);
        }
        throw new Error(result.message || "Gagal menyimpan PKM");
      }
    } catch (error) {
      console.error("Error saving PKM:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan PKM"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPkm) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/pkm?id=${selectedPkm.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("PKM berhasil dihapus");
        deleteModal.closeModal();
        fetchPKMs();
      } else {
        throw new Error(result.message || "Gagal menghapus PKM");
      }
    } catch (error) {
      console.error("Error deleting PKM:", error);
      toast.error("Gagal menghapus PKM");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for managing related data
  const handleAddArtikel = (newArtikel: Partial<Artikel>) => {
    const artikelWithId = {
      ...newArtikel,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Artikel;
    setArtikel(artikelWithId);
  };

  const handleAddHki = (newHki: Partial<HKI>) => {
    const hkiWithId = {
      ...newHki,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as HKI;
    setHki(hkiWithId);
  };

  const handleAddBuku = (newBuku: Partial<Buku>) => {
    const bukuWithId = {
      ...newBuku,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Buku;
    setBuku(bukuWithId);
  };

  const removeHki = () => {
    setHki(undefined);
  };

  const removeBuku = () => {
    setBuku(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PKM Pengabdian</h1>
          <p className="text-gray-600 mt-2">
            Kelola Program Kreativitas Mahasiswa Pengabdian kepada Masyarakat
          </p>
        </div>
        <div className="flex gap-3">
          <AdminExcelExportButton disabled={pkms.length === 0} />
          <Button
            onClick={handleAdd}
            className="bg-red-500 hover:bg-red-600 text-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah PKM
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PKM</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Semua PKM pengabdian
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publikasi</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pkms.reduce((acc, pkm) => acc + (pkm.artikel ? 1 : 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total publikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HKI</CardTitle>
            <AwardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pkms.reduce((acc, pkm) => acc + (pkm.hki ? 1 : 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total HKI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buku</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pkms.reduce((acc, pkm) => acc + (pkm.buku ? 1 : 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total buku</p>
          </CardContent>
        </Card>
      </div>

      {/* PKM DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar PKM Pengabdian</CardTitle>
          <CardDescription>
            Semua PKM pengabdian kepada masyarakat ({totalItems} PKM)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PKMGenericDataTable
            data={pkms}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
            isLoading={loading}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      {/* Add/Edit Modal */}
      {addEditModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {modalMode === "add" ? "Tambah PKM Baru" : "Edit PKM"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={addEditModal.closeModal}>
                ✕
              </Button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul PKM *</Label>
                <Input
                  id="judul"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul PKM"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposal">Link Proposal *</Label>
                <div className="space-y-2">
                  <Textarea
                    id="proposal"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Masukkan link Google Drive atau link eksternal lainnya untuk proposal"
                    required
                    disabled={isSaving}
                    className="min-h-[80px]"
                  />
                  {proposal && (
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          proposal.startsWith("http")
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-slate-600">
                        {proposal.startsWith("http")
                          ? "Link valid"
                          : "Link tidak valid - harus dimulai dengan http:// atau https://"}
                      </span>
                      {proposal.startsWith("http") && (
                        <a
                          href={proposal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1">
                          <span>Test Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="laporan">Link Laporan *</Label>
                <div className="space-y-2">
                  <Textarea
                    id="laporan"
                    value={laporan}
                    onChange={(e) => setLaporan(e.target.value)}
                    placeholder="Masukkan link Google Drive atau link eksternal lainnya untuk laporan"
                    required
                    disabled={isSaving}
                    className="min-h-[80px]"
                  />
                  {laporan && (
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          laporan.startsWith("http")
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-slate-600">
                        {laporan.startsWith("http")
                          ? "Link valid"
                          : "Link tidak valid - harus dimulai dengan http:// atau https://"}
                      </span>
                      {laporan.startsWith("http") && (
                        <a
                          href={laporan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1">
                          <span>Test Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Artikel {artikel ? "(1)" : "(0)"}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowArtikelModal(true)}
                    disabled={!!artikel}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tambah Artikel
                  </Button>
                </div>
                {artikel && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{artikel.judul}</p>
                      <p className="text-sm text-muted-foreground">
                        {artikel.namaArtikel} - {artikel.kategori}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setArtikel(undefined)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>HKI {hki ? "(1)" : "(0)"}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHkiModal(true)}
                    disabled={!!hki}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tambah HKI
                  </Button>
                </div>
                {hki && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{hki.judulCiptaan}</p>
                      <p className="text-sm text-muted-foreground">
                        {hki.nomorPenciptaan} - {hki.jenisCiptaan}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeHki}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Buku {buku ? "(1)" : "(0)"}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBukuModal(true)}
                    disabled={!!buku}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tambah Buku
                  </Button>
                </div>
                {buku && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{buku.judulBuku}</p>
                      <p className="text-sm text-muted-foreground">
                        {buku.penerbit} - {buku.tahun} - {buku.jenisBuku}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeBuku}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t bg-background">
              <Button
                variant="outline"
                onClick={addEditModal.closeModal}
                disabled={isSaving}>
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-500 hover:bg-red-600">
                {isSaving
                  ? "Menyimpan..."
                  : modalMode === "add"
                  ? "Simpan"
                  : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Publikasi Modal */}
      {showArtikelModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Publikasi</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArtikelModal(false)}>
                ✕
              </Button>
            </div>
            <ArtikelForm
              onSave={(data) => {
                handleAddArtikel(data);
                setShowArtikelModal(false);
              }}
              onCancel={() => setShowArtikelModal(false)}
            />
          </div>
        </div>
      )}

      {/* HKI Modal */}
      {showHkiModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah HKI</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHkiModal(false)}>
                ✕
              </Button>
            </div>
            <HkiForm
              onSave={(data) => {
                handleAddHki(data);
                setShowHkiModal(false);
              }}
              onCancel={() => setShowHkiModal(false)}
            />
          </div>
        </div>
      )}

      {/* Buku Modal */}
      {showBukuModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Buku</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBukuModal(false)}>
                ✕
              </Button>
            </div>
            <BukuForm
              onSave={(data) => {
                handleAddBuku(data);
                setShowBukuModal(false);
              }}
              onCancel={() => setShowBukuModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && selectedPkm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Hapus PKM</h2>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus PKM &quot;{selectedPkm.id}
              &quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={deleteModal.closeModal}>
                Batal
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600">
                {loading ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.isOpen && selectedPkm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Detail PKM: {selectedPkm.id}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={detailModal.closeModal}>
                ✕
              </Button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Informasi Dasar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Judul:</strong> {selectedPkm.judul}
                    </p>
                    <p>
                      <strong>Proposal:</strong> {selectedPkm.proposal}
                    </p>
                    <p>
                      <strong>Laporan:</strong> {selectedPkm.laporan}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Dibuat oleh:</strong> {selectedPkm.createdBy.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedPkm.createdBy.email}
                    </p>
                    <p>
                      <strong>Tanggal dibuat:</strong>{" "}
                      {new Date(selectedPkm.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPkm.artikel && (
                <div>
                  <h3 className="font-semibold mb-2">Publikasi</h3>
                  <div className="border rounded p-3 mb-2">
                    <p>
                      <strong>Judul:</strong> {selectedPkm.artikel.judul}
                    </p>
                    <p>
                      <strong>Jurnal:</strong> {selectedPkm.artikel.namaArtikel}
                    </p>
                    <p>
                      <strong>Publisher:</strong>{" "}
                      {selectedPkm.artikel.publisher}
                    </p>
                    <p>
                      <strong>Kategori:</strong> {selectedPkm.artikel.kategori}
                    </p>
                    {selectedPkm.artikel.level && (
                      <p>
                        <strong>Level:</strong> {selectedPkm.artikel.level}
                      </p>
                    )}
                    {selectedPkm.artikel.linkArtikel && (
                      <p>
                        <strong>Link Artikel:</strong>{" "}
                        <a
                          href={selectedPkm.artikel.linkArtikel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline">
                          Lihat Artikel
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedPkm.hki && (
                <div>
                  <h3 className="font-semibold mb-2">HKI</h3>
                  <div className="border rounded p-3 mb-2">
                    <p>
                      <strong>Judul:</strong> {selectedPkm.hki.judulCiptaan}
                    </p>
                    <p>
                      <strong>Nomor:</strong> {selectedPkm.hki.nomorPenciptaan}
                    </p>
                    <p>
                      <strong>Jenis:</strong> {selectedPkm.hki.jenisCiptaan}
                    </p>
                    <p>
                      <strong>Tanggal:</strong>{" "}
                      {new Date(
                        selectedPkm.hki.tanggalPermohonan
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              )}

              {selectedPkm.buku && (
                <div>
                  <h3 className="font-semibold mb-2">Buku</h3>
                  <div className="border rounded p-3 mb-2">
                    <p>
                      <strong>Judul:</strong> {selectedPkm.buku.judulBuku}
                    </p>
                    <p>
                      <strong>Penerbit:</strong> {selectedPkm.buku.penerbit}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {selectedPkm.buku.isbn}
                    </p>
                    <p>
                      <strong>Tahun:</strong> {selectedPkm.buku.tahun}
                    </p>
                    <p>
                      <strong>Jenis:</strong> {selectedPkm.buku.jenisBuku}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={detailModal.closeModal}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Publikasi Form Component
function ArtikelForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Partial<Artikel>) => void;
  onCancel: () => void;
}) {
  const [judul, setJudul] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [namaArtikel, setNamaArtikel] = useState("");
  const [publisher, setPublisher] = useState("");
  const [kategori, setKategori] = useState<KategoriArtikel>(
    KategoriArtikel.OJS
  );
  const [level, setLevel] = useState("");
  const [linkArtikel, setLinkArtikel] = useState("");

  const handleSave = () => {
    if (
      !judul.trim() ||
      !namaArtikel.trim() ||
      !publisher.trim() ||
      !linkArtikel.trim()
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    onSave({
      judul: judul.trim(),
      author: authors.filter((author) => author.trim() !== ""),
      namaArtikel: namaArtikel.trim(),
      publisher: publisher.trim(),
      kategori,
      level: level || undefined,
      linkArtikel: linkArtikel.trim(),
    });
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const getLevelOptions = () => {
    if (kategori === KategoriArtikel.SCOPUS) {
      return [
        { value: "Q1", label: "Q1" },
        { value: "Q2", label: "Q2" },
        { value: "Q3", label: "Q3" },
        { value: "Q4", label: "Q4" },
      ];
    } else if (kategori === KategoriArtikel.SINTA) {
      return [
        { value: "SINTA 1", label: "Sinta 1" },
        { value: "SINTA 2", label: "Sinta 2" },
        { value: "SINTA 3", label: "Sinta 3" },
        { value: "SINTA 4", label: "Sinta 4" },
        { value: "SINTA 5", label: "Sinta 5" },
        { value: "SINTA 6", label: "Sinta 6" },
      ];
    }
    return [];
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="judul">Judul Publikasi *</Label>
        <Input
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul publikasi"
        />
      </div>

      <div>
        <Label>Penulis *</Label>
        <div className="space-y-2">
          {authors.map((author, index) => (
            <div
              key={index}
              className="flex space-x-2">
              <Input
                value={author}
                onChange={(e) => updateAuthor(index, e.target.value)}
                placeholder={`Penulis ${index + 1}`}
              />
              {authors.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAuthor(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAuthor}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Penulis
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="namaArtikel">Nama Artikel *</Label>
        <Input
          id="namaArtikel"
          value={namaArtikel}
          onChange={(e) => setNamaArtikel(e.target.value)}
          placeholder="Masukkan nama artikel"
        />
      </div>

      <div>
        <Label htmlFor="publisher">Publisher *</Label>
        <Input
          id="publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          placeholder="Masukkan nama publisher"
        />
      </div>

      <div>
        <Label htmlFor="kategori">Kategori Artikel *</Label>
        <Select
          value={kategori}
          onValueChange={(value) => setKategori(value as KategoriArtikel)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(KategoriArtikel).map((kat) => (
              <SelectItem
                key={kat}
                value={kat}>
                {kat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {getLevelOptions().length > 0 && (
        <div>
          <Label htmlFor="level">Level</Label>
          <Select
            value={level}
            onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih level" />
            </SelectTrigger>
            <SelectContent>
              {getLevelOptions().map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="linkArtikel">Link Artikel *</Label>
        <Input
          id="linkArtikel"
          value={linkArtikel}
          onChange={(e) => setLinkArtikel(e.target.value)}
          placeholder="Masukkan link artikel (https://...)"
        />
        {linkArtikel && (
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                linkArtikel.startsWith("http") ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-slate-600">
              {linkArtikel.startsWith("http")
                ? "Link valid"
                : "Link tidak valid - harus dimulai dengan http:// atau https://"}
            </span>
            {linkArtikel.startsWith("http") && (
              <a
                href={linkArtikel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1">
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          className="bg-red-500 hover:bg-red-600">
          Simpan
        </Button>
      </div>
    </div>
  );
}

// HKI Form Component
function HkiForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Partial<HKI>) => void;
  onCancel: () => void;
}) {
  const [authors, setAuthors] = useState<string[]>([""]);
  const [nomorPenciptaan, setNomorPenciptaan] = useState("");
  const [tanggalPermohonan, setTanggalPermohonan] = useState("");
  const [jenisCiptaan, setJenisCiptaan] = useState("");
  const [judulCiptaan, setJudulCiptaan] = useState("");
  const [linkSertifikat, setLinkSertifikat] = useState("");

  const handleSave = () => {
    if (
      !nomorPenciptaan.trim() ||
      !jenisCiptaan.trim() ||
      !judulCiptaan.trim() ||
      !linkSertifikat.trim() ||
      !tanggalPermohonan
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    onSave({
      author: authors.filter((author) => author.trim() !== ""),
      nomorPenciptaan: nomorPenciptaan.trim(),
      tanggalPermohonan: new Date(tanggalPermohonan),
      jenisCiptaan: jenisCiptaan.trim(),
      judulCiptaan: judulCiptaan.trim(),
      linkSertifikat: linkSertifikat.trim(),
    });
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Penulis *</Label>
        <div className="space-y-2">
          {authors.map((author, index) => (
            <div
              key={index}
              className="flex space-x-2">
              <Input
                value={author}
                onChange={(e) => updateAuthor(index, e.target.value)}
                placeholder={`Penulis ${index + 1}`}
              />
              {authors.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAuthor(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAuthor}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Penulis
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="nomorPenciptaan">Nomor Penciptaan *</Label>
        <Input
          id="nomorPenciptaan"
          value={nomorPenciptaan}
          onChange={(e) => setNomorPenciptaan(e.target.value)}
          placeholder="Masukkan nomor penciptaan"
        />
      </div>

      <div>
        <Label htmlFor="tanggalPermohonan">Tanggal Permohonan *</Label>
        <Input
          id="tanggalPermohonan"
          type="date"
          value={tanggalPermohonan}
          onChange={(e) => setTanggalPermohonan(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="jenisCiptaan">Jenis Ciptaan *</Label>
        <Input
          id="jenisCiptaan"
          value={jenisCiptaan}
          onChange={(e) => setJenisCiptaan(e.target.value)}
          placeholder="Masukkan jenis ciptaan"
        />
      </div>

      <div>
        <Label htmlFor="judulCiptaan">Judul Ciptaan *</Label>
        <Input
          id="judulCiptaan"
          value={judulCiptaan}
          onChange={(e) => setJudulCiptaan(e.target.value)}
          placeholder="Masukkan judul ciptaan"
        />
      </div>

      <div>
        <Label htmlFor="linkSertifikat">Link Sertifikat *</Label>
        <Input
          id="linkSertifikat"
          value={linkSertifikat}
          onChange={(e) => setLinkSertifikat(e.target.value)}
          placeholder="Masukkan link sertifikat"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          className="bg-red-500 hover:bg-red-600">
          Simpan
        </Button>
      </div>
    </div>
  );
}

// Buku Form Component
function BukuForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Partial<Buku>) => void;
  onCancel: () => void;
}) {
  const [authors, setAuthors] = useState<string[]>([""]);
  const [judulBuku, setJudulBuku] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [isbn, setIsbn] = useState("");
  const [tahun, setTahun] = useState("");
  const [jenisBuku, setJenisBuku] = useState<JenisBuku>(JenisBuku.BUKU_AJAR);
  const [linkBuku, setLinkBuku] = useState("");

  const handleSave = () => {
    if (
      !judulBuku.trim() ||
      !penerbit.trim() ||
      !isbn.trim() ||
      !tahun.trim() ||
      !linkBuku.trim()
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    const tahunNumber = parseInt(tahun);
    if (
      isNaN(tahunNumber) ||
      tahunNumber < 1900 ||
      tahunNumber > new Date().getFullYear()
    ) {
      toast.error("Tahun tidak valid");
      return;
    }

    onSave({
      author: authors.filter((author) => author.trim() !== ""),
      judulBuku: judulBuku.trim(),
      penerbit: penerbit.trim(),
      isbn: isbn.trim(),
      tahun: tahunNumber,
      jenisBuku,
      linkBuku: linkBuku.trim(),
    });
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Penulis *</Label>
        <div className="space-y-2">
          {authors.map((author, index) => (
            <div
              key={index}
              className="flex space-x-2">
              <Input
                value={author}
                onChange={(e) => updateAuthor(index, e.target.value)}
                placeholder={`Penulis ${index + 1}`}
              />
              {authors.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAuthor(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAuthor}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Penulis
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="judulBuku">Judul Buku *</Label>
        <Input
          id="judulBuku"
          value={judulBuku}
          onChange={(e) => setJudulBuku(e.target.value)}
          placeholder="Masukkan judul buku"
        />
      </div>

      <div>
        <Label htmlFor="penerbit">Penerbit *</Label>
        <Input
          id="penerbit"
          value={penerbit}
          onChange={(e) => setPenerbit(e.target.value)}
          placeholder="Masukkan nama penerbit"
        />
      </div>

      <div>
        <Label htmlFor="isbn">ISBN *</Label>
        <Input
          id="isbn"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Masukkan nomor ISBN"
        />
      </div>

      <div>
        <Label htmlFor="tahun">Tahun *</Label>
        <Input
          id="tahun"
          type="number"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          placeholder="Masukkan tahun terbit"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      <div>
        <Label htmlFor="jenisBuku">Jenis Buku *</Label>
        <Select
          value={jenisBuku}
          onValueChange={(value) => setJenisBuku(value as JenisBuku)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(JenisBuku).map((jenis) => (
              <SelectItem
                key={jenis}
                value={jenis}>
                {jenis.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="linkBuku">Link Buku *</Label>
        <Input
          id="linkBuku"
          value={linkBuku}
          onChange={(e) => setLinkBuku(e.target.value)}
          placeholder="Masukkan link buku"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          className="bg-red-500 hover:bg-red-600">
          Simpan
        </Button>
      </div>
    </div>
  );
}
