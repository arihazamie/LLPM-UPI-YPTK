"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, ExternalLink } from "lucide-react";
import type { PKM, Publikasi, HKI, Buku } from "@/types/pkm-types";
import { PublikasiAddEditModal } from "./publikasi-add-edit-modal";
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
  const [proposal, setProposal] = useState("");
  const [laporan, setLaporan] = useState("");
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [hki, setHki] = useState<HKI[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [showPublikasiModal, setShowPublikasiModal] = useState(false);
  const [showHkiModal, setShowHkiModal] = useState(false);
  const [showBukuModal, setShowBukuModal] = useState(false);

  useEffect(() => {
    if (pkm) {
      setProposal(pkm.proposal || "");
      setLaporan(pkm.laporan || "");
      setPublikasi(pkm.publikasi || []);
      setHki(pkm.hki || []);
      setBuku(pkm.buku || []);
    } else {
      // Reset form when adding new PKM
      setProposal("");
      setLaporan("");
      setPublikasi([]);
      setHki([]);
      setBuku([]);
    }
  }, [pkm, isOpen]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        proposal,
        laporan,
        publikasi,
        hki,
        buku,
      });
      onClose(); // hanya close setelah onSave selesai
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPublikasi = (newPublikasi: Partial<Publikasi>) => {
    const publikasiWithId = {
      ...newPublikasi,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Publikasi;
    setPublikasi([...publikasi, publikasiWithId]);
  };

  const handleAddHki = (newHki: Partial<HKI>) => {
    const hkiWithId = {
      ...newHki,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as HKI;
    setHki([...hki, hkiWithId]);
  };

  const handleAddBuku = (newBuku: Partial<Buku>) => {
    const bukuWithId = {
      ...newBuku,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Buku;
    setBuku([...buku, bukuWithId]);
  };

  const removePublikasi = (id: string) => {
    setPublikasi(publikasi.filter((p) => p.id !== id));
  };

  const removeHki = (id: string) => {
    setHki(hki.filter((h) => h.id !== id));
  };

  const removeBuku = (id: string) => {
    setBuku(buku.filter((b) => b.id !== id));
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{pkm ? "Edit PKM" : "Tambah PKM"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
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
                <Label>Publikasi ({publikasi.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPublikasiModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Publikasi
                </Button>
              </div>
              {publikasi.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{pub.judul}</p>
                    <p className="text-sm text-muted-foreground">
                      {pub.namaJurnal} - {pub.kategori}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePublikasi(pub.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
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

      <PublikasiAddEditModal
        isOpen={showPublikasiModal}
        onClose={() => setShowPublikasiModal(false)}
        onSave={handleAddPublikasi}
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
