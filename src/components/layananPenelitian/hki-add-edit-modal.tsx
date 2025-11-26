"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { HKI } from "@/types/pkm-types";

interface HkiAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hki: Partial<HKI>) => void;
  hki?: HKI;
}

export function HkiAddEditModal({
  isOpen,
  onClose,
  onSave,
  hki,
}: HkiAddEditModalProps) {
  const [authors, setAuthors] = useState<string[]>(hki?.author || [""]);
  const [nomorPenciptaan, setNomorPenciptaan] = useState(
    hki?.nomorPenciptaan || ""
  );
  const [tanggalPermohonan, setTanggalPermohonan] = useState(
    hki?.tanggalPermohonan
      ? hki.tanggalPermohonan.toISOString().split("T")[0]
      : ""
  );
  const [jenisCiptaan, setJenisCiptaan] = useState(hki?.jenisCiptaan || "");
  const [judulCiptaan, setJudulCiptaan] = useState(hki?.judulCiptaan || "");
  const [linkSertifikat, setLinkSertifikat] = useState(
    hki?.linkSertifikat || ""
  );

  const handleSave = () => {
    onSave({
      author: authors.filter((author) => author.trim() !== ""),
      nomorPenciptaan,
      tanggalPermohonan: new Date(tanggalPermohonan),
      jenisCiptaan,
      judulCiptaan,
      linkSertifikat,
    });
    onClose();
    // Reset form
    setAuthors([""]);
    setNomorPenciptaan("");
    setTanggalPermohonan("");
    setJenisCiptaan("");
    setJudulCiptaan("");
    setLinkSertifikat("");
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{hki ? "Edit HKI" : "Tambah HKI"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Penulis *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAuthor}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Penulis
              </Button>
            </div>
            {authors.map((author, index) => (
              <div
                key={index}
                className="flex items-center space-x-2">
                <Input
                  value={author}
                  onChange={(e) => updateAuthor(index, e.target.value)}
                  placeholder={`Penulis ${index + 1}`}
                  className="flex-1"
                />
                {authors.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAuthor(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorPenciptaan">Nomor Penciptaan *</Label>
            <Input
              id="nomorPenciptaan"
              value={nomorPenciptaan}
              onChange={(e) => setNomorPenciptaan(e.target.value)}
              placeholder="Masukkan nomor penciptaan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalPermohonan">Tanggal Permohonan *</Label>
            <Input
              id="tanggalPermohonan"
              type="date"
              value={tanggalPermohonan}
              onChange={(e) => setTanggalPermohonan(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenisCiptaan">Jenis Ciptaan *</Label>
            <Input
              id="jenisCiptaan"
              value={jenisCiptaan}
              onChange={(e) => setJenisCiptaan(e.target.value)}
              placeholder="Masukkan jenis ciptaan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judulCiptaan">Judul Ciptaan *</Label>
            <Input
              id="judulCiptaan"
              value={judulCiptaan}
              onChange={(e) => setJudulCiptaan(e.target.value)}
              placeholder="Masukkan judul ciptaan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkSertifikat">Link Sertifikat *</Label>
            <Input
              id="linkSertifikat"
              value={linkSertifikat}
              onChange={(e) => setLinkSertifikat(e.target.value)}
              placeholder="Masukkan link sertifikat"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
