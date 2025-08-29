// PKM and related types based on Prisma schema
export enum KategoriJurnal {
  OJS = "OJS",
  SINTA = "SINTA",
  INTERNASIONAL = "INTERNASIONAL",
  WOS = "WOS",
  SCOPUS = "SCOPUS",
}

export enum JenisBuku {
  BUKU_AJAR = "BUKU_AJAR",
  REFERENSI = "REFERENSI",
}

export enum JenisPrototype {
  ALAT = "ALAT",
  APLIKASI = "APLIKASI",
  ALGORITMA = "ALGORITMA",
  MODUL = "MODUL",
  PSEUDOCODE = "PSEUDOCODE",
  METODE = "METODE",
}

export enum Role {
  PIMPINAN = "PIMPINAN",
  ADMIN = "ADMIN",
  DOSEN = "DOSEN",
}

export enum PostType {
  AGENDA = "AGENDA",
  ARTIKEL = "ARTIKEL",
  BERITA = "BERITA",
  PENGUMUMAN = "PENGUMUMAN",
  WEBINAR = "WEBINAR",
}

export interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  thumbnail?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publikasi {
  id: string;
  author: string[];
  judul: string;
  namaJurnal: string;
  publisher: string;
  kategori: KategoriJurnal;
  level?: string;
  pkmId?: string;
  pkm?: PKM;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface HKI {
  id: string;
  author: string[];
  nomorPenciptaan: string;
  tanggalPermohonan: Date;
  jenisCiptaan: string;
  judulCiptaan: string;
  linkSertifikat: string;
  pkmId?: string;
  pkm?: PKM;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Buku {
  id: string;
  author: string[];
  judulBuku: string;
  penerbit: string;
  isbn: string;
  tahun: number;
  jenisBuku: JenisBuku;
  linkBuku: string;
  pkmId?: string;
  pkm?: PKM;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PKM {
  id: string;
  proposal: string;
  laporan: string;
  publikasi?: Publikasi[]; // Array of publikasi instead of single
  hki?: HKI[]; // Array of HKI instead of single
  buku?: Buku[]; // Array of buku instead of single
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prototype {
  id: string;
  namaPrototype: string;
  fungsiPrototype: string;
  penggunaUtama: string;
  author: string[];
  jenisPrototype: string[];
  link: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Prestasi {
  id: string;
  namaPrestasi: string;
  jenisPretasi: string;
  peringkatJuara: string;
  tingkat: string;
  tanggal: Date;
  penyelenggara: string;
  linkSertifikat: string;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}
