"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Newspaper,
  Megaphone,
  CalendarDays,
  Monitor,
  Loader2,
} from "lucide-react";
import { fetchPosts, type Post } from "@/lib/api-utils";

export function HomeTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchPosts({ take: 20 });
        setPosts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ARTIKEL":
        return "bg-blue-100 text-blue-800";
      case "BERITA":
        return "bg-green-100 text-green-800";
      case "PENGUMUMAN":
        return "bg-yellow-100 text-yellow-800";
      case "AGENDA":
        return "bg-purple-100 text-purple-800";
      case "WEBINAR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ARTIKEL":
        return (
          <FileText
            size={16}
            className="text-blue-600"
          />
        );
      case "BERITA":
        return (
          <Newspaper
            size={16}
            className="text-green-600"
          />
        );
      case "PENGUMUMAN":
        return (
          <Megaphone
            size={16}
            className="text-yellow-600"
          />
        );
      case "AGENDA":
        return (
          <CalendarDays
            size={16}
            className="text-purple-600"
          />
        );
      case "WEBINAR":
        return (
          <Monitor
            size={16}
            className="text-red-600"
          />
        );
      default:
        return (
          <FileText
            size={16}
            className="text-gray-600"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di dashboard LPPM UPI YPTK
        </p>
      </div>

      {/* All Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Recent Activity with scroll */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-playfair">Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Konten yang baru dipublikasikan atau diperbarui
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
              {posts.slice(0, 8).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-yellow-100">
                      {getTypeIcon(post.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-tight">
                        {post.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        oleh {post.author.name || post.author.email} •{" "}
                        {new Date(post.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(post.type)}>
                      {post.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Data tidak ada
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Summary by Type */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-playfair">Ringkasan Konten</CardTitle>
            <CardDescription>
              Distribusi konten berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
              {["ARTIKEL", "BERITA", "PENGUMUMAN", "AGENDA", "WEBINAR"].map(
                (type) => {
                  const count = posts.filter(
                    (post) => post.type === type
                  ).length;

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-yellow-100">
                          {getTypeIcon(type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{type}</h4>
                          <p className="text-xs text-muted-foreground">
                            {count} konten dipublikasikan
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          konten
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
