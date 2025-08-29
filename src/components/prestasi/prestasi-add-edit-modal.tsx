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
import { Loader2, Trophy } from "lucide-react";
import type { Prestasi } from "@/types/pkm-types";

interface PrestasiAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prestasi: Partial<Prestasi>) => Promise<boolean>;
  prestasi?: Prestasi;
}

export function PrestasiAddEditModal({
  isOpen,
  onClose,
  onSave,
  prestasi,
}: PrestasiAddEditModalProps) {
  const [namaPrestasi, setNamaPrestasi] = useState("");
  const [jenisPretasi, setJenisPretasi] = useState("");
  const [peringkatJuara, setPeringkatJuara] = useState("");
  const [tingkat, setTingkat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [linkSertifikat, setLinkSertifikat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prestasi) {
      setNamaPrestasi(prestasi.namaPrestasi || "");
      setJenisPretasi(prestasi.jenisPretasi || "");
      setPeringkatJuara(prestasi.peringkatJuara || "");
      setTingkat(prestasi.tingkat || "");
      setTanggal(
        prestasi.tanggal ? prestasi.tanggal.toISOString().split("T")[0] : ""
      );
      setPenyelenggara(prestasi.penyelenggara || "");
      setLinkSertifikat(prestasi.linkSertifikat || "");
    } else {
      // Reset form for add mode
      setNamaPrestasi("");
      setJenisPretasi("");
      setPeringkatJuara("");
      setTingkat("");
      setTanggal("");
      setPenyelenggara("");
      setLinkSertifikat("");
    }
    setErrors({});
  }, [prestasi, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!namaPrestasi.trim()) {
      newErrors.namaPrestasi = "Nama prestasi wajib diisi";
    }
    if (!jenisPretasi.trim()) {
      newErrors.jenisPretasi = "Jenis prestasi wajib diisi";
    }
    if (!peringkatJuara.trim()) {
      newErrors.peringkatJuara = "Peringkat juara wajib diisi";
    }
    if (!tingkat.trim()) {
      newErrors.tingkat = "Tingkat wajib diisi";
    }
    if (!tanggal) {
      newErrors.tanggal = "Tanggal wajib diisi";
    }
    if (!penyelenggara.trim()) {
      newErrors.penyelenggara = "Penyelenggara wajib diisi";
    }
    if (linkSertifikat && !linkSertifikat.startsWith("http")) {
      newErrors.linkSertifikat = "Link sertifikat harus berupa URL yang valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await onSave({
        namaPrestasi: namaPrestasi.trim(),
        jenisPretasi: jenisPretasi.trim(),
        peringkatJuara: peringkatJuara.trim(),
        tingkat: tingkat.trim(),
        tanggal: new Date(tanggal),
        penyelenggara: penyelenggara.trim(),
        linkSertifikat: linkSertifikat.trim() || undefined,
      });

      if (success) {
        onClose();
        // Reset form only on success
        setNamaPrestasi("");
        setJenisPretasi("");
        setPeringkatJuara("");
        setTingkat("");
        setTanggal("");
        setPenyelenggara("");
        setLinkSertifikat("");
        setErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-800">
                {prestasi ? "Edit Prestasi" : "Tambah Prestasi Baru"}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                {prestasi
                  ? "Perbarui informasi prestasi"
                  : "Masukkan informasi prestasi baru"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label
              htmlFor="namaPrestasi"
              className="text-sm font-medium text-slate-700">
              Nama Prestasi *
            </Label>
            <Input
              id="namaPrestasi"
              value={namaPrestasi}
              onChange={(e) => setNamaPrestasi(e.target.value)}
              placeholder="Contoh: Juara 1 Lomba Karya Tulis Ilmiah"
              required
              disabled={isLoading}
              className={
                errors.namaPrestasi ? "border-red-500 focus:border-red-500" : ""
              }
            />
            {errors.namaPrestasi && (
              <p className="text-sm text-red-500">{errors.namaPrestasi}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="jenisPretasi"
                className="text-sm font-medium text-slate-700">
                Jenis Prestasi *
              </Label>
              <Input
                id="jenisPretasi"
                value={jenisPretasi}
                onChange={(e) => setJenisPretasi(e.target.value)}
                placeholder="Contoh: Akademik, Non-Akademik"
                required
                disabled={isLoading}
                className={
                  errors.jenisPretasi
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {errors.jenisPretasi && (
                <p className="text-sm text-red-500">{errors.jenisPretasi}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="peringkatJuara"
                className="text-sm font-medium text-slate-700">
                Peringkat Juara *
              </Label>
              <Input
                id="peringkatJuara"
                value={peringkatJuara}
                onChange={(e) => setPeringkatJuara(e.target.value)}
                placeholder="Contoh: Juara 1, Juara 2"
                required
                disabled={isLoading}
                className={
                  errors.peringkatJuara
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {errors.peringkatJuara && (
                <p className="text-sm text-red-500">{errors.peringkatJuara}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="tingkat"
                className="text-sm font-medium text-slate-700">
                Tingkat *
              </Label>
              <Input
                id="tingkat"
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value)}
                placeholder="Contoh: Nasional, Internasional"
                required
                disabled={isLoading}
                className={
                  errors.tingkat ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.tingkat && (
                <p className="text-sm text-red-500">{errors.tingkat}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tanggal"
                className="text-sm font-medium text-slate-700">
                Tanggal *
              </Label>
              <Input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                disabled={isLoading}
                className={
                  errors.tanggal ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.tanggal && (
                <p className="text-sm text-red-500">{errors.tanggal}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="penyelenggara"
              className="text-sm font-medium text-slate-700">
              Penyelenggara *
            </Label>
            <Input
              id="penyelenggara"
              value={penyelenggara}
              onChange={(e) => setPenyelenggara(e.target.value)}
              placeholder="Contoh: Kementerian Pendidikan, Universitas"
              required
              disabled={isLoading}
              className={
                errors.penyelenggara
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {errors.penyelenggara && (
              <p className="text-sm text-red-500">{errors.penyelenggara}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="linkSertifikat"
              className="text-sm font-medium text-slate-700">
              Link Sertifikat
            </Label>
            <Input
              id="linkSertifikat"
              value={linkSertifikat}
              onChange={(e) => setLinkSertifikat(e.target.value)}
              placeholder="https://example.com/sertifikat (opsional)"
              disabled={isLoading}
              className={
                errors.linkSertifikat
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {errors.linkSertifikat && (
              <p className="text-sm text-red-500">{errors.linkSertifikat}</p>
            )}
            <p className="text-xs text-slate-500">
              Link sertifikat bersifat opsional. Pastikan URL dimulai dengan
              http:// atau https://
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6">
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-6">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {prestasi ? "Perbarui" : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
