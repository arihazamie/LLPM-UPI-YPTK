"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePosts } from "@/hooks/use-posts";
import { PostType } from "@/types/post-type";
import { useMemo } from "react";

export default function HomeTab() {
  const { posts: allPosts } = usePosts();

  const { articles, news, agenda, webinars } = useMemo(() => {
    return {
      articles: allPosts.filter((post) => post.type === PostType.ARTIKEL),
      news: allPosts.filter((post) => post.type === PostType.BERITA),
      announcements: allPosts.filter(
        (post) => post.type === PostType.PENGUMUMAN
      ),
      agenda: allPosts.filter((post) => post.type === PostType.AGENDA),
      webinars: allPosts.filter((post) => post.type === PostType.WEBINAR),
    };
  }, [allPosts]);

  const getUpcomingEvents = () => {
    const now = new Date();
    return [...agenda, ...webinars].filter((item) => {
      if (!item.startDate) return false;
      return new Date(item.startDate) > now;
    }).length;
  };

  const getRecentActivity = () => {
    return allPosts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3)
      .map((post) => ({
        title: `${getTypeLabel(post.type)} baru: ${post.title}`,
        time: getRelativeTime(post.createdAt),
        type: post.type,
        color: getTypeColor(post.type),
      }));
  };

  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case PostType.ARTIKEL:
        return "Artikel";
      case PostType.BERITA:
        return "Berita";
      case PostType.PENGUMUMAN:
        return "Pengumuman";
      case PostType.AGENDA:
        return "Agenda";
      case PostType.WEBINAR:
        return "Webinar";
      default:
        return "Konten";
    }
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.ARTIKEL:
        return "bg-blue-500";
      case PostType.BERITA:
        return "bg-red-500";
      case PostType.PENGUMUMAN:
        return "bg-yellow-500";
      case PostType.AGENDA:
        return "bg-green-500";
      case PostType.WEBINAR:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return past.toLocaleDateString("id-ID");
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang di Dashboard ADMIN
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola konten dan informasi dengan mudah
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">Artikel tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berita Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{news.length}</div>
            <p className="text-xs text-muted-foreground">Berita terpublikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agenda Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUpcomingEvents()}</div>
            <p className="text-xs text-muted-foreground">Acara dijadwalkan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPosts.length}</div>
            <p className="text-xs text-muted-foreground">Semua konten</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Update terbaru dari sistem</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Belum ada aktivitas. Mulai dengan menambah konten!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {getTypeLabel(activity.type)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
