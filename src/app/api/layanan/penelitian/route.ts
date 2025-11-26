import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { KategoriArtikel, JenisBuku } from "@prisma/client";
import {
  generatePId,
  generateArtikelIds,
  generateHkiIds,
  generateBukuIds,
} from "@/lib/utils";
import { withRoleAuth } from "@/lib/auth-helpers";

// ---------- Schemas ----------
const ArtikelInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    judul: z.string(),
    namaArtikel: z.string(),
    publisher: z.string(),
    kategori: z.nativeEnum(KategoriArtikel),
    level: z.string().optional(),
    linkArtikel: z.string(),
    tanggalPublisher: z.coerce.date().optional(),
  })
  .strict();

const HkiInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    nomorPenciptaan: z.string(),
    tanggalPermohonan: z.coerce.date(),
    jenisCiptaan: z.string(),
    judulCiptaan: z.string(),
    linkSertifikat: z.string(),
  })
  .strict();

const BukuInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    judulBuku: z.string(),
    penerbit: z.string(),
    isbn: z.string(),
    tahun: z.number().int(),
    jenisBuku: z.nativeEnum(JenisBuku),
    linkBuku: z.string(),
  })
  .strict();

const LayananSchema = z
  .object({
    judul: z.string(),
    proposal: z.string(),
    laporan: z.string(),
    tanggalPelaksanaan: z.coerce.date().optional(),
    artikel: z.array(ArtikelInputSchema).optional(),
    hki: z.array(HkiInputSchema).optional(),
    buku: z.array(BukuInputSchema).optional(),
  })
  .strict();

// ---------- CREATE ----------
export const POST = withRoleAuth(
  ["DOSEN", "ADMIN", "PIMPINAN"],
  async (req, user) => {
    try {
      const json = await req.json();
      const body = LayananSchema.parse(json);

      const layananId = await generatePId(prisma);

      // -------- Artikel --------
      const artikelCreate =
        body.artikel && body.artikel.length > 0
          ? (async () => {
              const ids = await generateArtikelIds(
                prisma,
                body.artikel!.length
              );
              return {
                create: body.artikel!.map((a, idx) => ({
                  id: ids[idx],
                  ...a,
                  createdById: user.id,
                })),
              };
            })()
          : undefined;

      // -------- HKI --------
      const hkiCreate =
        body.hki && body.hki.length > 0
          ? (async () => {
              const ids = await generateHkiIds(prisma, body.hki!.length);
              return {
                create: body.hki!.map((h, idx) => ({
                  id: ids[idx],
                  ...h,
                  createdById: user.id,
                })),
              };
            })()
          : undefined;

      // -------- Buku --------
      const bukuCreate =
        body.buku && body.buku.length > 0
          ? (async () => {
              const ids = await generateBukuIds(prisma, body.buku!.length);
              return {
                create: body.buku!.map((b, idx) => ({
                  id: ids[idx],
                  ...b,
                  createdById: user.id,
                })),
              };
            })()
          : undefined;

      // ---------- CREATE ----------
      const created = await prisma.layananPenelitian.create({
        data: {
          id: layananId,
          judul: body.judul,
          proposal: body.proposal,
          laporan: body.laporan,
          tanggalPelaksanaan: body.tanggalPelaksanaan,
          createdById: user.id,

          ...(artikelCreate && { artikel: await artikelCreate }),
          ...(hkiCreate && { hki: await hkiCreate }),
          ...(bukuCreate && { buku: await bukuCreate }),
        },
        include: {
          artikel: true,
          hki: true,
          buku: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Layanan Penelitian berhasil dibuat",
        data: created,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validasi gagal",
            errors: err.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      console.error("Error create layanan:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Server error saat membuat layanan penelitian",
        },
        { status: 500 }
      );
    }
  }
);

// ---------- GET DATA ----------
export const GET = withRoleAuth(
  ["DOSEN", "ADMIN", "PIMPINAN"],
  async (req, user) => {
    try {
      const data = await prisma.layananPenelitian.findMany({
        where: { createdById: user.id },
        include: {
          artikel: true,
          hki: true,
          buku: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        message: "Data berhasil diambil",
        data,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data layanan penelitian",
          error,
        },
        { status: 500 }
      );
    }
  }
);
