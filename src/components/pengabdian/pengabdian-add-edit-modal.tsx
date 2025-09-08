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
import { toast } from "sonner";
import type { Pengabdian } from "@/types/pkm-types";
import {
  KategoriPengabdian,
  LuaranPengabdian,
  RoleDosenPengabdian,
  ProgramStudiDosenPenelitian,
} from "@/types/pkm-types";
import { X, Plus } from "lucide-react";

interface PengabdianFormData {
  judulPengabdian: string;
  kategoriPengabdian: KategoriPengabdian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran?: number;
  sumberAnggaran?: string;
  luaran: LuaranPengabdian[];
  dosenPengabdian: Array<{
    namaDosen: string;
    NIDN: string;
    roleDosenPengabdian: RoleDosenPengabdian;
    programStudiDosenPengabdian: ProgramStudiDosenPenelitian;
  }>;
  linkProposal: string;
  linkLaporanKemajuan?: string;
  linkLaporanAkhir?: string;
}

interface PengabdianAddEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PengabdianFormData) => void;
  initialData?: Pengabdian;
}

// Helper functions to get display labels
const getKategoriLabel = (value: string) => {
  const labels: Record<string, string> = {
    [KategoriPengabdian.PENGABDIAN_ILMU]: "Pengabdian Ilmu",
    [KategoriPengabdian.PENGABDIAN_MASYARAKAT]: "Pengabdian Masyarakat",
    [KategoriPengabdian.PENGABDIAN_DOSEN_PEMULA]: "Pengabdian Dosen Pemula",
    [KategoriPengabdian.PENGABDIAN_TERAPAN]: "Pengabdian Terapan",
    [KategoriPengabdian.PENGABDIAN_PENGEMBANGAN]: "Pengabdian Pengembangan",
    [KategoriPengabdian.PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI]:
      "Pengabdian Unggulan Perguruan Tinggi",
    [KategoriPengabdian.PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR]:
      "Pengabdian Guru Besar (Percepatan Profesor)",
    [KategoriPengabdian.PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL]:
      "Pengabdian Bekerjasama Mitra Nasional",
    [KategoriPengabdian.PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL]:
      "Pengabdian Bekerjasama Mitra Internasional",
  };
  return labels[value] || value;
};

const getLuaranLabel = (value: string) => {
  const labels: Record<string, string> = {
    [LuaranPengabdian.SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS]:
      "Seminar Internasional (Scopus/Atlantis/WOS)",
    [LuaranPengabdian.ARTIKEL_JURNAL_NASIONAL_SINTA_5]:
      "Artikel Jurnal Nasional Sinta 5",
    [LuaranPengabdian.ARTIKEL_JURNAL_NASIONAL_SINTA_4]:
      "Artikel Jurnal Nasional Sinta 4",
    [LuaranPengabdian.ARTIKEL_JURNAL_NASIONAL_SINTA_3]:
      "Artikel Jurnal Nasional Sinta 3",
    [LuaranPengabdian.ARTIKEL_JURNAL_NASIONAL_SINTA_2]:
      "Artikel Jurnal Nasional Sinta 2",
    [LuaranPengabdian.PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS]:
      "Publikasi Jurnal International Bereputasi (Scopus/WOS)",
    [LuaranPengabdian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS]:
      "Publikasi Jurnal International (Scopus Q4/WOS)",
    [LuaranPengabdian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS]:
      "Publikasi Jurnal International (Scopus Q3/WOS)",
    [LuaranPengabdian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS]:
      "Publikasi Jurnal International (Scopus Q2/WOS)",
    [LuaranPengabdian.PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS]:
      "Publikasi Jurnal International (Scopus Q1/WOS)",
    [LuaranPengabdian.HKI_PATEN]: "HKI Paten",
    [LuaranPengabdian.BUKU_ISBN]: "Buku (ber ISBN)",
    [LuaranPengabdian.PROTOTYPE]: "Prototype",
  };
  return labels[value] || value;
};

