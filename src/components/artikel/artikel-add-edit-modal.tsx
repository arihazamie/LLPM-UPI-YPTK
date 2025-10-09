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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, ExternalLink } from "lucide-react";
import { type Artikel, KategoriArtikel } from "@/types/pkm-types";
import { toast } from "sonner";

interface ArtikelAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artikel: Partial<Artikel>) => void;
  artikel?: Artikel;
}

export function ArtikelAddEditModal({
  isOpen,
  onClose,
  onSave,
  artikel,
}: ArtikelAddEditModalProps) {
  const [judul, setJudul] = useState(artikel?.judul || "");
  const [authors, setAuthors] = useState<string[]>(artikel?.author || [""]);
  const [namaArtikel, setNamaArtikel] = useState(artikel?.namaArtikel || "");
  const [publisher, setPublisher] = useState(artikel?.publisher || "");
  const [peringkatArtikel, setPeringkatArtikel] = useState<KategoriArtikel>(
    artikel?.kategori || KategoriArtikel.OJS
  );
  const [level, setLevel] = useState(artikel?.level || "");
  const [linkArtikel, setLinkArtikel] = useState(artikel?.linkArtikel || "");
  const [tanggalPublisher, setTanggalPublisher] = useState(
    artikel?.tanggalPublisher
      ? new Date(artikel.tanggalPublisher).toISOString().split("T")[0]
      : ""
  );

  useEffect(() => {
    if (!isOpen) return;
    if (artikel) {
      setJudul(artikel.judul || "");
      setAuthors(
        artikel.author && artikel.author.length ? artikel.author : [""]
      );
      setNamaArtikel(artikel.namaArtikel || "");
      setPublisher(artikel.publisher || "");
      setPeringkatArtikel(artikel.kategori || KategoriArtikel.OJS);
      setLevel(artikel.level || "");
      setLinkArtikel(artikel.linkArtikel || "");
      setTanggalPublisher(
        artikel.tanggalPublisher
          ? new Date(artikel.tanggalPublisher).toISOString().split("T")[0]
          : ""
      );
    } else {
      // Reset for "Tambah" mode
      setJudul("");
      setAuthors([""]);
      setNamaArtikel("");
      setPublisher("");
      setPeringkatArtikel(KategoriArtikel.OJS);
      setLevel("");
      setLinkArtikel("");
      setTanggalPublisher("");
    }
  }, [artikel, isOpen]);

  const handleSave = () => {
    // Validation for required fields
    if (!judul.trim()) {
      toast.error("Judul artikel harus diisi");
      return;
    }

    if (!namaArtikel.trim()) {
      toast.error("Nama artikel harus diisi");
      return;
    }

    if (!publisher.trim()) {
      toast.error("Publisher harus diisi");
      return;
    }

    const filteredAuthors = authors.filter((author) => author.trim() !== "");
    if (filteredAuthors.length === 0) {
      toast.error("Minimal harus ada satu penulis");
      return;
    }

    if (!linkArtikel.trim()) {
      toast.error("Link artikel harus diisi");
      return;
    }

    // Validation for SCOPUS and SINTA level
    if (
      (peringkatArtikel === KategoriArtikel.SCOPUS ||
        peringkatArtikel === KategoriArtikel.SINTA) &&
      !level.trim()
    ) {
      toast.error("Level harus dipilih");
      return;
    }

    onSave({
      judul: judul.trim(),
      author: filteredAuthors,
      namaArtikel: namaArtikel.trim(),
      publisher: publisher.trim(),
      kategori: peringkatArtikel,
      level: level.trim() || undefined,
      linkArtikel: linkArtikel.trim(),
      tanggalPublisher: tanggalPublisher
        ? new Date(tanggalPublisher)
        : undefined,
    });
    onClose();
    setJudul("");
    setAuthors([""]);
    setNamaArtikel("");
    setPublisher("");
    setPeringkatArtikel(KategoriArtikel.OJS);
    setLevel("");
    setLinkArtikel("");
    setTanggalPublisher("");
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

  const getLevelOptions = () => {
    if (peringkatArtikel === KategoriArtikel.SCOPUS) {
      return [
        { value: "Q1", label: "Q1" },
        { value: "Q2", label: "Q2" },
        { value: "Q3", label: "Q3" },
        { value: "Q4", label: "Q4" },
      ];
    } else if (peringkatArtikel === KategoriArtikel.SINTA) {
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

  const handlePeringkatChange = (value: KategoriArtikel) => {
    setPeringkatArtikel(value);
    setLevel(""); // Reset level when category changes
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {artikel ? "Edit Artikel" : "Tambah Artikel"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="judul">Judul Artikel *</Label>
            <Input
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul artikel"
              required
            />
          </div>

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
                  placeholder="Penulis"
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
            <Label htmlFor="namaArtikel">Nama Artikel *</Label>
            <Input
              id="namaArtikel"
              value={namaArtikel}
              onChange={(e) => setNamaArtikel(e.target.value)}
              placeholder="Masukkan nama artikel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher *</Label>
            <Input
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Masukkan nama publisher"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Peringkat Artikel *</Label>
            <Select
              value={peringkatArtikel}
              onValueChange={handlePeringkatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peringkat artikel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KategoriArtikel.OJS}>OJS</SelectItem>
                <SelectItem value={KategoriArtikel.SINTA}>SINTA</SelectItem>
                <SelectItem value={KategoriArtikel.INTERNASIONAL}>
                  INTERNASIONAL
                </SelectItem>
                <SelectItem value={KategoriArtikel.WOS}>WOS</SelectItem>
                <SelectItem value={KategoriArtikel.SCOPUS}>SCOPUS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(peringkatArtikel === KategoriArtikel.SCOPUS ||
            peringkatArtikel === KategoriArtikel.SINTA) && (
            <div className="space-y-2">
              <Label>Level *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="linkArtikel">Link Artikel *</Label>
            <Input
              id="linkArtikel"
              value={linkArtikel}
              onChange={(e) => setLinkArtikel(e.target.value)}
              placeholder="Masukkan link artikel (https://...)"
              required
            />
            {linkArtikel && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" />
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

          <div className="space-y-2">
            <Label htmlFor="tanggalPublisher">Tanggal Publisher Artikel</Label>
            <Input
              id="tanggalPublisher"
              type="date"
              value={tanggalPublisher}
              onChange={(e) => setTanggalPublisher(e.target.value)}
              placeholder="Pilih tanggal publisher"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t bg-background">
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
