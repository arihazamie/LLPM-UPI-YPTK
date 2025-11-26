"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

interface UserProfileModalProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export function UserProfileModal({ user }: UserProfileModalProps) {
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "dosen":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "pimpinan":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handlePasswordUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Password baru dan konfirmasi wajib diisi.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: "",
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Gagal memperbarui password.");
        return;
      }

      toast.success(result.message || "Password berhasil diperbarui.");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setIsPasswordFormVisible(false);
    } catch (error) {
      console.error("Dosen change password error:", error);
      toast.error("Terjadi kesalahan saat memperbarui password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDosen = user.role?.toLowerCase() === "dosen";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="gap-2 bg-white/50 rounded-full hover:bg-white/80 shadow-xl">
          <User className="h-4 w-4" />
          Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            Profil Pengguna
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Informasi detail akun Anda
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
            <AvatarImage
              src="/placeholder.svg"
              alt={user.name}
            />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {user.name}
            </h3>
            <Badge
              variant="secondary"
              className={`${getRoleColor(user.role)} font-medium px-3`}>
              <Shield className="h-3 w-3 mr-1" />
              {user.role}
            </Badge>
          </div>
        </div>

        <Separator className="my-1" />

        <div className="space-y-1">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Nama Lengkap
              </p>
              <p className="text-sm text-foreground font-medium truncate">
                {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm text-foreground font-medium truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {isDosen && (
          <>
            <Separator className="my-1" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold">Ganti Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Dosen dapat mengganti password tanpa verifikasi email atau
                    password lama.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() =>
                    setIsPasswordFormVisible((prevState) => !prevState)
                  }>
                  {isPasswordFormVisible ? "Tutup" : "Ganti Password"}
                </Button>
              </div>

              {isPasswordFormVisible && (
                <form
                  className="space-y-4 rounded-lg border border-dashed border-gray-200 p-4"
                  onSubmit={handlePasswordUpdate}>
                  <div className="space-y-2">
                    <Label htmlFor="dosen-new-password">Password Baru</Label>
                    <Input
                      id="dosen-new-password"
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
                  <div className="space-y-2">
                    <Label htmlFor="dosen-confirm-password">
                      Konfirmasi Password Baru
                    </Label>
                    <Input
                      id="dosen-confirm-password"
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
                    className="w-full bg-red-500 text-white hover:bg-red-600"
                    disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Simpan Password
                  </Button>
                </form>
              )}
            </div>
          </>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 bg-transparent">
              Tutup
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await signOut({ callbackUrl: "/" });
                toast.success("Berhasil logout");
              } catch (error) {
                toast.error("Gagal logout", {
                  description:
                    error instanceof Error ? error.message : undefined,
                });
              }
            }}
            className="flex-1 gap-2">
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
