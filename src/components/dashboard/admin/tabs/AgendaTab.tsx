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
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
} from "lucide-react";
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

export default function AgendaTab() {
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
  } = usePosts(PostType.AGENDA);

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
      } else if (selectedItem?.id) {
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

  const getEventStatus = (
    startDate: Date | string | null,
    endDate: Date | string | null
  ) => {
    if (!startDate) return "Scheduled";
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (now < start) return "Scheduled";
    if (now > end) return "Completed";
    return "Ongoing";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agenda
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola jadwal dan acara penting
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-red-500 hover:bg-red-600 text-white">
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Agenda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Agenda</CardTitle>
          <CardDescription>
            Semua agenda dan acara yang dijadwalkan ({posts.length} agenda)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat agenda...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Belum ada agenda. Tambah agenda pertama Anda!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((event) => {
                const status = getEventStatus(
                  event.startDate ?? null,
                  event.endDate ?? null
                );
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {event.startDate && (
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDate(event.startDate)}
                            {event.endDate &&
                              event.endDate !== event.startDate && (
                                <span> - {formatDate(event.endDate)}</span>
                              )}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(event)}>
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
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
        type={PostType.AGENDA}
        mode={modalMode}
        loading={loading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleConfirmDelete}
        title={selectedItem?.title || ""}
        type={PostType.AGENDA}
        loading={loading}
      />
    </div>
  );
}
