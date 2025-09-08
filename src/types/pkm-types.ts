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

// Enum untuk Penelitian
export enum StatusPenelitian {
  REVIEW = "REVIEW",
  ACC_PROPOSAL = "ACC_PROPOSAL",
  REVIEW_LAPORAN_KEMAJUAN_60 = "REVIEW_LAPORAN_KEMAJUAN_60",
  ACC_LAPORAN_KEMAJUAN_60 = "ACC_LAPORAN_KEMAJUAN_60",
  REVIEW_LAPORAN_KEMAJUAN_100 = "REVIEW_LAPORAN_KEMAJUAN_100",
  ACC_LAPORAN_KEMAJUAN_100 = "ACC_LAPORAN_KEMAJUAN_100",
  SELESAI = "SELESAI",
  DITOLAK = "DITOLAK",
}

export enum LuaranPenelitian {
  SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS = "SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS",
  ARTIKEL_JURNAL_NASIONAL_SINTA_5 = "ARTIKEL_JURNAL_NASIONAL_SINTA_5",
  ARTIKEL_JURNAL_NASIONAL_SINTA_4 = "ARTIKEL_JURNAL_NASIONAL_SINTA_4",
  ARTIKEL_JURNAL_NASIONAL_SINTA_3 = "ARTIKEL_JURNAL_NASIONAL_SINTA_3",
  ARTIKEL_JURNAL_NASIONAL_SINTA_2 = "ARTIKEL_JURNAL_NASIONAL_SINTA_2",
  PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS",
  HKI_PATEN = "HKI_PATEN",
  BUKU_ISBN = "BUKU_ISBN",
  PROTOTYPE = "PROTOTYPE",
}

export enum KategoriPenelitian {
  PENELITIAN_DOSEN_PEMULA = "PENELITIAN_DOSEN_PEMULA",
  PENELITIAN_TERAPAN = "PENELITIAN_TERAPAN",
  PENELITIAN_PENGEMBANGAN = "PENELITIAN_PENGEMBANGAN",
  PENELITIAN_UNGGULAN_PERGURUAN_TINGGI = "PENELITIAN_UNGGULAN_PERGURUAN_TINGGI",
  PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR = "PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR",
  PENELITIAN_BEKERJASAMA_MITRA_NASIONAL = "PENELITIAN_BEKERJASAMA_MITRA_NASIONAL",
  PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL = "PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL",
}

export enum RoleDosenPenelitian {
  KETUA = "KETUA",
  ANGGOTA = "ANGGOTA",
}

