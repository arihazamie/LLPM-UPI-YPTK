import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
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

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      {book.coverBook ? (
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={book.coverBook}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="relative h-64 w-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
          <BookOpen className="w-24 h-24 text-blue-400" />
        </div>
      )}

      <CardHeader className="pb-3 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {book.year || formatDate(book.createdAt)}
          </div>
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {book.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4 mr-1" />
          {book.author}
        </div>
        {book.shortDesc && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {book.shortDesc}
          </p>
        )}
        {book.price && (
          <p className="text-sm font-semibold text-blue-600 mt-2">
            {formatPrice(book.price)}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group/btn w-full">
          <Link href={`/katalog-buku/${book.id}`}>
            Lihat Detail
            <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
