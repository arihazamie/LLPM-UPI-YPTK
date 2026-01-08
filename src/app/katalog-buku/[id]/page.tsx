"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  FileText,
  DollarSign,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

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

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await fetch(`/api/public/buku/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          setBook(result.data ?? null);
        } else {
          throw new Error("Failed to fetch book");
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadBook();
    }
  }, [params.id]);

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Buku Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Buku yang Anda cari tidak tersedia.
          </p>
          <Button
            onClick={() => router.back()}
            variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-8 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Katalog
        </Button>

        {/* Book Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Cover Image */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            {book.coverBook ? (
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={book.coverBook}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <BookOpen className="w-32 h-32 text-blue-400" />
              </div>
            )}
          </Card>

          {/* Book Info */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-100 text-blue-700 border-0 font-semibold">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Buku
                </Badge>
                {book.year && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {book.year}
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                {book.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{book.author}</span>
              </div>

              {book.shortDesc && (
                <p className="text-gray-700 leading-relaxed mb-4">
                  {book.shortDesc}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {book.isbn && (
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-700 w-24">
                      ISBN:
                    </span>
                    <span className="text-gray-600">{book.isbn}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold text-gray-700 w-24">
                      Halaman:
                    </span>
                    <span className="text-gray-600">{book.pages} halaman</span>
                  </div>
                )}
                {book.size && (
                  <div className="flex items-center text-sm">
                    <Ruler className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold text-gray-700 w-24">
                      Ukuran:
                    </span>
                    <span className="text-gray-600">{book.size}</span>
                  </div>
                )}
                {book.price && (
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold text-gray-700 w-24">
                      Harga:
                    </span>
                    <span className="text-gray-600 font-semibold text-blue-600">
                      {formatPrice(book.price)}
                    </span>
                  </div>
                )}
                {book.createdBy && (
                  <div className="flex items-center text-sm pt-2 border-t">
                    <span className="font-semibold text-gray-700 w-24">
                      Ditambahkan oleh:
                    </span>
                    <span className="text-gray-600">{book.createdBy.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Synopsis */}
        {book.synopsis && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Sinopsis</h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.synopsis}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
