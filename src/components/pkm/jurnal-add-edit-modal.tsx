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
import { X, Plus, ExternalLink } from "lucide-react";
import { type Jurnal, KategoriJurnal } from "@/types/pkm-types";
import { toast } from "sonner";

interface JurnalAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jurnal: Partial<Jurnal>) => void;
  jurnal?: Jurnal;
}

export function JurnalAddEditModal({
  isOpen,
  onClose,
  onSave,
  jurnal,
}: JurnalAddEditModalProps) {
  const [judul, setJudul] = useState(jurnal?.judul || "");
  const [authors, setAuthors] = useState<string[]>(jurnal?.author || [""]);
  const [namaJurnal, setNamaJurnal] = useState(jurnal?.namaJurnal || "");
  const [publisher, setPublisher] = useState(jurnal?.publisher || "");
  const [peringkatJurnal, setPeringkatJurnal] = useState<KategoriJurnal>(
    jurnal?.kategori || KategoriJurnal.OJS
  );
  const [level, setLevel] = useState(jurnal?.level || "");
  const [linkJurnal, setLinkJurnal] = useState(jurnal?.linkJurnal || "");
  const [tanggalPublisher, setTanggalPublisher] = useState(
    jurnal?.tanggalPublisher
      ? new Date(jurnal.tanggalPublisher).toISOString().split("T")[0]
      : ""
  );

  const handleSave = () => {
    // Validation for required fields
    if (!judul.trim()) {
      toast.error("Judul jurnal harus diisi");
      return;
    }

    if (!namaJurnal.trim()) {
      toast.error("Nama jurnal harus diisi");
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

    if (!linkJurnal.trim()) {
      toast.error("Link jurnal harus diisi");
      return;
    }

    // Validation for SCOPUS and SINTA level
    if (
      (peringkatJurnal === KategoriJurnal.SCOPUS ||
        peringkatJurnal === KategoriJurnal.SINTA) &&
      !level.trim()
    ) {
      toast.error("Level harus dipilih");
      return;
    }

    onSave({
      judul: judul.trim(),
      author: filteredAuthors,
      namaJurnal: namaJurnal.trim(),
      publisher: publisher.trim(),
      kategori: peringkatJurnal,
      level: level.trim() || undefined,
      linkJurnal: linkJurnal.trim(),
      tanggalPublisher: tanggalPublisher
        ? new Date(tanggalPublisher)
        : undefined,
    });
    onClose();
    setJudul("");
    setAuthors([""]);
    setNamaJurnal("");
    setPublisher("");
    setPeringkatJurnal(KategoriJurnal.OJS);
    setLevel("");
    setLinkJurnal("");
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
    if (peringkatJurnal === KategoriJurnal.SCOPUS) {
      return [
        { value: "Q1", label: "Q1" },
        { value: "Q2", label: "Q2" },
        { value: "Q3", label: "Q3" },
        { value: "Q4", label: "Q4" },
      ];
    } else if (peringkatJurnal === KategoriJurnal.SINTA) {
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

  const handlePeringkatChange = (value: KategoriJurnal) => {
    setPeringkatJurnal(value);
    setLevel(""); // Reset level when category changes
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jurnal ? "Edit Jurnal" : "Tambah Jurnal"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="judul">Judul Jurnal *</Label>
            <Input
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul jurnal"
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
            <Label htmlFor="namaJurnal">Nama Jurnal *</Label>
            <Input
              id="namaJurnal"
              value={namaJurnal}
              onChange={(e) => setNamaJurnal(e.target.value)}
              placeholder="Masukkan nama jurnal"
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
            <Label>Peringkat Jurnal *</Label>
            <Select
              value={peringkatJurnal}
              onValueChange={handlePeringkatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peringkat jurnal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KategoriJurnal.OJS}>OJS</SelectItem>
                <SelectItem value={KategoriJurnal.SINTA}>SINTA</SelectItem>
                <SelectItem value={KategoriJurnal.INTERNASIONAL}>
                  INTERNASIONAL
                </SelectItem>
                <SelectItem value={KategoriJurnal.WOS}>WOS</SelectItem>
                <SelectItem value={KategoriJurnal.SCOPUS}>SCOPUS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(peringkatJurnal === KategoriJurnal.SCOPUS ||
            peringkatJurnal === KategoriJurnal.SINTA) && (
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
            <Label htmlFor="linkJurnal">Link Jurnal *</Label>
            <Input
              id="linkJurnal"
              value={linkJurnal}
              onChange={(e) => setLinkJurnal(e.target.value)}
              placeholder="Masukkan link jurnal (https://...)"
              required
            />
            {linkJurnal && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" />
                <span className="text-xs text-slate-600">
                  {linkJurnal.startsWith("http")
                    ? "Link valid"
                    : "Link tidak valid - harus dimulai dengan http:// atau https://"}
                </span>
                {linkJurnal.startsWith("http") && (
                  <a
                    href={linkJurnal}
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
            <Label htmlFor="tanggalPublisher">Tanggal Publisher Jurnal</Label>
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
