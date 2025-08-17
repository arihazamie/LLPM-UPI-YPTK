import { PostCard } from "./post-card";
import type { Post } from "@/types/post-type";

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
}

export function PostGrid({ posts, loading = false }: PostGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📄</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Postingan
        </h3>
        <p className="text-gray-600">
          Postingan akan muncul di sini ketika tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          basePath={`/berita/${post.type.toLocaleLowerCase()}`}
        />
      ))}
    </div>
  );
}
