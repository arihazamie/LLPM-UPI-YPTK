import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

/**
 * GET /api/dosen/buku
 * Ambil semua data buku dari database
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const books = await prisma.book.findMany({
      where: {
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Data buku berhasil diambil",
      data: books,
    });
  } catch (error) {
    console.error("GET Book error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dosen/buku
 * Tambah buku baru ke database
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("coverBook") as File | null;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const isbn = formData.get("isbn") as string | null;
    const pages = formData.get("pages") as string | null;
    const size = formData.get("size") as string | null;
    const year = formData.get("year") as string | null;
    const shortDesc = formData.get("shortDesc") as string | null;
    const synopsis = formData.get("synopsis") as string | null;
    const price = formData.get("price") as string | null;

    if (!title || !author) {
      return NextResponse.json(
        { message: "Judul dan penulis wajib diisi" },
        { status: 400 }
      );
    }

    let coverBookUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "v0-books",
      });
      coverBookUrl = uploadResult.secure_url;
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        isbn: isbn || null,
        pages: pages ? parseInt(pages) : null,
        size: size || null,
        year: year ? parseInt(year) : null,
        shortDesc: shortDesc || null,
        synopsis: synopsis || null,
        price: price ? parseInt(price) : null,
        coverBook: coverBookUrl,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Buku berhasil ditambahkan",
        data: newBook,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Book error:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan buku" },
      { status: 500 }
    );
  }
}
