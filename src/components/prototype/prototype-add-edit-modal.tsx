"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import type { Prototype } from "@/types/pkm-types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrototypeAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Prototype>) => Promise<void> | void;
  prototype?: Prototype;
}

export function PrototypeAddEditModal({
  isOpen,
  onClose,
  onSave,
  prototype,
}: PrototypeAddEditModalProps) {
  const [formData, setFormData] = useState({
    namaPrototype: "",
    fungsiPrototype: "",
    penggunaUtama: "",
    author: [] as string[],
    jenisPrototype: "",
    link: "",
  });
  const [newAuthor, setNewAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const jenisOptions = [
    "ALAT",
    "APLIKASI",
    "ALGORITMA",
    "MODUL",
    "PSEUDOCODE",
    "METODE",
  ];

  useEffect(() => {
    if (prototype) {
      setFormData({
        namaPrototype: prototype.namaPrototype || "",
        fungsiPrototype: prototype.fungsiPrototype || "",
        penggunaUtama: prototype.penggunaUtama || "",
        author: prototype.author || [],
        jenisPrototype: Array.isArray(prototype.jenisPrototype)
          ? prototype.jenisPrototype[0] || ""
          : prototype.jenisPrototype || "",
        link: prototype.link || "",
      });
    } else {
      setFormData({
        namaPrototype: "",
        fungsiPrototype: "",
        penggunaUtama: "",
        author: [],
        jenisPrototype: "",
        link: "",
      });
    }
  }, [prototype, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        jenisPrototype: [formData.jenisPrototype], // Convert to array
      };
      await onSave(submitData);
      onClose();
    } catch (error) {
      toast.error("Gagal menyimpan prototype", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !formData.author.includes(newAuthor.trim())) {
      setFormData((prev) => ({
        ...prev,
        author: [...prev.author, newAuthor.trim()],
      }));
      setNewAuthor("");
    }
  };

  const removeAuthor = (authorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      author: prev.author.filter((author) => author !== authorToRemove),
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-red-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            {prototype ? "Edit Prototype" : "Tambah Prototype Baru"}
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2 font-medium">
            {prototype
              ? "Perbarui informasi prototype di bawah ini."
              : "Isi detail untuk membuat prototype baru untuk UPI YPTK Padang."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label
              htmlFor="namaPrototype"
              className="text-sm font-semibold text-slate-700">
              Nama Prototype *
            </Label>
            <Input
              id="namaPrototype"
              value={formData.namaPrototype}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  namaPrototype: e.target.value,
                }))
              }
              placeholder="Masukkan nama prototype"
              required
              className="h-11 border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="fungsiPrototype"
              className="text-sm font-semibold text-slate-700">
              Fungsi Prototype *
            </Label>
            <Textarea
              id="fungsiPrototype"
              value={formData.fungsiPrototype}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fungsiPrototype: e.target.value,
                }))
              }
              placeholder="Jelaskan fungsi dan tujuan prototype"
              required
              rows={4}
              className="resize-none border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="penggunaUtama"
              className="text-sm font-semibold text-slate-700">
              Pengguna Utama *
            </Label>
            <Input
              id="penggunaUtama"
              value={formData.penggunaUtama}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  penggunaUtama: e.target.value,
                }))
              }
              placeholder="Siapa target pengguna utama?"
              required
              className="h-11 border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Penulis
            </Label>
            <div className="flex gap-2">
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Tambah nama penulis"
                className="h-11 border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAuthor())
                }
              />
              <Button
                type="button"
                onClick={addAuthor}
                size="sm"
                className="px-4 h-11 bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white shadow-md font-medium">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.author.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                {formData.author.map((author, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-300 text-white font-medium shadow-sm">
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(author)}
                      className="hover:text-red-200 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Jenis Prototype *
            </Label>
            <Select
              value={formData.jenisPrototype}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, jenisPrototype: value }))
              }>
              <SelectTrigger className="h-11 border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm">
                <SelectValue placeholder="Pilih jenis prototype" />
              </SelectTrigger>
              <SelectContent className="bg-white border-red-200">
                {jenisOptions.map((jenis) => (
                  <SelectItem
                    key={jenis}
                    value={jenis}
                    className="hover:bg-red-50 focus:bg-red-50">
                    {jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="link"
              className="text-sm font-semibold text-slate-700">
              Link Prototype
            </Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="https://contoh.com/prototype"
              className="h-11 border-slate-200 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
            />
          </div>

          <DialogFooter className="gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-white border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-lg text-white font-medium"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : prototype ? (
                "Perbarui Prototype"
              ) : (
                "Buat Prototype"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
