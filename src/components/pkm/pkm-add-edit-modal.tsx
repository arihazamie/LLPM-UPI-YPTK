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
import type { PKM, Jurnal, HKI, Buku } from "@/types/pkm-types";
import { JurnalAddEditModal } from "./jurnal-add-edit-modal";
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
  const [jurnal, setJurnal] = useState<Jurnal | undefined>(undefined);
  const [hki, setHki] = useState<HKI | undefined>(undefined);
  const [buku, setBuku] = useState<Buku | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const [showJurnalModal, setShowJurnalModal] = useState(false);
  const [showHkiModal, setShowHkiModal] = useState(false);
  const [showBukuModal, setShowBukuModal] = useState(false);

  useEffect(() => {
    if (pkm) {
      setJudul(pkm.judul || "");
      setProposal(pkm.proposal || "");
      setLaporan(pkm.laporan || "");
      setJurnal(pkm.jurnal || undefined);
      setHki(pkm.hki || undefined);
      setBuku(pkm.buku || undefined);
    } else {
      // Reset form when adding new PKM
      setJudul("");
      setProposal("");
      setLaporan("");
      setJurnal(undefined);
      setHki(undefined);
      setBuku(undefined);
    }
  }, [pkm, isOpen]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        judul,
        proposal,
        laporan,
        jurnal,
        hki,
        buku,
      });
      onClose(); // hanya close setelah onSave selesai
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddJurnal = (newJurnal: Partial<Jurnal>) => {
    const jurnalWithId = {
      ...newJurnal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Jurnal;
    setJurnal(jurnalWithId);
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

  const removeJurnal = () => {
    setJurnal(undefined);
  };

  const removeHki = () => {
    setHki(undefined);
  };

  const removeBuku = () => {
    setBuku(undefined);
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
                <Label>Jurnal {jurnal ? "(1)" : "(0)"}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJurnalModal(true)}
                  disabled={!!jurnal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Jurnal
                </Button>
              </div>
              {jurnal && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{jurnal.judul}</p>
                    <p className="text-sm text-muted-foreground">
                      {jurnal.namaJurnal} - {jurnal.kategori}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeJurnal}>
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
                  <Plus className="w-4 h-4 mr-2" />
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
                  <Plus className="w-4 h-4 mr-2" />
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

      <JurnalAddEditModal
        isOpen={showJurnalModal}
        onClose={() => setShowJurnalModal(false)}
        onSave={handleAddJurnal}
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
