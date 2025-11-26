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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditIcon, Loader2 } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { PostType } from "@/types/post-type";
import { FormEvent, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProfileTab() {
  const { posts: allPosts } = usePosts();

  const { data: session } = useSession();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Semua kolom password wajib diisi.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Gagal memperbarui password.");
        return;
      }

      toast.success(result.message || "Password berhasil diperbarui.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Terjadi kesalahan saat memperbarui password.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>
                Ganti password secara berkala untuk menjaga keamanan akun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handlePasswordChange}>
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: event.target.value,
                      }))
                    }
                    placeholder="Masukkan password saat ini"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">
                    Konfirmasi Password Baru
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Ulangi password baru"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Simpan Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
