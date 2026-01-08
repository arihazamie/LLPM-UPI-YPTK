import { BookCard } from "./book-card";

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

interface BookGridProps {
  books: Book[];
  loading?: boolean;
}

export function BookGrid({ books, loading = false }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📚</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Buku
        </h3>
        <p className="text-gray-600">
          Buku akan muncul di sini ketika tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}

