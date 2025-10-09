

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { KategoriArtikel, JenisBuku } from "@prisma/client";
import {
  generatePkmId,
  generateArtikelIds,
  generateHkiIds,
  generateBukuIds,
} from "@/lib/utils";
import { withRoleAuth } from "@/lib/auth-helpers";

// --- Schemas ---
const ArtikelInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    judul: z.string().min(1),
    namaArtikel: z.string().min(1),
    publisher: z.string().min(1),
    kategori: z.nativeEnum(KategoriArtikel),
    level: z.string().optional(),
    linkArtikel: z.string().min(1),
    tanggalPublisher: z.coerce.date().optional(),
  })
  .strict();

const HkiInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    nomorPenciptaan: z.string().min(1),
    tanggalPermohonan: z.coerce.date(),
    jenisCiptaan: z.string().min(1),
    judulCiptaan: z.string().min(1),
    linkSertifikat: z.string().min(1),
  })
  .strict();

const BukuInputSchema = z
  .object({
    author: z.array(z.string()).min(1),
    judulBuku: z.string().min(1),
    penerbit: z.string().min(1),
    isbn: z.string().min(1),
    tahun: z.number().int(),
    jenisBuku: z.nativeEnum(JenisBuku),
    linkBuku: z.string().min(1),
  })
  .strict();

const PkmCreateSchema = z
  .object({
    judul: z.string().min(1),
    proposal: z.string().min(1),
    laporan: z.string().min(1),
    tanggalPelaksanaan: z.coerce.date().optional(),
    artikel: z.array(ArtikelInputSchema).optional(),
    hki: z.array(HkiInputSchema).optional(),
    buku: z.array(BukuInputSchema).optional(),
  })
  .strict();

type PkmCreateBody = z.infer<typeof PkmCreateSchema>;

// --- Handler ---
export const POST = withRoleAuth(
  ["DOSEN", "ADMIN", "PIMPINAN"],
  async (req, user) => {
    try {
      const json = await req.json();
      console.log("Received JSON data:", JSON.stringify(json, null, 2));

      const body: PkmCreateBody = PkmCreateSchema.parse(json);
      console.log("Parsed body:", JSON.stringify(body, null, 2));

      // Generate custom IDs
      const pkmId = await generatePkmId(prisma);

      // Siapkan payload nested create untuk banyak item
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

      const created = await prisma.pKM.create({
        data: {
          id: pkmId,
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
        message: "PKM berhasil dibuat",
        data: created,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validasi data gagal",
            errors: err.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }
      console.error("Error create PKM:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan pada server saat membuat PKM",
        },
        { status: 500 }
      );
    }
  }
);

export const GET = withRoleAuth(
  ["DOSEN", "ADMIN", "PIMPINAN"],
  async (req, user) => {
    try {
      const pkms = await prisma.pKM.findMany({
        where: {
          createdById: user.id, // Hanya ambil PKM yang dibuat oleh user yang login
        },
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
        message: "Data PKM berhasil diambil",
        data: pkms,
      });
    } catch (error) {
      console.error("Error fetching PKMs:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data PKM",
        },
        { status: 500 }
      );
    }
  }
);
