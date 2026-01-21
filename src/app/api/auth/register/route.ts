// src/app/api/auth/register

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-edge";

import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// Ensure Node.js runtime (not Edge runtime)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function generateCustomId() {
  return "LPPM-" + randomUUID();
}

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return "Password harus berupa teks.";
  if (password.length < 8) return "Password minimal 8 karakter.";
  return null;
}

export async function POST(request: NextRequest) {
  console.log("🔵 Register API endpoint hit!");

  try {
    console.log("📥 Parsing request body...");
    const body = await request.json();
    console.log("📥 Body received:", { name: body.name, password: "***" });
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
    console.log("🔍 Checking existing user...");
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });
    console.log("🔍 Existing user check done");

    if (existingUser) {
      return NextResponse.json(
        { message: "Nama sudah digunakan." },
        { status: 409 }
      );
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateCustomId();

    // Role default DOSEN
    const role = "DOSEN";

    console.log("💾 Creating user in database...");
    const user = await prisma.user.create({
      data: {
        id,
        name: name.trim(),
        password: hashedPassword,
        role,
      },
    });
    console.log("✅ User created successfully:", user.id);

    return NextResponse.json(
      { message: "User berhasil didaftarkan", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register API error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server, coba lagi nanti.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
