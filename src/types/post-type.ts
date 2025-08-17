export enum PostType {
  ARTIKEL = "ARTIKEL",
  AGENDA = "AGENDA",
  BERITA = "BERITA",
  PENGUMUMAN = "PENGUMUMAN",
  WEBINAR = "WEBINAR",
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  thumbnail?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  error?: string;
}