const getProgramStudiLabel = (value: string) => {
  const labels: Record<string, string> = {
    [ProgramStudiDosenPenelitian.D3_MANAJEMEN_INFORMATIKA]:
      "D3 - Manajemen Informatika",
    [ProgramStudiDosenPenelitian.S1_SISTEM_INFORMASI]: "S1 - Sistem Informasi",
    [ProgramStudiDosenPenelitian.S1_SISTEM_KOMPUTER]: "S1 - Sistem Komputer",
    [ProgramStudiDosenPenelitian.S1_TEKNIK_INFORMATIKA]:
      "S1 - Teknik Informatika",
    [ProgramStudiDosenPenelitian.S1_MANAJEMEN]: "S1 - Manajemen",
    [ProgramStudiDosenPenelitian.S1_AKUNTANSI]: "S1 - Akuntansi",
    [ProgramStudiDosenPenelitian.S1_TEKNIK_SIPIL]: "S1 - Teknik Sipil",
    [ProgramStudiDosenPenelitian.S1_TEKNIK_INDUSTRI]: "S1 - Teknik Industri",
    [ProgramStudiDosenPenelitian.S1_PSIKOLOGI]: "S1 - Psikologi",
    [ProgramStudiDosenPenelitian.S1_DESAIN_KOMUNIKASI_VISUAL]:
      "S1 - Desain Komunikasi Visual",
    [ProgramStudiDosenPenelitian.S1_PTIK]: "S1 - PTIK",
    [ProgramStudiDosenPenelitian.S1_BIMBINGAN_KONSELING]:
      "S1 - Bimbingan Konseling",
    [ProgramStudiDosenPenelitian.S1_BAHASA_INGGRIS]: "S1 - Bahasa Inggris",
    [ProgramStudiDosenPenelitian.S2_TEKNIK_INFORMATIKA]:
      "S2 - Teknik Informatika",
    [ProgramStudiDosenPenelitian.S2_MANAJEMEN]: "S2 - Manajemen",
    [ProgramStudiDosenPenelitian.S3_TEKNOLOGI_INFORMASI]:
      "S3 - Teknologi Informasi",
  };
  return labels[value] || value;
};

