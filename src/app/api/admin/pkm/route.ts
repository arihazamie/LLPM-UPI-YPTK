import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-edge";
import { z } from "zod";
import { KategoriArtikel, JenisBuku } from "@prisma/client";
import {
  generatePkmId,
  generateHkiId,
  generateBukuId,
  generateArtikelId,
} from "@/lib/utils";
import { withRoleAuth } from "@/lib/auth-helpers";

// --- Schemas ---
const ArtikelInputSchema = z
  .object({
    judul: z.string().min(1),
    author: z.array(z.string()).min(1),
    namaArtikel: z.string().min(1),
    publisher: z.string().min(1),
    kategori: z.nativeEnum(KategoriArtikel),
    level: z.string().optional(),
    linkArtikel: z.string().min(1),
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
    artikel: ArtikelInputSchema.optional(),
    hki: HkiInputSchema.optional(),
    buku: BukuInputSchema.optional(),
  })
  .strict();

const PkmUpdateSchema = z
  .object({
    judul: z.string().min(1).optional(),
    proposal: z.string().min(1).optional(),
    laporan: z.string().min(1).optional(),
    artikel: ArtikelInputSchema.optional(),
    hki: HkiInputSchema.optional(),
    buku: BukuInputSchema.optional(),
  })
  .strict();

type PkmCreateBody = z.infer<typeof PkmCreateSchema>;
type PkmUpdateBody = z.infer<typeof PkmUpdateSchema>;

// --- CREATE PKM ---
export const POST = withRoleAuth(["ADMIN", "PIMPINAN"], async (req, user) => {
  try {
    const json = await req.json();
    const body: PkmCreateBody = PkmCreateSchema.parse(json);

    // Generate custom IDs
    const pkmId = await generatePkmId(prisma);

    // Generate IDs for related records if they exist
    const artikelId = body.artikel
      ? await generateArtikelId(prisma)
      : undefined;
    const hkiId = body.hki ? await generateHkiId(prisma) : undefined;
    const bukuId = body.buku ? await generateBukuId(prisma) : undefined;

    const created = await prisma.pKM.create({
      data: {
        id: pkmId,
        judul: body.judul,
        proposal: body.proposal,
        laporan: body.laporan,
        createdById: user.id,
        ...(body.artikel && {
          artikel: {
            create: {
              id: artikelId!,
              ...body.artikel,
              createdById: user.id,
              linkArtikel: body.artikel.linkArtikel,
            },
          },
        }),
        ...(body.hki && {
          hki: {
            create: {
              id: hkiId!,
              ...body.hki,
              createdById: user.id,
            },
          },
        }),
        ...(body.buku && {
          buku: {
            create: {
              id: bukuId!,
              ...body.buku,
              createdById: user.id,
            },
          },
        }),
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
});

// --- READ ALL PKM ---
export const GET = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const createdById = searchParams.get("createdById") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        judul?: { contains: string; mode: "insensitive" };
        proposal?: { contains: string; mode: "insensitive" };
        laporan?: { contains: string; mode: "insensitive" };
        createdBy?: { name: { contains: string; mode: "insensitive" } };
      }>;
      createdById?: string;
    } = {};

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { proposal: { contains: search, mode: "insensitive" } },
        { laporan: { contains: search, mode: "insensitive" } },
        { createdBy: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (createdById) {
      where.createdById = createdById;
    }

    // Get total count
    const total = await prisma.pKM.count({ where });

    // Get PKM data with pagination
    const pkms = await prisma.pKM.findMany({
      where,
      include: {
        artikel: true,
        hki: true,
        buku: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Data PKM berhasil diambil",
      data: {
        pkms,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
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
});

// --- UPDATE PKM ---
export const PUT = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID PKM diperlukan",
        },
        { status: 400 }
      );
    }

    const json = await req.json();
    console.log("Received PKM update data:", json); // Debug log
    const body: PkmUpdateBody = PkmUpdateSchema.parse(json);

    // Check if PKM exists
    const existingPkm = await prisma.pKM.findUnique({
      where: { id },
      include: { artikel: true, hki: true, buku: true },
    });

    if (!existingPkm) {
      return NextResponse.json(
        {
          success: false,
          message: "PKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Start transaction for update PKM and relations
    const updatedPkm = await prisma.$transaction(async (tx) => {
      // Update main PKM
      const pkm = await tx.pKM.update({
        where: { id },
        data: {
          ...(body.judul && { judul: body.judul }),
          ...(body.proposal && { proposal: body.proposal }),
          ...(body.laporan && { laporan: body.laporan }),
          updatedAt: new Date(),
        },
        include: {
          artikel: true,
          hki: true,
          buku: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Handle jurnal update
      if (body.artikel !== undefined) {
        // Delete existing jurnal if any
        if (existingPkm.artikel) {
          await tx.artikel.delete({
            where: { id: existingPkm.artikel[0].id },
          });
        }

        // Create new jurnal if provided
        if (body.artikel) {
          const artikelId = await generateArtikelId(tx);
          await tx.artikel.create({
            data: {
              id: artikelId,
              ...body.artikel,
              pkmId: id,
              createdById: pkm.createdById,
              linkArtikel: body.artikel.linkArtikel,
            },
          });
        }
      }

      // Handle HKI update
      if (body.hki !== undefined) {
        // Delete existing HKI if any
        if (existingPkm.hki) {
          await tx.hKI.delete({
            where: { id: existingPkm.hki[0].id },
          });
        }

        // Create new HKI if provided
        if (body.hki) {
          const hkiId = await generateHkiId(tx);
          await tx.hKI.create({
            data: {
              id: hkiId,
              ...body.hki,
              pkmId: id,
              createdById: pkm.createdById,
            },
          });
        }
      }

      // Handle buku update
      if (body.buku !== undefined) {
        // Delete existing buku if any
        if (existingPkm.buku) {
          await tx.buku.delete({
            where: { id: existingPkm.buku[0].id },
          });
        }

        // Create new buku if provided
        if (body.buku) {
          const bukuId = await generateBukuId(tx);
          await tx.buku.create({
            data: {
              id: bukuId,
              ...body.buku,
              pkmId: id,
              createdById: pkm.createdById,
            },
          });
        }
      }

      // Return updated PKM with all relations
      return await tx.pKM.findUnique({
        where: { id },
        include: {
          artikel: true,
          hki: true,
          buku: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    console.log("Updated PKM result:", updatedPkm); // Debug log

    return NextResponse.json({
      success: true,
      message: "PKM berhasil diperbarui",
      data: updatedPkm,
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
    console.error("Error update PKM:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat memperbarui PKM",
      },
      { status: 500 }
    );
  }
});

// --- DELETE PKM ---
export const DELETE = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID PKM diperlukan",
        },
        { status: 400 }
      );
    }

    // Check if PKM exists
    const existingPkm = await prisma.pKM.findUnique({
      where: { id },
      include: { artikel: true, hki: true, buku: true },
    });

    if (!existingPkm) {
      return NextResponse.json(
        {
          success: false,
          message: "PKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Delete PKM and all related data
    await prisma.pKM.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "PKM berhasil dihapus",
    });
  } catch (error) {
    console.error("Error delete PKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat menghapus PKM",
      },
      { status: 500 }
    );
  }
});
