import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { KategoriJurnal, JenisBuku } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// --- Session Verification ---
async function verifyDosenSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu",
        },
        { status: 401 }
      ),
    };
  }
  if (session.user.role !== "DOSEN") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Akses ditolak: Hanya dosen yang dapat mengakses endpoint ini",
        },
        { status: 403 }
      ),
    };
  }
  return { session };
}

// --- Schemas ---
const PublikasiInputSchema = z
  .object({
    judul: z.string().min(1),
    author: z.array(z.string()).min(1),
    namaJurnal: z.string().min(1),
    publisher: z.string().min(1),
    kategori: z.nativeEnum(KategoriJurnal),
    level: z.string().optional(),
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
    proposal: z.string().min(1),
    laporan: z.string().min(1),
    publikasi: z.array(PublikasiInputSchema).optional(),
    hki: z.array(HkiInputSchema).optional(),
    buku: z.array(BukuInputSchema).optional(),
  })
  .strict();

type PkmCreateBody = z.infer<typeof PkmCreateSchema>;

// --- Handler ---
export async function POST(req: Request) {
  try {
    const { error: sessionError, session } = await verifyDosenSession();
    if (sessionError) return sessionError;

    const json = await req.json();
    const body: PkmCreateBody = PkmCreateSchema.parse(json);

    const created = await prisma.pKM.create({
      data: {
        proposal: body.proposal,
        laporan: body.laporan,
        createdById: session!.user.id,
        ...(body.publikasi && {
          publikasi: {
            create: body.publikasi.map((pub) => ({
              ...pub,
              createdById: session!.user.id,
            })),
          },
        }),
        ...(body.hki && {
          hki: {
            create: body.hki.map((h) => ({
              ...h,
              createdById: session!.user.id,
            })),
          },
        }),
        ...(body.buku && {
          buku: {
            create: body.buku.map((b) => ({
              ...b,
              createdById: session!.user.id,
            })),
          },
        }),
      },
      include: { publikasi: true, hki: true, buku: true },
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

export async function GET() {
  try {
    const { error: sessionError, session } = await verifyDosenSession();
    if (sessionError) return sessionError;

    const pkms = await prisma.pKM.findMany({
      where: {
        createdById: session!.user.id, // Hanya ambil PKM yang dibuat oleh user yang login
      },
      include: {
        publikasi: true,
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
