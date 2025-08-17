"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchPostById } from "@/lib/api";
import { Post } from "@/types/post-type";

export default function ArtikelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchPostById(params.id as string);
        setPost(response.data ?? null);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadPost();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Artikel yang Anda cari tidak tersedia.
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
          Kembali ke Artikel
        </Button>

        {/* Post Content */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-purple-100 text-purple-700 border-0 font-semibold">
                <Calendar className="h-3 w-3 mr-1" />
                Artikel
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{post.author?.name}</span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
