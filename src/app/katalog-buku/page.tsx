"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { BookGrid } from "@/components/book-grid";

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
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: {
    id: string;
    name: string;
    email: string | null;
  };
}

export default function KatalogBukuPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch("/api/public/buku");
        if (response.ok) {
          const result = await response.json();
          setBooks(result.data ?? []);
        } else {
          throw new Error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <main className="flex-1">
      <PageHeader
        title="Katalog"
        subtitle="Buku"
        description="Jelajahi koleksi buku dan publikasi dari peneliti LPPM UPI YPTK Padang."
        badge="Literasi • Pengetahuan • Referensi"
        icon={<BookOpen className="h-4 w-4" />}
      />

      {/* Content Section */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-6">
          <BookGrid
            books={books}
            loading={loading}
          />
        </div>
      </section>
    </main>
  );
}