export enum ProgramStudiDosenPenelitian {
  D3_MANAJEMEN_INFORMATIKA = "D3_MANAJEMEN_INFORMATIKA",
  S1_SISTEM_INFORMASI = "S1_SISTEM_INFORMASI",
  S1_SISTEM_KOMPUTER = "S1_SISTEM_KOMPUTER",
  S1_TEKNIK_INFORMATIKA = "S1_TEKNIK_INFORMATIKA",
  S1_MANAJEMEN = "S1_MANAJEMEN",
  S1_AKUNTANSI = "S1_AKUNTANSI",
  S1_TEKNIK_SIPIL = "S1_TEKNIK_SIPIL",
  S1_TEKNIK_INDUSTRI = "S1_TEKNIK_INDUSTRI",
  S1_PSIKOLOGI = "S1_PSIKOLOGI",
  S1_DESAIN_KOMUNIKASI_VISUAL = "S1_DESAIN_KOMUNIKASI_VISUAL",
  S1_PTIK = "S1_PTIK",
  S1_BIMBINGAN_KONSELING = "S1_BIMBINGAN_KONSELING",
  S1_BAHASA_INGGRIS = "S1_BAHASA_INGGRIS",
  S2_TEKNIK_INFORMATIKA = "S2_TEKNIK_INFORMATIKA",
  S2_MANAJEMEN = "S2_MANAJEMEN",
  S3_TEKNOLOGI_INFORMASI = "S3_TEKNOLOGI_INFORMASI",
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

export interface Jurnal {
  id: string;
  author: string[];
  judul: string;
  namaJurnal: string;
  publisher: string;
  kategori: KategoriJurnal;
  level?: string;
  linkJurnal: string;
  tanggalPublisher: Date;
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

export interface Prototype {
  id: string;
  author: string[];
  namaPrototype: string;
  fungsiPrototype: string;
  penggunaUtama: string;
  jenisPrototype: string[];
  link: string;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PKM {
  id: string;
  judul: string;
  proposal: string;
  laporan: string;
  tanggalPelaksanaan: Date;
  jurnal?: Jurnal;
  hki?: HKI;
  buku?: Buku;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
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

export interface Penelitian {
  id: string;
  judulPenelitian: string;
  kategoriPenelitian: KategoriPenelitian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran?: number;
  sumberAnggaran?: string;
  luaran: LuaranPenelitian[];
  statusPenelitian: StatusPenelitian;

  // Review dan approval fields
  reviewedById?: string;
  reviewedBy?: User;
  reviewedAt?: Date;
  reviewNotes?: string;

  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  approvalNotes?: string;

  dosenPenelitian: DosenPenelitian[];
  linkProposal: string;
  linkLaporanKemajuan?: string;
  linkLaporanAkhir?: string;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface DosenPenelitian {
  id: string;
  dosenId: string;
  dosen: User;
  namaDosen: string;
  NIDN: string;
  roleDosenPenelitian: RoleDosenPenelitian;
  programStudiDosenPenelitian: ProgramStudiDosenPenelitian;
  penelitianId: string;
  penelitian: Penelitian;
  createdAt: Date;
  updatedAt: Date;
}

// Enum untuk Pengabdian
export enum StatusPengabdian {
  REVIEW = "REVIEW",
  ACC_PROPOSAL = "ACC_PROPOSAL",
  REVIEW_LAPORAN_KEMAJUAN_60 = "REVIEW_LAPORAN_KEMAJUAN_60",
  ACC_LAPORAN_KEMAJUAN_60 = "ACC_LAPORAN_KEMAJUAN_60",
  REVIEW_LAPORAN_KEMAJUAN_100 = "REVIEW_LAPORAN_KEMAJUAN_100",
  ACC_LAPORAN_KEMAJUAN_100 = "ACC_LAPORAN_KEMAJUAN_100",
  SELESAI = "SELESAI",
  DITOLAK = "DITOLAK",
}

export enum LuaranPengabdian {
  SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS = "SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS",
  ARTIKEL_JURNAL_NASIONAL_SINTA_5 = "ARTIKEL_JURNAL_NASIONAL_SINTA_5",
  ARTIKEL_JURNAL_NASIONAL_SINTA_4 = "ARTIKEL_JURNAL_NASIONAL_SINTA_4",
  ARTIKEL_JURNAL_NASIONAL_SINTA_3 = "ARTIKEL_JURNAL_NASIONAL_SINTA_3",
  ARTIKEL_JURNAL_NASIONAL_SINTA_2 = "ARTIKEL_JURNAL_NASIONAL_SINTA_2",
  PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS",
  PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS = "PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS",
  HKI_PATEN = "HKI_PATEN",
  BUKU_ISBN = "BUKU_ISBN",
  PROTOTYPE = "PROTOTYPE",
}

export enum KategoriPengabdian {
  PENGABDIAN_ILMU = "PENGABDIAN_ILMU",
  PENGABDIAN_MASYARAKAT = "PENGABDIAN_MASYARAKAT",
  PENGABDIAN_DOSEN_PEMULA = "PENGABDIAN_DOSEN_PEMULA",
  PENGABDIAN_TERAPAN = "PENGABDIAN_TERAPAN",
  PENGABDIAN_PENGEMBANGAN = "PENGABDIAN_PENGEMBANGAN",
  PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI = "PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI",
  PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR = "PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR",
  PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL = "PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL",
  PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL = "PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL",
}

export enum RoleDosenPengabdian {
  KETUA = "KETUA",
  ANGGOTA = "ANGGOTA",
}

export interface Pengabdian {
  id: string;
  judulPengabdian: string;
  kategoriPengabdian: KategoriPengabdian;
  lamaKegiatan: string;
  tahunKegiatan: number;
  anggaran?: number;
  sumberAnggaran?: string;
  luaran: LuaranPengabdian[];
  statusPengabdian: StatusPengabdian;

  // Review dan approval fields
  reviewedById?: string;
  reviewedBy?: User;
  reviewedAt?: Date;
  reviewNotes?: string;

  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  approvalNotes?: string;

  dosenPengabdian: DosenPengabdian[];
  linkProposal: string;
  linkLaporanKemajuan?: string;
  linkLaporanAkhir?: string;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface DosenPengabdian {
  id: string;
  dosenId: string;
  dosen: User;
  namaDosen: string;
  NIDN: string;
  roleDosenPengabdian: RoleDosenPengabdian;
  programStudiDosenPengabdian: ProgramStudiDosenPenelitian;
  pengabdianId: string;
  pengabdian: Pengabdian;
  createdAt: Date;
  updatedAt: Date;
}
