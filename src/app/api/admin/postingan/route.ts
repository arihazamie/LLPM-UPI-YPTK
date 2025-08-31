// src/app/api/admin/postingan/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prismaEdge as prisma } from "@/lib/prisma-edge";
import { PostType } from "@prisma/client";
import { withRoleAuth } from "@/lib/auth-helpers";

cloudinary.config();

/**
 * GET: Ambil semua postingan (opsional filter type)
 */
export const GET = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const idParam = searchParams.get("id");
    const typeParam = searchParams.get("type");
    const take = Math.max(
      1,
      Math.min(50, Number(searchParams.get("take") ?? 10))
    );
    const skip = Math.max(0, Number(searchParams.get("skip") ?? 0));

    // Jika ada ID → ambil single post
    if (idParam) {
      const post = await prisma.post.findUnique({
        where: { id: idParam },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      });
      if (!post) {
        return NextResponse.json(
          { message: "Postingan tidak ditemukan." },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: post }, { status: 200 });
    }

    // Ambil list post
    const where =
      typeParam && Object.values(PostType).includes(typeParam as PostType)
        ? { type: typeParam as PostType }
        : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json(
      { data: posts, meta: { total, take, skip } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error GET posts:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data postingan." },
      { status: 500 }
    );
  }
});

/**
 * POST: Buat postingan baru
 */
export const POST = withRoleAuth(["ADMIN", "PIMPINAN"], async (req, user) => {
  try {
    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const location = formData.get("location") as string | null;
    const startDate = formData.get("startDate") as string | null;
    const endDate = formData.get("endDate") as string | null;

    if (!type || !title || !content) {
      return NextResponse.json(
        { message: "Harap isi semua field yang wajib diisi." },
        { status: 400 }
      );
    }

    if (!Object.values(PostType).includes(type as PostType)) {
      return NextResponse.json(
        { message: "Jenis konten tidak valid." },
        { status: 400 }
      );
    }

    let thumbnailUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "v0-posts",
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const newPost = await prisma.post.create({
      data: {
        type: type as PostType,
        title,
        content,
        thumbnail: thumbnailUrl,
        location,
        startDate:
          startDate && !isNaN(Date.parse(startDate))
            ? new Date(startDate)
            : undefined,
        endDate:
          endDate && !isNaN(Date.parse(endDate))
            ? new Date(endDate)
            : undefined,
        authorId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Postingan berhasil dibuat.", data: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error POST post:", error);
    return NextResponse.json(
      { message: "Gagal membuat postingan." },
      { status: 500 }
    );
  }
});

/**
 * PATCH: Update postingan
 */
export const PATCH = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;
    const type = formData.get("type") as string | null;
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const location = formData.get("location") as string | null;
    const startDate = formData.get("startDate") as string | null;
    const endDate = formData.get("endDate") as string | null;

    let thumbnailUrl: string | undefined;
    if (file) {
      const oldPost = await prisma.post.findUnique({
        where: { id },
        select: { thumbnail: true },
      });
      if (oldPost?.thumbnail) {
        const publicId = oldPost.thumbnail
          .split("/")
          .slice(-1)[0]
          .split(".")[0];
        await cloudinary.uploader.destroy(`v0-posts/${publicId}`);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "v0-posts",
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(type &&
          Object.values(PostType).includes(type as PostType) && {
            type: type as PostType,
          }),
        ...(title && { title }),
        ...(content && { content }),
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        ...(location !== null ? { location } : {}),
        startDate:
          startDate && !isNaN(Date.parse(startDate))
            ? new Date(startDate)
            : undefined,
        endDate:
          endDate && !isNaN(Date.parse(endDate))
            ? new Date(endDate)
            : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      message: "Postingan berhasil diperbarui.",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error PATCH post:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui postingan." },
      { status: 500 }
    );
  }
});

/**
 * DELETE: Hapus postingan
 */
export const DELETE = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json(
        { message: "Postingan tidak ditemukan." },
        { status: 404 }
      );

    if (post.thumbnail) {
      const publicId = post.thumbnail.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`v0-posts/${publicId}`);
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Postingan berhasil dihapus." });
  } catch (error) {
    console.error("Error DELETE post:", error);
    return NextResponse.json(
      { message: "Gagal menghapus postingan." },
      { status: 500 }
    );
  }
});
