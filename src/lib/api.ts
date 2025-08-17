import type { PostType, ApiResponse, Post } from "@/types/post-type";

const API_BASE_URL = "/api/postingan";

export async function fetchPosts(
  type?: PostType,
  take = 10,
  skip = 0
): Promise<ApiResponse<Post[]>> {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  params.append("take", take.toString());
  params.append("skip", skip.toString());

  const response = await fetch(`${API_BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}
export async function fetchPostById(id: string): Promise<ApiResponse<Post>> {
  const response = await fetch(`${API_BASE_URL}?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}
