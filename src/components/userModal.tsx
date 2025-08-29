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
import { User, Mail, Shield, LogOut } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface UserProfileModalProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export function UserProfileModal({ user }: UserProfileModalProps) {
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
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-semibold">
            Profil Pengguna
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Informasi detail akun Anda
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-6">
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
              className={`${getRoleColor(user.role)} font-medium px-3 py-1`}>
              <Shield className="h-3 w-3 mr-1" />
              {user.role}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
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
