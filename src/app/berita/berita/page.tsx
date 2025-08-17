"use client";

import { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { fetchPosts } from "@/lib/api";
import { PostType, type Post } from "@/types/post-type";

export default function BeritaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts(PostType.BERITA);
        setPosts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch berita:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="flex-1">
      <PageHeader
        title="Berita"
        subtitle="Terkini"
        description="Ikuti berita terbaru dan perkembangan kegiatan LPPM UPI YPTK Padang."
        badge="Informasi • Terkini • Update"
        icon={<Newspaper className="h-4 w-4" />}
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
