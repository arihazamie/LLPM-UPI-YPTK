import { NextRequest, NextResponse } from "next/server";
import { prismaEdge } from "@/lib/prisma-edge";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { withRoleAuth } from "@/lib/auth-helpers";

function generateCustomId() {
  return "LPPM-" + randomUUID();
}

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return "Password harus berupa teks.";
  if (password.length < 8) return "Password minimal 8 karakter.";
  return null;
}

async function registerHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password } = body;

    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Nama wajib diisi." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password wajib diisi." },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }

    // Cek user sudah ada berdasarkan name
    const existingUser = await prismaEdge.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Nama sudah digunakan." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateCustomId();

    // Role default DOSEN
    const role = "DOSEN";

    const user = await prismaEdge.user.create({
      data: {
        id,
        name: name.trim(),
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { message: "User berhasil didaftarkan", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}

// Export the handler wrapped with ADMIN-only authorization
export const POST = withRoleAuth(["ADMIN"], registerHandler);
