"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, LogOut } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  password: string;
  role: "PIMPINAN" | "ADMIN" | "DOSEN";
  createdAt: string;
  updatedAt: string;
  postCount: number;
}

export function ProfileTab() {
  const { data: session } = useSession();
  const profile = session?.user as UserProfile;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "PIMPINAN":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "DOSEN":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "PIMPINAN":
        return "Pimpinan";
      case "ADMIN":
        return "Administrator";
      case "DOSEN":
        return "Dosen";
      default:
        return "User";
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Kelola informasi profil dan pengaturan akun
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2 rounded-xl bg-transparent">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="h-full border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-yellow-500 text-white text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={profile.name}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-white text-red-600">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{profile.name}</h3>
                    <p className="text-white/90 text-sm">ID: {profile.id}</p>
                    <Badge className={`${getRoleColor(profile.role)} mt-2`}>
                      <Shield
                        size={12}
                        className="mr-1"
                      />
                      {getRoleText(profile.role)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail
                      size={16}
                      className="text-red-500"
                    />
                    <span className="text-gray-600">
                      {profile.email || "Email tidak tersedia"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6 h-full overflow-y-auto custom-scrollbar">
              {/* Personal Information */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User
                      size={20}
                      className="text-red-600"
                    />
                    Informasi Personal
                  </CardTitle>
                  <CardDescription>
                    Informasi dasar sesuai model User
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">User ID</Label>
                    <div className="p-3 bg-gray-50 rounded-xl text-sm font-mono">
                      {profile.id}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap (Unique)</Label>

                    <div className="p-3 bg-gray-50 rounded-xl text-sm">
                      {profile.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional, Unique)</Label>

                    <div className="p-3 bg-gray-50 rounded-xl text-sm">
                      {profile.email || "Tidak ada email"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="p-3 bg-gray-50 rounded-xl text-sm">
                      <Badge className={getRoleColor(profile.role)}>
                        <Shield
                          size={12}
                          className="mr-1"
                        />
                        {getRoleText(profile.role)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
