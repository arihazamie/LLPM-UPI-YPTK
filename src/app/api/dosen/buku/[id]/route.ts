import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

/**
 * @handler GET /api/dosen/buku/[id]
 * @description Ambil buku berdasarkan ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const book = await prisma.book.findFirst({
      where: {
        id: id,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: `Buku dengan ID ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Buku berhasil ditemukan",
      data: book,
    });
  } catch (error) {
    console.error("GET Book error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil buku" },
      { status: 500 }
    );
  }
}

/**
 * @handler PUT /api/dosen/buku/[id]
 * @description Update buku berdasarkan ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("coverBook") as File | null;
    const title = formData.get("title") as string | null;
    const author = formData.get("author") as string | null;
    const isbn = formData.get("isbn") as string | null;
    const pages = formData.get("pages") as string | null;
    const size = formData.get("size") as string | null;
    const year = formData.get("year") as string | null;
    const shortDesc = formData.get("shortDesc") as string | null;
    const synopsis = formData.get("synopsis") as string | null;
    const price = formData.get("price") as string | null;

    // Pastikan buku ada dan milik user yang login
    const existing = await prisma.book.findFirst({
      where: {
        id: id,
        createdById: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: `Buku dengan ID ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    let coverBookUrl: string | undefined;
    if (file) {
      // Hapus gambar lama jika ada
      if (existing.coverBook) {
        try {
          const publicId = existing.coverBook
            .split("/")
            .slice(-1)[0]
            .split(".")[0];
          await cloudinary.uploader.destroy(`v0-books/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload gambar baru
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "v0-books",
      });
      coverBookUrl = uploadResult.secure_url;
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        author: author ?? existing.author,
        isbn: isbn !== null ? isbn : existing.isbn,
        pages: pages ? parseInt(pages) : existing.pages,
        size: size !== null ? size : existing.size,
        year: year ? parseInt(year) : existing.year,
        shortDesc: shortDesc !== null ? shortDesc : existing.shortDesc,
        synopsis: synopsis !== null ? synopsis : existing.synopsis,
        price: price ? parseInt(price) : existing.price,
        coverBook:
          coverBookUrl !== undefined ? coverBookUrl : existing.coverBook,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Buku berhasil diperbarui",
      data: updatedBook,
    });
  } catch (error) {
    console.error("PUT Book error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui buku" },
      { status: 500 }
    );
  }
}

/**
 * @handler DELETE /api/dosen/buku/[id]
 * @description Hapus buku berdasarkan ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.book.findFirst({
      where: {
        id: id,
        createdById: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: `Buku dengan ID ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Book error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus buku" },
      { status: 500 }
    );
  }
}
