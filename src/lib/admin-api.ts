import type {
  PostType,
  Post,
  ApiResponse,
  CreatePostData,
  UpdatePostData,
} from "@/types/post-type";

const API_BASE = "/api/admin/postingan";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || "Something went wrong");
  }

  return data;
}

export const postsApi = {
  // Get all posts with optional filtering
  async getAll(params?: {
    type?: PostType;
    take?: number;
    skip?: number;
  }): Promise<ApiResponse<Post[]>> {
    const searchParams = new URLSearchParams();

    if (params?.type) searchParams.set("type", params.type);
    if (params?.take) searchParams.set("take", params.take.toString());
    if (params?.skip) searchParams.set("skip", params.skip.toString());

    const response = await fetch(`${API_BASE}?${searchParams}`);
    return handleResponse<Post[]>(response);
  },

  // Get single post by ID
  async getById(id: string): Promise<ApiResponse<Post>> {
    const response = await fetch(`${API_BASE}?id=${id}`);
    return handleResponse<Post>(response);
  },

  // Create new post
  async create(data: CreatePostData): Promise<ApiResponse<Post>> {
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("content", data.content);

    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    if (data.location) formData.append("location", data.location);
    if (data.startDate) formData.append("startDate", data.startDate);
    if (data.endDate) formData.append("endDate", data.endDate);

    const response = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    return handleResponse<Post>(response);
  },

  // Update existing post
  async update(data: UpdatePostData): Promise<ApiResponse<Post>> {
    const formData = new FormData();

    if (data.type) formData.append("type", data.type);
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    if (data.location !== undefined) formData.append("location", data.location);
    if (data.startDate) formData.append("startDate", data.startDate);
    if (data.endDate) formData.append("endDate", data.endDate);

    const response = await fetch(`${API_BASE}?id=${data.id}`, {
      method: "PATCH",
      body: formData,
    });

    return handleResponse<Post>(response);
  },

  // Delete post
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },
};
