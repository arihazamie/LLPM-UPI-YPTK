"use client";

import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { fetchPosts } from "@/lib/api";
import { PostType, type Post } from "@/types/post-type";

export default function InfoWebinarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts(PostType.WEBINAR);
        setPosts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch info webinar:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="flex-1">
      <PageHeader
        title="Info"
        subtitle="Webinar"
        description="Informasi webinar dan acara online dari LPPM UPI YPTK Padang."
        badge="Online • Webinar • Digital"
        icon={<Monitor className="h-4 w-4" />}
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
