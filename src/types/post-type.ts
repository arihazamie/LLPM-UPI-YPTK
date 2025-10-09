export enum PostType {
  ARTIKEL = "ARTIKEL",
  BERITA = "BERITA",
  PENGUMUMAN = "PENGUMUMAN",
  AGENDA = "AGENDA",
  WEBINAR = "WEBINAR",
}

export enum KategoriArtikel {
  OJS = "OJS",
  SINTA = "SINTA",
  INTERNASIONAL = "INTERNASIONAL",
  WOS = "WOS",
  SCOPUS = "SCOPUS",
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

export interface Artikel {
  id: string;
  judul: string;
  penulis: string[];
  kategori: KategoriArtikel;
  abstrak: string;
  konten: string;
  tanggalPublikasi: Date;
  linkPublikasi?: string;
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface CreateArtikelData {
  judul: string;
  penulis: string[];
  kategori: KategoriArtikel;
  abstrak: string;
  konten: string;
  tanggalPublikasi: string;
  linkPublikasi?: string;
  thumbnail?: File | null;
}

export interface UpdateArtikelData extends Partial<CreateArtikelData> {
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
