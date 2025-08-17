// src/app/api/postingan/route.ts
import { NextResponse } from "next/server";
import { prismaEdge } from "@/lib/prisma-edge";
import { PostType } from "@/types/post-type";

const prisma = prismaEdge;

/**
 * GET: Ambil semua postingan (opsional filter type)
 */
export async function GET(req: Request) {
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
}
