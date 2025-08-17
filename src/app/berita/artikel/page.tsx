"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { fetchPosts } from "@/lib/api";
import { PostType, type Post } from "@/types/post-type";

export default function ArtikelPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts(PostType.ARTIKEL);
        setPosts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="flex-1">
      <PageHeader
        title="Artikel"
        subtitle="Ilmiah"
        description="Baca artikel dan publikasi ilmiah terbaru dari peneliti LPPM UPI YPTK Padang."
        badge="Pengetahuan • Wawasan • Publikasi"
        icon={<BookOpen className="h-4 w-4" />}
      />

      {/* Content Section */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-6">
          <PostGrid
            posts={posts}
            loading={loading}
          />
        </div>
      </section>
    </main>
  );
}
