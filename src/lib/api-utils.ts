export interface Post {
  id: string
  title: string
  content: string
  type: "ARTIKEL" | "BERITA" | "PENGUMUMAN" | "AGENDA" | "WEBINAR"
  thumbnail?: string | null
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string | null
    email: string
  }
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    take: number
    skip: number
  }
}

export interface ApiError {
  message: string
}

// Fetch all posts or filter by type
export async function fetchPosts(params?: {
  type?: string
  take?: number
  skip?: number
}): Promise<ApiResponse<Post[]>> {
  const searchParams = new URLSearchParams()

  if (params?.type) searchParams.set("type", params.type)
  if (params?.take) searchParams.set("take", params.take.toString())
  if (params?.skip) searchParams.set("skip", params.skip.toString())

  const response = await fetch(`/api/posts?${searchParams.toString()}`)

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || "Failed to fetch posts")
  }

  return response.json()
}

// Fetch single post by ID
export async function fetchPost(id: string): Promise<ApiResponse<Post>> {
  const response = await fetch(`/api/posts?id=${id}`)

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || "Failed to fetch post")
  }

  return response.json()
}

// Create new post
export async function createPost(formData: FormData): Promise<ApiResponse<Post>> {
  const response = await fetch("/api/posts", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || "Failed to create post")
  }

  return response.json()
}

// Update existing post
export async function updatePost(id: string, formData: FormData): Promise<ApiResponse<Post>> {
  const response = await fetch(`/api/posts?id=${id}`, {
    method: "PATCH",
    body: formData,
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || "Failed to update post")
  }

  return response.json()
}

// Delete post
export async function deletePost(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/posts?id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || "Failed to delete post")
  }

  return response.json()
}

