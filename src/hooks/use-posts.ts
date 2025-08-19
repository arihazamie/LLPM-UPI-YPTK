import useSWR, { mutate } from "swr";
import { postsApi, ApiError } from "@/lib/admin-api";
import { toast } from "@/hooks/use-toast";
import { PostType } from "@/types/post-type";
import type { Post, CreatePostData, UpdatePostData } from "@/types/post-type";

const fetcher = async () => {
  const response = await postsApi.getAll({});
  return response.data || [];
};

export function usePosts(type?: PostType) {
  const cacheKey = "posts/all";

  const {
    data: allPosts = [],
    error,
    isLoading,
    mutate: refetch,
  } = useSWR<Post[]>(cacheKey, fetcher, {
    revalidateOnMount: true, // ✅ Home fetch pertama kali
    revalidateIfStale: false, // ✅ tidak refetch kalau cache ada
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60,
    onError: (err) => {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to fetch posts";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // filter sesuai kebutuhan (BeritaTab, ArtikelTab, dll.)
  const posts = type ? allPosts.filter((p) => p.type === type) : allPosts;

  // CRUD tetap update cache utama
  const createPost = async (data: CreatePostData) => {
    const response = await postsApi.create(data);
    await mutate(cacheKey); // refresh cache utama
    toast({
      title: "Berhasil",
      description: response.message,
      variant: "success",
    });
    return response.data;
  };

  const updatePost = async (data: UpdatePostData) => {
    const response = await postsApi.update(data);
    await mutate(cacheKey);
    toast({
      title: "Berhasil",
      description: response.message,
      variant: "success",
    });
    return response.data;
  };

  const deletePost = async (id: string) => {
    const response = await postsApi.delete(id);
    await mutate(cacheKey);
    toast({
      title: "Berhasil",
      description: response.message,
      variant: "success",
    });
  };

  return {
    posts,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    createPost,
    updatePost,
    deletePost,
  };
}
