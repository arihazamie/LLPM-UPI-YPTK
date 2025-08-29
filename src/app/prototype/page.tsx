"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ZodIssue } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Cpu, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Prototype } from "@/types/pkm-types";
import { PrototypeAddEditModal } from "@/components/prototype/prototype-add-edit-modal";
import { PrototypeDeleteModal } from "@/components/prototype/prototype-delete-modal";
import { AuthorsModal } from "@/components/modalUsers";
import { useSession } from "next-auth/react";

export default function PrototypePage() {
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrototype, setEditingPrototype] = useState<
    Prototype | undefined
  >();
  const [deletingPrototype, setDeletingPrototype] = useState<
    Prototype | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    fetchPrototypes();
  }, []);

  const fetchPrototypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dosen/prototype");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPrototypes(
            result.data.map((item: Prototype) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            }))
          );
        } else {
          throw new Error(result.message || "Failed to fetch prototypes");
        }
      } else {
        throw new Error("Failed to fetch prototypes");
      }
      toast.success("Berhasil memuat data prototype");
    } catch (error) {
      toast.error("Gagal memuat data prototype", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrototype = async (prototypeData: Partial<Prototype>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dosen/prototype", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...prototypeData,
          jenisPrototype: Array.isArray(prototypeData.jenisPrototype)
            ? prototypeData.jenisPrototype
            : [prototypeData.jenisPrototype], // ubah string menjadi array
          createdById: session?.user.id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPrototypes([
          {
            ...result.data,
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          },
          ...prototypes,
        ]);
        toast.success("Prototype berhasil ditambahkan", {
          description: result.message,
        });
        setShowAddModal(false);
      } else {
        // Tampilkan error validasi jika ada
        if (result.errors) {
          (result.errors as ZodIssue[]).forEach((err) =>
            toast.error(`${err.path.join(".")}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal membuat prototype");
        }
      }
    } catch (error) {
      toast.error("Gagal menambahkan prototype", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPrototype = async (prototypeData: Partial<Prototype>) => {
    if (!editingPrototype) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/dosen/prototype/${editingPrototype.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prototypeData,
            jenisPrototype: Array.isArray(prototypeData.jenisPrototype)
              ? prototypeData.jenisPrototype
              : [prototypeData.jenisPrototype], // pastikan array
          }),
        }
      );

      const result: {
        success: boolean;
        message?: string;
        data?: Prototype;
        errors?: ZodIssue[];
      } = await response.json();

      if (response.ok && result.success) {
        setPrototypes(
          prototypes.map((prototype) =>
            prototype.id === editingPrototype.id
              ? {
                  ...result.data!,
                  createdAt: new Date(result.data!.createdAt),
                  updatedAt: new Date(result.data!.updatedAt),
                }
              : prototype
          )
        );
        toast.success("Prototype berhasil diperbarui", {
          description: result.message,
        });
        setEditingPrototype(undefined);
      } else {
        // Tampilkan error validasi jika ada
        if (result.errors) {
          result.errors.forEach((err) =>
            toast.error(`${err.path.join(".")}: ${err.message}`)
          );
        } else {
          toast.error(result.message || "Gagal memperbarui prototype");
        }
      }
    } catch (error) {
      toast.error("Gagal memperbarui prototype", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrototype = async (prototype: Prototype) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dosen/prototype/${prototype.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPrototypes(prototypes.filter((p) => p.id !== prototype.id));
        toast.success("Prototype berhasil dihapus", {
          description: result.message,
        });

        setDeletingPrototype(undefined);
      } else {
        throw new Error(result.message || "Failed to delete prototype");
      }
    } catch (error) {
      toast.error("", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrototypes = prototypes.filter(
    (prototype) =>
      prototype.namaPrototype
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prototype.fungsiPrototype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-red-500 to-yellow-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-400/10 to-yellow-400/10 rounded-full blur-3xl animate-spin"
            style={{ animationDuration: "20s" }}></div>
        </div>
      </div>
      <div className="relative z-10 container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-white bg-clip-text text-transparent drop-shadow-2xl">
              Manajemen Prototype
            </h1>
            <p className="text-lg text-white font-medium drop-shadow-sm">
              Kelola prototype teknologi dan inovasi UPI YPTK Padang
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="bg-white text-black px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Prototype
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            {filteredPrototypes.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Belum ada data prototype
                </h3>
                <p className="text-slate-500 text-center mb-6 max-w-sm">
                  Mulai dengan membuat prototype pertama Anda untuk UPI YPTK
                  Padang
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Prototype
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search and Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Cari prototype..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 h-10"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    Menampilkan {filteredPrototypes.length} prototype
                  </div>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader className="bg-slate-50 border-b">
                        <TableRow>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Nama
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Fungsi
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Pengguna Utama
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Penulis
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Jenis
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Dibuat
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-medium text-slate-700">
                            Link
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center font-medium text-slate-700">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPrototypes.map((prototype) => (
                          <TableRow
                            key={prototype.id}
                            className="hover:bg-slate-50 border-b">
                            <TableCell className="px-4 py-3">
                              <div className="font-semibold text-slate-800">
                                {prototype.namaPrototype}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 max-w-xs">
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {prototype.fungsiPrototype}
                              </p>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-slate-600 font-medium">
                              {prototype.penggunaUtama}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="text-sm text-slate-700 font-medium">
                                  {prototype.author[0]}
                                </span>
                                {prototype.author.length > 1 && (
                                  <AuthorsModal authors={prototype.author} />
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {prototype.jenisPrototype.map((jenis, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={`text-xs font-medium ${
                                      jenis === "ALAT"
                                        ? "border-red-200 text-red-700 bg-red-50"
                                        : jenis === "APLIKASI"
                                        ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                        : jenis === "ALGORITMA"
                                        ? "border-orange-200 text-orange-700 bg-orange-50"
                                        : jenis === "MODUL"
                                        ? "border-red-300 text-red-800 bg-red-100"
                                        : jenis === "PSEUDOCODE"
                                        ? "border-yellow-300 text-yellow-800 bg-yellow-100"
                                        : "border-orange-300 text-orange-800 bg-orange-100"
                                    }`}>
                                    {jenis}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-slate-500 font-medium">
                              {prototype.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm">
                              {prototype.link ? (
                                <a
                                  href={prototype.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors">
                                  <ExternalLink className="w-3 h-3 mr-1" />{" "}
                                  Lihat
                                </a>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center justify-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingPrototype(prototype)}
                                  className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeletingPrototype(prototype)
                                  }
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <PrototypeAddEditModal
          isOpen={showAddModal || !!editingPrototype}
          onClose={() => {
            setShowAddModal(false);
            setEditingPrototype(undefined);
          }}
          onSave={editingPrototype ? handleEditPrototype : handleAddPrototype}
          prototype={editingPrototype}
        />

        <PrototypeDeleteModal
          isOpen={!!deletingPrototype}
          onClose={() => setDeletingPrototype(undefined)}
          onConfirm={() =>
            deletingPrototype && handleDeletePrototype(deletingPrototype)
          }
          prototype={deletingPrototype ?? null}
        />
      </div>
    </div>
  );
}