export function PengabdianAddEditModal({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
}: PengabdianAddEditModalProps) {
  const [formData, setFormData] = useState<{
    judulPengabdian: string;
    kategoriPengabdian: string;
    lamaKegiatan: string;
    tahunKegiatan: number;
    anggaran: string;
    sumberAnggaran: string;
    luaran: string[];
    dosenPengabdian: Array<{
      namaDosen: string;
      NIDN: string;
      roleDosenPengabdian: string;
      programStudiDosenPengabdian: string;
    }>;
    linkProposal: string;
  }>({
    judulPengabdian: "",
    kategoriPengabdian: "",
    lamaKegiatan: "",
    tahunKegiatan: new Date().getFullYear(),
    anggaran: "",
    sumberAnggaran: "",
    luaran: [],
    dosenPengabdian: [
      {
        namaDosen: "",
        NIDN: "",
        roleDosenPengabdian: "",
        programStudiDosenPengabdian: "",
      },
    ],
    linkProposal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        judulPengabdian: initialData.judulPengabdian,
        kategoriPengabdian: initialData.kategoriPengabdian,
        lamaKegiatan: initialData.lamaKegiatan,
        tahunKegiatan: initialData.tahunKegiatan,
        anggaran: initialData.anggaran?.toString() || "",
        sumberAnggaran: initialData.sumberAnggaran || "",
        luaran: initialData.luaran || [],
        dosenPengabdian:
          initialData.dosenPengabdian.length > 0
            ? initialData.dosenPengabdian.map((dp) => ({
                namaDosen: dp.namaDosen,
                NIDN: dp.NIDN,
                roleDosenPengabdian: dp.roleDosenPengabdian,
                programStudiDosenPengabdian: dp.programStudiDosenPengabdian,
              }))
            : [
                {
                  namaDosen: "",
                  NIDN: "",
                  roleDosenPengabdian: "",
                  programStudiDosenPengabdian: "",
                },
              ],
        linkProposal: initialData.linkProposal,
      });
    } else {
      setFormData({
        judulPengabdian: "",
        kategoriPengabdian: "",
        lamaKegiatan: "",
        tahunKegiatan: new Date().getFullYear(),
        anggaran: "",
        sumberAnggaran: "",
        luaran: [],
        dosenPengabdian: [
          {
            namaDosen: "",
            NIDN: "",
            roleDosenPengabdian: "",
            programStudiDosenPengabdian: "",
          },
        ],
        linkProposal: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.judulPengabdian ||
      !formData.kategoriPengabdian ||
      !formData.lamaKegiatan ||
      !formData.linkProposal
    ) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Validate dosen pengabdian
    for (const dosen of formData.dosenPengabdian) {
      if (
        !dosen.namaDosen ||
        !dosen.NIDN ||
        !dosen.roleDosenPengabdian ||
        !dosen.programStudiDosenPengabdian
      ) {
        toast.error("Mohon lengkapi semua data dosen pengabdian");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Transform form data to match API expectations
      const submitData = {
        ...formData,
        kategoriPengabdian: formData.kategoriPengabdian as KategoriPengabdian,
        luaran: formData.luaran as LuaranPengabdian[],
        anggaran: formData.anggaran ? parseInt(formData.anggaran) : undefined,
        tahunKegiatan: parseInt(formData.tahunKegiatan.toString()),
        dosenPengabdian: formData.dosenPengabdian.map((dosen) => ({
          ...dosen,
          roleDosenPengabdian: dosen.roleDosenPengabdian as RoleDosenPengabdian,
          programStudiDosenPengabdian:
            dosen.programStudiDosenPengabdian as ProgramStudiDosenPenelitian,
        })),
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("Error saving pengabdian:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLuaranChange = (luaranValue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      luaran: checked
        ? [...prev.luaran, luaranValue]
        : prev.luaran.filter((l) => l !== luaranValue),
    }));
  };

  const addDosenPengabdian = () => {
    setFormData((prev) => ({
      ...prev,
      dosenPengabdian: [
        ...prev.dosenPengabdian,
        {
          namaDosen: "",
          NIDN: "",
          roleDosenPengabdian: "",
          programStudiDosenPengabdian: "",
        },
      ],
    }));
  };

  const removeDosenPengabdian = (index: number) => {
    if (formData.dosenPengabdian.length > 1) {
      setFormData((prev) => ({
        ...prev,
        dosenPengabdian: prev.dosenPengabdian.filter((_, i) => i !== index),
      }));
    }
  };

  const updateDosenPengabdian = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      dosenPengabdian: prev.dosenPengabdian.map((dosen, i) =>
        i === index ? { ...dosen, [field]: value } : dosen
      ),
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Pengabdian" : "Tambah Pengabdian Baru"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5">
          {/* Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              📋 Informasi Dasar
            </h3>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="judulPengabdian"
                  className="text-sm font-medium text-gray-700">
                  Judul Pengabdian *
                </Label>
                <Input
                  id="judulPengabdian"
                  value={formData.judulPengabdian}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      judulPengabdian: e.target.value,
                    }))
                  }
                  placeholder="Masukkan judul pengabdian yang spesifik dan jelas"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="kategoriPengabdian"
                  className="text-sm font-medium text-gray-700">
                  Kategori Pengabdian *
                </Label>
                <Select
                  value={formData.kategoriPengabdian}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      kategoriPengabdian: value,
                    }))
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori pengabdian" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.values(KategoriPengabdian).map((kategori) => (
                      <SelectItem
                        key={kategori}
                        value={kategori}>
                        {getKategoriLabel(kategori)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="lamaKegiatan"
                  className="text-sm font-medium text-gray-700">
                  Lama Kegiatan *
                </Label>
                <Input
                  id="lamaKegiatan"
                  value={formData.lamaKegiatan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lamaKegiatan: e.target.value,
                    }))
                  }
                  placeholder="Contoh: 12 bulan"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="tahunKegiatan"
                    className="text-sm font-medium text-gray-700">
                    Tahun Kegiatan *
                  </Label>
                  <Input
                    id="tahunKegiatan"
                    type="number"
                    value={formData.tahunKegiatan}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tahunKegiatan: parseInt(e.target.value),
                      }))
                    }
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="anggaran"
                    className="text-sm font-medium text-gray-700">
                    Anggaran (Rp)
                  </Label>
                  <Input
                    id="anggaran"
                    type="number"
                    value={formData.anggaran}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        anggaran: e.target.value,
                      }))
                    }
                    placeholder="50000000"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="sumberAnggaran"
                    className="text-sm font-medium text-gray-700">
                    Sumber Anggaran
                  </Label>
                  <Input
                    id="sumberAnggaran"
                    value={formData.sumberAnggaran}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sumberAnggaran: e.target.value,
                      }))
                    }
                    placeholder="LPPM, DIKTI, Mandiri"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="linkProposal"
                  className="text-sm font-medium text-gray-700">
                  Link Proposal *
                </Label>
                <Input
                  id="linkProposal"
                  type="url"
                  value={formData.linkProposal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkProposal: e.target.value,
                    }))
                  }
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Luaran Pengabdian */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              🎯 Luaran Pengabdian
            </h3>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Pilih Luaran Pengabdian
              </Label>
              <Select
                value={formData.luaran.length > 0 ? formData.luaran[0] : ""}
                onValueChange={(value) => {
                  if (value && !formData.luaran.includes(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      luaran: [...prev.luaran, value],
                    }));
                  }
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih luaran pengabdian..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Object.values(LuaranPengabdian).map((luaran) => (
                    <SelectItem
                      key={luaran}
                      value={luaran}
                      disabled={formData.luaran.includes(luaran)}>
                      {getLuaranLabel(luaran)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Luaran */}
              {formData.luaran.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">
                    Luaran yang dipilih:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.luaran.map((luaran) => (
                      <div
                        key={luaran}
                        className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm border border-blue-200">
                        <span>{getLuaranLabel(luaran)}</span>
                        <button
                          type="button"
                          onClick={() => handleLuaranChange(luaran, false)}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tim Pengabdian */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              👥 Tim Pengabdian
            </h3>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Anggota Tim Pengabdian *
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDosenPengabdian}
                className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Tambah
              </Button>
            </div>

            <div className="space-y-3">
              {formData.dosenPengabdian.map((dosen, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-800">
                      👨‍🎓 Pengabdian #{index + 1}
                    </h4>
                    {formData.dosenPengabdian.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDosenPengabdian(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">
                        Nama Dosen *
                      </Label>
                      <Input
                        value={dosen.namaDosen}
                        onChange={(e) =>
                          updateDosenPengabdian(
                            index,
                            "namaDosen",
                            e.target.value
                          )
                        }
                        placeholder="Nama lengkap dosen"
                        className="text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">
                        NIDN *
                      </Label>
                      <Input
                        value={dosen.NIDN}
                        onChange={(e) =>
                          updateDosenPengabdian(index, "NIDN", e.target.value)
                        }
                        placeholder="Contoh: 0123456789"
                        className="text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">
                        Role *
                      </Label>
                      <Select
                        value={dosen.roleDosenPengabdian}
                        onValueChange={(value) =>
                          updateDosenPengabdian(
                            index,
                            "roleDosenPengabdian",
                            value
                          )
                        }>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={RoleDosenPengabdian.KETUA}>
                            👑 Ketua
                          </SelectItem>
                          <SelectItem value={RoleDosenPengabdian.ANGGOTA}>
                            👥 Anggota
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">
                        Program Studi *
                      </Label>
                      <Select
                        value={dosen.programStudiDosenPengabdian}
                        onValueChange={(value) =>
                          updateDosenPengabdian(
                            index,
                            "programStudiDosenPengabdian",
                            value
                          )
                        }>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Pilih program studi" />
                        </SelectTrigger>
                        <SelectContent className="max-h-40">
                          {Object.values(ProgramStudiDosenPenelitian).map(
                            (prodi) => (
                              <SelectItem
                                key={prodi}
                                value={prodi}
                                className="text-sm">
                                {getProgramStudiLabel(prodi)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6">
              ❌ Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-blue-600 hover:bg-blue-700">
              {isSubmitting
                ? "⏳ Menyimpan..."
                : initialData
                ? "✏️ Update Pengabdian"
                : "💾 Simpan Pengabdian"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
