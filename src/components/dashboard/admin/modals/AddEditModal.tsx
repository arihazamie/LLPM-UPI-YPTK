"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PostType,
  type Post,
  type CreatePostData,
  type UpdatePostData,
} from "@/types/post-type";

import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

interface FormDataState {
  title: string;
  content: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePostData | UpdatePostData) => Promise<void>;
  data?: Post | null; // ⬅️ biar aman, terima Post juga
  type: PostType;
  mode: "add" | "edit";
  loading?: boolean;
}

export function AddEditModal({
  isOpen,
  onClose,
  onSave,
  data,
  type,
  mode,
  loading = false,
}: AddEditModalProps) {
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    content: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        title: data.title || "",
        content: data.content || "",
        location: data.location || "",
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : "",
        endDate: data.endDate
          ? new Date(data.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        location: "",
        startDate: "",
        endDate: "",
      });
    }
    setThumbnailFile(null);
  }, [mode, data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      type,
      title: formData.title,
      content: formData.content,
      thumbnail: thumbnailFile,
      location: formData.location || undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      ...(mode === "edit" && { id: data?.id }),
    };

    try {
      await onSave(submitData);
      onClose();
    } catch (error) {
      toast({
        title: `${error}`,
        description: "Terjadi kesalahan saat menyimpan konten.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const getThumbnailName = (thumbnail?: string | File) => {
    if (!thumbnail) return "";
    if (typeof thumbnail === "string") {
      return thumbnail.split("/").pop() ?? "";
    }
    return thumbnail.name;
  };

  const getFormFields = () => {
    const commonFields = (
      <>
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-gray-700 font-medium">
            Judul *
          </Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Masukkan judul"
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="content"
            className="text-gray-700 font-medium">
            Konten *
          </Label>
          <Textarea
            id="content"
            value={formData.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Masukkan konten"
            rows={6}
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="thumbnail"
            className="text-gray-700 font-medium">
            Thumbnail
          </Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
          {data?.thumbnail && !thumbnailFile && (
            <p className="text-sm text-gray-500">
              Thumbnail saat ini: {getThumbnailName(data?.thumbnail)}
            </p>
          )}
        </div>
      </>
    );

    // Add type-specific fields
    const typeSpecificFields = () => {
      if (type === PostType.AGENDA || type === PostType.WEBINAR) {
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-gray-700 font-medium">
                  Tanggal Mulai
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-gray-700 font-medium">
                  Tanggal Selesai
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-gray-700 font-medium">
                Lokasi
              </Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Masukkan lokasi"
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </>
        );
      }
      return null;
    };

    return (
      <>
        {commonFields}
        {typeSpecificFields()}
      </>
    );
  };

  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case PostType.ARTIKEL:
        return "Artikel";
      case PostType.BERITA:
        return "Berita";
      case PostType.PENGUMUMAN:
        return "Pengumuman";
      case PostType.AGENDA:
        return "Agenda";
      case PostType.WEBINAR:
        return "Webinar";
      default:
        return "Konten";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
          <Image
            width={48}
            height={48}
            src="/logo.png"
            alt="UPI YPTK Logo"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "add" ? "Tambah" : "Edit"} {getTypeLabel(type)}
            </h2>
            <p className="text-sm text-gray-600">LPPM UPI YPTK Padang</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">{getFormFields()}</div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            disabled={loading}>
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}>
            {loading ? "Menyimpan..." : mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
