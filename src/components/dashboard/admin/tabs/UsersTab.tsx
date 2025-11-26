"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, PlusIcon, EditIcon, TrashIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email?: string;
  nohp?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nohp: "",
    password: "",
    confirmPassword: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    nohp: "",
    password: "",
    confirmPassword: "",
    role: "DOSEN",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Gagal mengambil data dosen");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          nohp: formData.nohp || undefined,
          password: formData.password,
          role: "DOSEN",
        }),
      });

      if (response.ok) {
        toast.success("Akun dosen berhasil dibuat");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal membuat akun");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Terjadi kesalahan saat membuat akun");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Akun berhasil dihapus");
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal menghapus akun");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Terjadi kesalahan saat menghapus akun");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      nohp: "",
      password: "",
      confirmPassword: "",
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email || "",
      nohp: user.nohp || "",
      password: "",
      confirmPassword: "",
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditUser = async () => {
    if (
      editFormData.password &&
      editFormData.password !== editFormData.confirmPassword
    ) {
      toast.error("Password tidak cocok");
      return;
    }

    if (editFormData.password && editFormData.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    if (!selectedUser) return;

    try {
      const updateData: Record<string, unknown> = {
        name: editFormData.name,
        email: editFormData.email || undefined,
        nohp: editFormData.nohp || undefined,
        role: editFormData.role,
      };

      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Akun berhasil diperbarui");
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal memperbarui akun");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Terjadi kesalahan saat memperbarui akun");
    }
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Dosen</h1>
          <p className="text-gray-600 mt-2">Kelola akun DOSEN yang terdaftar</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Dosen</h1>
          <p className="text-gray-600 mt-2">
            Admin dapat menambah dan memperbarui akun DOSEN
          </p>
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah Dosen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Akun Dosen Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi dosen yang ingin ditambahkan ke sistem
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Opsional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contoh@email.com"
                />
              </div>
              <div>
                <Label htmlFor="nohp">Nomor HP (Opsional)</Label>
                <Input
                  id="nohp"
                  value={formData.nohp}
                  onChange={(e) =>
                    setFormData({ ...formData, nohp: e.target.value })
                  }
                  placeholder="08123456789"
                />
              </div>
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                Role akun akan otomatis diset ke{" "}
                <span className="font-semibold text-gray-900">DOSEN</span>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Konfirmasi password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleCreateUser}
                className="bg-red-500 hover:bg-red-600">
                Buat Dosen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua dosen terdaftar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Terhubung
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800">
              Email
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.email).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Dosen dengan email aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kontak Tersimpan
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800">
              No. HP
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.nohp).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Dosen dengan nomor HP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
          <CardDescription>
            Kelola seluruh akun DOSEN yang aktif di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.nohp || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN" ? "destructive" : "secondary"
                      }
                      className={
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Perbarui informasi pengguna</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email (Opsional)</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                placeholder="contoh@email.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-nohp">Nomor HP (Opsional)</Label>
              <Input
                id="edit-nohp"
                value={editFormData.nohp}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, nohp: e.target.value })
                }
                placeholder="08123456789"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                value={editFormData.role}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="DOSEN">DOSEN</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-password">Password Baru (Opsional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editFormData.password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, password: e.target.value })
                }
                placeholder="Kosongkan jika tidak ingin mengubah password"
              />
            </div>
            <div>
              <Label htmlFor="edit-confirmPassword">
                Konfirmasi Password Baru
              </Label>
              <Input
                id="edit-confirmPassword"
                type="password"
                value={editFormData.confirmPassword}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Konfirmasi password baru"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleEditUser}
              className="bg-blue-500 hover:bg-blue-600">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun{" "}
              <span className="font-semibold">{selectedUser?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleDeleteUser}
              variant="destructive">
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
