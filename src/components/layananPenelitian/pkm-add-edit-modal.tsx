"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, ExternalLink } from "lucide-react";
import type { PKM, HKI, Buku, PkmArtikel as Artikel } from "@/types/pkm-types";
import { ArtikelAddEditModal } from "./artikel-add-edit-modal";
import { HkiAddEditModal } from "./hki-add-edit-modal";
import { BukuAddEditModal } from "./buku-add-edit-modal";

interface PKMAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkm: Partial<PKM>) => Promise<void> | void; // biar bisa handle async
  pkm?: PKM;
}

export function PKMAddEditModal({
  isOpen,
  onClose,
  onSave,
  pkm,
}: PKMAddEditModalProps) {
  const [judul, setJudul] = useState("");
  const [proposal, setProposal] = useState("");
  const [laporan, setLaporan] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("");
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [hki, setHki] = useState<HKI[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [showArtikelModal, setShowArtikelModal] = useState(false);
  const [showHkiModal, setShowHkiModal] = useState(false);
  const [showBukuModal, setShowBukuModal] = useState(false);

  useEffect(() => {
    if (pkm) {
      setJudul(pkm.judul || "");
      setProposal(pkm.proposal || "");
      setLaporan(pkm.laporan || "");
      setTanggalPelaksanaan(
        pkm.tanggalPelaksanaan
          ? new Date(pkm.tanggalPelaksanaan).toISOString().split("T")[0]
          : ""
      );
      setArtikel(pkm.artikel || []);
      setHki(pkm.hki || []);
      setBuku(pkm.buku || []);
    } else {
      // Reset form when adding new PKM
      setJudul("");
      setProposal("");
      setLaporan("");
      setTanggalPelaksanaan("");
      setArtikel([]);
      setHki([]);
      setBuku([]);
    }
  }, [pkm, isOpen]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        judul,
        proposal,
        laporan,
        tanggalPelaksanaan: tanggalPelaksanaan
          ? new Date(tanggalPelaksanaan)
          : undefined,
        artikel,
        hki,
        buku,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddArtikel = (newArtikel: Partial<Artikel>) => {
    const artikelWithId = {
      ...newArtikel,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Artikel;
    setArtikel((prev) => [...prev, artikelWithId]);
  };

  const handleAddHki = (newHki: Partial<HKI>) => {
    const hkiWithId = {
      ...newHki,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as HKI;
    setHki((prev) => [...prev, hkiWithId]);
  };

  const handleAddBuku = (newBuku: Partial<Buku>) => {
    const bukuWithId = {
      ...newBuku,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Buku;
    setBuku((prev) => [...prev, bukuWithId]);
  };

  const removeArtikel = (id: string) => {
    setArtikel((prev) => prev.filter((a) => a.id !== id));
  };

  const removeHki = (id: string) => {
    setHki((prev) => prev.filter((h) => h.id !== id));
  };

  const removeBuku = (id: string) => {
    setBuku((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {pkm ? "Edit Penelitian" : "Tambah Penelitian"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Penelitian *</Label>
              <Input
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan judul Penelitian"
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
                    <div className="w-2 h-2 rounded-full" />
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
                    <div className="w-2 h-2 rounded-full" />
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

            <div className="space-y-2">
              <Label htmlFor="tanggalPelaksanaan">
                Tanggal Pelaksanaan Kegiatan
              </Label>
              <Input
                id="tanggalPelaksanaan"
                type="date"
                value={tanggalPelaksanaan}
                onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Artikel ({artikel.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArtikelModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Artikel
                </Button>
              </div>
              {artikel.length > 0 && (
                <div className="space-y-2">
                  {artikel.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{a.judul}</p>
                        <p className="text-sm text-muted-foreground">
                          {a.namaArtikel} - {a.kategori}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArtikel(a.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>HKI ({hki.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHkiModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah HKI
                </Button>
              </div>
              {hki.length > 0 && (
                <div className="space-y-2">
                  {hki.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{h.judulCiptaan}</p>
                        <p className="text-sm text-muted-foreground">
                          {h.nomorPenciptaan} - {h.jenisCiptaan}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHki(h.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Buku ({buku.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBukuModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Buku
                </Button>
              </div>
              {buku.length > 0 && (
                <div className="space-y-2">
                  {buku.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{b.judulBuku}</p>
                        <p className="text-sm text-muted-foreground">
                          {b.penerbit} - {b.tahun} - {b.jenisBuku}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBuku(b.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t bg-background">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}>
              {isSaving ? "Menyimpan..." : pkm ? "Update" : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ArtikelAddEditModal
        isOpen={showArtikelModal}
        onClose={() => setShowArtikelModal(false)}
        onSave={handleAddArtikel}
      />
      <HkiAddEditModal
        isOpen={showHkiModal}
        onClose={() => setShowHkiModal(false)}
        onSave={handleAddHki}
      />
      <BukuAddEditModal
        isOpen={showBukuModal}
        onClose={() => setShowBukuModal(false)}
        onSave={handleAddBuku}
      />
    </>
  );
}
