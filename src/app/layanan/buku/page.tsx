"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import DosenOnly from "@/components/auth/DosenOnly";
import { BukuAddEditModal } from "@/components/buku/buku-add-edit-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Book {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export default function BukuPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const { data: session } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/dosen/buku");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setBooks(
          data.map((item: Book) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))
        );
      } else {
        throw new Error("Failed to fetch books");
      }
    } catch (error) {
      toast.error("Gagal memuat data buku", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (
    bookData: Partial<Book> & { coverBook?: File | null }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", bookData.title || "");
      formData.append("author", bookData.author || "");
      if (bookData.isbn) formData.append("isbn", bookData.isbn);
      if (bookData.pages) formData.append("pages", bookData.pages.toString());
      if (bookData.size) formData.append("size", bookData.size);
      if (bookData.year) formData.append("year", bookData.year.toString());
      if (bookData.shortDesc) formData.append("shortDesc", bookData.shortDesc);
      if (bookData.synopsis) formData.append("synopsis", bookData.synopsis);
      if (bookData.price) formData.append("price", bookData.price.toString());
      if (bookData.coverBook && typeof bookData.coverBook !== "string") {
        formData.append("coverBook", bookData.coverBook);
      }

      const response = await fetch("/api/dosen/buku", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setBooks([
          {
            ...result.data,
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          },
          ...books,
        ]);
        toast.success(result.message || "Buku berhasil ditambahkan");
        return true;
      } else {
        toast.error(result.message || "Gagal menambahkan buku");
        return false;
      }
    } catch (error) {
      toast.error("Gagal menambahkan buku", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleEditBook = async (
    bookData: Partial<Book> & { coverBook?: File | null }
  ) => {
    if (!editingBook) return false;

    try {
      const formData = new FormData();
      formData.append("title", bookData.title || "");
      formData.append("author", bookData.author || "");
      if (bookData.isbn !== undefined)
        formData.append("isbn", bookData.isbn || "");
      if (bookData.pages !== undefined)
        formData.append("pages", bookData.pages?.toString() || "");
      if (bookData.size !== undefined)
        formData.append("size", bookData.size || "");
      if (bookData.year !== undefined)
        formData.append("year", bookData.year?.toString() || "");
      if (bookData.shortDesc !== undefined)
        formData.append("shortDesc", bookData.shortDesc || "");
      if (bookData.synopsis !== undefined)
        formData.append("synopsis", bookData.synopsis || "");
      if (bookData.price !== undefined)
        formData.append("price", bookData.price?.toString() || "");
      if (bookData.coverBook && typeof bookData.coverBook !== "string") {
        formData.append("coverBook", bookData.coverBook);
      }

      const response = await fetch(`/api/dosen/buku/${editingBook.id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setBooks(
          books.map((book) =>
            book.id === editingBook.id
              ? {
                  ...result.data,
                  createdAt: new Date(result.data.createdAt),
                  updatedAt: new Date(result.data.updatedAt),
                }
              : book
          )
        );
        toast.success(result.message || "Buku berhasil diperbarui");
        return true;
      } else {
        toast.error(result.message || "Gagal memperbarui buku");
        return false;
      }
    } catch (error) {
      toast.error("Gagal memperbarui buku", {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/dosen/buku/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== id));
        toast.success(result.message || "Buku berhasil dihapus");
      } else {
        toast.error(result.message || "Gagal menghapus buku");
      }
    } catch (error) {
      toast.error("Gagal menghapus buku", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <DosenOnly>
      <div className="min-h-screen relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-cyan-500 to-green-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-green-400/10 rounded-full blur-3xl animate-spin"
              style={{ animationDuration: "20s" }}></div>
          </div>
        </div>
        <div className="relative z-10 container mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight bg-white bg-clip-text text-transparent drop-shadow-2xl">
                Manajemen Buku - {session?.user?.name}
              </h1>
              <p className="text-lg text-white font-medium drop-shadow-sm">
                Kelola data buku UPI YPTK Padang
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              disabled={isLoading}
              className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
              <span className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Buku
              </span>
            </Button>
          </div>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {books.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Belum ada data buku
                  </h3>
                  <p className="text-slate-500 text-center mb-6 max-w-sm">
                    Mulai dengan menambahkan buku pertama Anda untuk UPI YPTK
                    Padang
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 shadow-lg">
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Buku
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul</TableHead>
                        <TableHead>Penulis</TableHead>
                        <TableHead>ISBN</TableHead>
                        <TableHead>Tahun</TableHead>
                        <TableHead>Halaman</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8">
                            Memuat data...
                          </TableCell>
                        </TableRow>
                      ) : (
                        books.map((book) => (
                          <TableRow key={book.id}>
                            <TableCell className="font-medium">
                              {book.title}
                            </TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{book.isbn || "-"}</TableCell>
                            <TableCell>{book.year || "-"}</TableCell>
                            <TableCell>{book.pages || "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingBook(book)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBook(book.id)}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <BukuAddEditModal
            isOpen={showAddModal || !!editingBook}
            onClose={() => {
              setShowAddModal(false);
              setEditingBook(undefined);
            }}
            onSave={editingBook ? handleEditBook : handleAddBook}
            book={editingBook}
          />
        </div>
      </div>
    </DosenOnly>
  );
}
