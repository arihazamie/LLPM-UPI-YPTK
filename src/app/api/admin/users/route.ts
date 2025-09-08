// api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prismaEdge } from "@/lib/prisma-edge";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

function generateCustomId() {
  return "LPPM-" + randomUUID();
}

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return "Password harus berupa teks.";
  if (password.length < 8) return "Password minimal 8 karakter.";
  return null;
}

// GET - Fetch all users
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const users = await prismaEdge.user.findMany({
      where: {
        role: {
          in: ["DOSEN"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        nohp: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}

// POST - Create new DOSEN user
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, nohp, password, role = "DOSEN" } = body;

    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Nama wajib diisi." },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && typeof email === "string" && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { message: "Format email tidak valid." },
          { status: 400 }
        );
      }
    }

    // Validate phone number format if provided
    if (nohp && typeof nohp === "string" && nohp.trim() !== "") {
      const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
      if (!phoneRegex.test(nohp.trim())) {
        return NextResponse.json(
          { message: "Format nomor telepon tidak valid." },
          { status: 400 }
        );
      }
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

    // Validate role
    if (role !== "DOSEN" && role !== "ADMIN") {
      return NextResponse.json(
        { message: "Role tidak valid." },
        { status: 400 }
      );
    }

    // Check if user already exists by name
    const existingUserByName = await prismaEdge.user.findUnique({
      where: { name: name.trim() },
    });

    if (existingUserByName) {
      return NextResponse.json(
        { message: "Nama sudah digunakan." },
        { status: 409 }
      );
    }

    // Check if email already exists
    if (email && email.trim() !== "") {
      const existingUserByEmail = await prismaEdge.user.findUnique({
        where: { email: email.trim() },
      });

      if (existingUserByEmail) {
        return NextResponse.json(
          { message: "Email sudah digunakan." },
          { status: 409 }
        );
      }
    }

    // Check if phone number already exists
    if (nohp && nohp.trim() !== "") {
      const existingUserByPhone = await prismaEdge.user.findUnique({
        where: { nohp: nohp.trim() },
      });

      if (existingUserByPhone) {
        return NextResponse.json(
          { message: "Nomor telepon sudah digunakan." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateCustomId();

    const user = await prismaEdge.user.create({
      data: {
        id,
        name: name.trim(),
        email: email?.trim() || null,
        nohp: nohp?.trim() || null,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        nohp: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User berhasil dibuat", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}
