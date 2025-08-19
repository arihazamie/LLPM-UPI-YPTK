export enum PostType {
  ARTIKEL = "ARTIKEL",
  BERITA = "BERITA",
  PENGUMUMAN = "PENGUMUMAN",
  AGENDA = "AGENDA",
  WEBINAR = "WEBINAR",
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  thumbnail?: string | null;
  location?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  meta?: {
    total: number;
    take: number;
    skip: number;
  };
}

export interface CreatePostData {
  type: PostType;
  title: string;
  content: string;
  thumbnail?: File | null;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
