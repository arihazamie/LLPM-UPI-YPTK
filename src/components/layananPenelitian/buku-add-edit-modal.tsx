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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { type Buku, JenisBuku } from "@/types/pkm-types";

interface BukuAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buku: Partial<Buku>) => void;
  buku?: Buku;
}

export function BukuAddEditModal({
  isOpen,
  onClose,
  onSave,
  buku,
}: BukuAddEditModalProps) {
  const [authors, setAuthors] = useState<string[]>(buku?.author || [""]);
  const [judulBuku, setJudulBuku] = useState(buku?.judulBuku || "");
  const [penerbit, setPenerbit] = useState(buku?.penerbit || "");
  const [isbn, setIsbn] = useState(buku?.isbn || "");
  const [tahun, setTahun] = useState(buku?.tahun?.toString() || "");
  const [jenisBuku, setJenisBuku] = useState<JenisBuku>(
    buku?.jenisBuku || JenisBuku.BUKU_AJAR
  );
  const [linkBuku, setLinkBuku] = useState(buku?.linkBuku || "");

  const handleSave = () => {
    onSave({
      author: authors.filter((author) => author.trim() !== ""),
      judulBuku,
      penerbit,
      isbn,
      tahun: Number.parseInt(tahun),
      jenisBuku,
      linkBuku,
    });
    onClose();
    // Reset form
    setAuthors([""]);
    setJudulBuku("");
    setPenerbit("");
    setIsbn("");
    setTahun("");
    setJenisBuku(JenisBuku.BUKU_AJAR);
    setLinkBuku("");
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
          <DialogTitle>{buku ? "Edit Buku" : "Tambah Buku"}</DialogTitle>
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
            <Label htmlFor="judulBuku">Judul Buku *</Label>
            <Input
              id="judulBuku"
              value={judulBuku}
              onChange={(e) => setJudulBuku(e.target.value)}
              placeholder="Masukkan judul buku"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="penerbit">Penerbit *</Label>
            <Input
              id="penerbit"
              value={penerbit}
              onChange={(e) => setPenerbit(e.target.value)}
              placeholder="Masukkan nama penerbit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Masukkan ISBN"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tahun">Tahun *</Label>
            <Input
              id="tahun"
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              placeholder="Masukkan tahun terbit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Jenis Buku *</Label>
            <Select
              value={jenisBuku}
              onValueChange={(value) => setJenisBuku(value as JenisBuku)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis buku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={JenisBuku.BUKU_AJAR}>Buku Ajar</SelectItem>
                <SelectItem value={JenisBuku.REFERENSI}>Referensi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkBuku">Link Buku *</Label>
            <Input
              id="linkBuku"
              value={linkBuku}
              onChange={(e) => setLinkBuku(e.target.value)}
              placeholder="Masukkan link buku"
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
