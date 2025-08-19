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
import { PlusIcon, EditIcon, TrashIcon, EyeIcon } from "lucide-react";
import { PreviewModal } from "@/components/dashboard/admin/modals/PreviewModal";
import { AddEditModal } from "@/components/dashboard/admin/modals/AddEditModal";
import { DeleteModal } from "@/components/dashboard/admin/modals/DeleteModal";
import {
  CreatePostData,
  PostType,
  UpdatePostData,
  type Post,
} from "@/types/post-type";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { usePosts } from "@/hooks/use-posts";

export default function BeritaTab() {
  const previewModal = useModal();
  const addEditModal = useModal();
  const deleteModal = useModal();
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [loading, setLoading] = useState(false);

  const {
    posts,
    loading: postsLoading,
    createPost,
    updatePost,
    deletePost,
  } = usePosts(PostType.BERITA);

  const handlePreview = (item: Post) => {
    setSelectedItem(item);
    previewModal.openModal();
  };

  const handleAdd = () => {
    setModalMode("add");
    setSelectedItem(null);
    addEditModal.openModal();
  };

  const handleEdit = (item: Post) => {
    setModalMode("edit");
    setSelectedItem(item);
    addEditModal.openModal();
  };

  const handleDelete = (item: Post) => {
    setSelectedItem(item);
    deleteModal.openModal();
  };

  const handleSave = async (data: CreatePostData | UpdatePostData) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        await createPost(data as CreatePostData);
      } else if (selectedItem) {
        await updatePost({ ...(data as UpdatePostData), id: selectedItem.id });
      }
      addEditModal.closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      await deletePost(selectedItem.id);
      deleteModal.closeModal();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 ">Berita</h1>
          <p className="text-gray-600  mt-2">
            Kelola berita dan informasi terkini
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-red-500 hover:bg-red-600 text-white">
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>
          <CardDescription>
            Semua berita yang telah dipublikasi ({posts.length} berita)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat berita...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Belum ada berita. Tambah berita pertama Anda!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 ">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>
                        Penulis: {item.author.name || item.author.email}
                      </span>
                      <span>Tanggal: {formatDate(item.createdAt)}</span>
                      {item.location && <span>Lokasi: {item.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500 text-white">Berita</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(item)}>
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}>
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}>
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={previewModal.closeModal}
        data={selectedItem}
      />

      <AddEditModal
        isOpen={addEditModal.isOpen}
        onClose={addEditModal.closeModal}
        onSave={handleSave}
        data={selectedItem}
        type={PostType.BERITA}
        mode={modalMode}
        loading={loading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleConfirmDelete}
        title={selectedItem?.title || ""}
        type={PostType.BERITA}
        loading={loading}
      />
    </div>
  );
}
