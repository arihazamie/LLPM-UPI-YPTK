"use client";

import { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Book {
  id?: string;
  title: string;
  author: string;
  isbn?: string | null;
  pages?: number | null;
  size?: string | null;
  year?: number | null;
  shortDesc?: string | null;
  synopsis?: string | null;
  price?: number | null;
  coverBook?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BukuAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    book: Partial<Book> & { coverBook?: File | null }
  ) => Promise<boolean>;
  book?: Book;
}

export function BukuAddEditModal({
  isOpen,
  onClose,
  onSave,
  book,
}: BukuAddEditModalProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [pages, setPages] = useState(book?.pages?.toString() || "");
  const [size, setSize] = useState(book?.size || "");
  const [year, setYear] = useState(book?.year?.toString() || "");
  const [shortDesc, setShortDesc] = useState(book?.shortDesc || "");
  const [synopsis, setSynopsis] = useState(book?.synopsis || "");
  const [price, setPrice] = useState(book?.price?.toString() || "");
  const [coverBookFile, setCoverBookFile] = useState<File | null>(null);
  const [coverBookPreview, setCoverBookPreview] = useState<string | null>(
    book?.coverBook || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setIsbn(book.isbn || "");
      setPages(book.pages?.toString() || "");
      setSize(book.size || "");
      setYear(book.year?.toString() || "");
      setShortDesc(book.shortDesc || "");
      setSynopsis(book.synopsis || "");
      setPrice(book.price?.toString() || "");
      setCoverBookPreview(book.coverBook || null);
      setCoverBookFile(null);
    } else {
      // Reset for "Tambah" mode
      setTitle("");
      setAuthor("");
      setIsbn("");
      setPages("");
      setSize("");
      setYear("");
      setShortDesc("");
      setSynopsis("");
      setPrice("");
      setCoverBookPreview(null);
      setCoverBookFile(null);
    }
  }, [book, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan PNG, JPG, atau JPEG");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB");
        return;
      }

      setCoverBookFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverBookPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverBookFile(null);
    setCoverBookPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    // Validation for required fields
    if (!title.trim()) {
      toast.error("Judul buku harus diisi");
      return;
    }

    if (!author.trim()) {
      toast.error("Penulis harus diisi");
      return;
    }

    const success = await onSave({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || null,
      pages: pages ? parseInt(pages) : null,
      size: size.trim() || null,
      year: year ? parseInt(year) : null,
      shortDesc: shortDesc.trim() || null,
      synopsis: synopsis.trim() || null,
      price: price ? parseInt(price) : null,
      coverBook: coverBookFile,
    });

    if (success) {
      onClose();
      // Reset form
      setTitle("");
      setAuthor("");
      setIsbn("");
      setPages("");
      setSize("");
      setYear("");
      setShortDesc("");
      setSynopsis("");
      setPrice("");
      setCoverBookFile(null);
      setCoverBookPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Buku" : "Tambah Buku"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Buku *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul buku"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Penulis *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Masukkan nama penulis"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Masukkan ISBN"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun Terbit</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Contoh: 2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Tebal Halaman</Label>
              <Input
                id="pages"
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Contoh: 250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Ukuran Buku</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Contoh: 15.5 x 23 cm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Masukkan harga (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
            <Textarea
              id="shortDesc"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Masukkan deskripsi singkat buku"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Sinopsis</Label>
            <Textarea
              id="synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Masukkan sinopsis buku"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverBook">Cover Buku</Label>
            {coverBookPreview ? (
              <div className="relative">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image
                    src={coverBookPreview}
                    alt="Preview cover buku"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="coverBook"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverBook"
                  className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 mb-1">
                    Klik untuk upload gambar
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, JPEG (Maks. 5MB)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
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
