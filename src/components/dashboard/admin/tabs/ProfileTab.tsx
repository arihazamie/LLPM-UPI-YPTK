"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditIcon } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { PostType } from "@/types/post-type";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

export default function ProfileTab() {
  const { posts: allPosts } = usePosts();

  const { data: session } = useSession();

  const { articles, news, webinars } = useMemo(() => {
    return {
      articles: allPosts.filter((post) => post.type === PostType.ARTIKEL),
      news: allPosts.filter((post) => post.type === PostType.BERITA),
      webinars: allPosts.filter((post) => post.type === PostType.WEBINAR),
    };
  }, [allPosts]);

  // Calculate real statistics from actual data
  const userStats = [
    {
      label: "Artikel Dibuat",
      value: articles.length.toString(),
      change:
        articles.length > 0
          ? `${articles.length} artikel`
          : "Belum ada artikel",
    },
    {
      label: "Berita Dipublikasi",
      value: news.length.toString(),
      change: news.length > 0 ? `${news.length} berita` : "Belum ada berita",
    },
    {
      label: "Webinar Dikelola",
      value: webinars.length.toString(),
      change:
        webinars.length > 0
          ? `${webinars.length} webinar`
          : "Belum ada webinar",
    },
    {
      label: "Total Konten",
      value: allPosts.length.toString(),
      change:
        allPosts.length > 0 ? `${allPosts.length} konten` : "Belum ada konten",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 ">Profile</h1>
        <p className="text-gray-600  mt-2">
          Kelola informasi akun dan pengaturan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="/images/avatar-admin.jpg" />
                <AvatarFallback className="bg-red-500 text-white text-2xl font-bold">
                  {session?.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{session?.user.name}</CardTitle>
              <CardDescription>{session?.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 ">Status</span>
                <Badge
                  variant="default"
                  className="bg-green-500 text-white">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 ">Role</span>
                <Badge
                  variant="secondary"
                  className="bg-red-500 text-white">
                  {session?.user.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 ">Bergabung</span>
                <span className="text-sm">{new Date().getFullYear()}</span>
              </div>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                <EditIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Aktivitas</CardTitle>
              <CardDescription>Ringkasan kontribusi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {userStats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600  mt-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>Kelola preferensi dan keamanan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <SettingsIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Pengaturan Umum</p>
                    <p className="text-sm text-gray-600 ">
                      Bahasa, zona waktu, dan preferensi
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm">
                  Kelola
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShieldIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Keamanan</p>
                    <p className="text-sm text-gray-600 ">
                      Password, 2FA, dan sesi login
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm">
                  Kelola
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <BellIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Notifikasi</p>
                    <p className="text-sm text-gray-600 ">
                      Email dan push notifications
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm">
                  Kelola
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
