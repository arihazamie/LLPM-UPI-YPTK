import { NextRequest, NextResponse } from "next/server";
import { prismaEdge } from "@/lib/prisma-edge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import * as bcrypt from "bcryptjs";

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return "Password harus berupa teks.";
  if (password.length < 8) return "Password minimal 8 karakter.";
  return null;
}

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID user diperlukan." },
        { status: 400 }
      );
    }

    const user = await prismaEdge.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        nohp: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}

// PUT - Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, nohp, password, role } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID user diperlukan." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prismaEdge.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json(
          { message: "Nama wajib diisi." },
          { status: 400 }
        );
      }
    }

    // Validate email format if provided
    if (email !== undefined) {
      if (email && typeof email === "string" && email.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { message: "Format email tidak valid." },
            { status: 400 }
          );
        }
      }
    }

    // Validate phone number format if provided
    if (nohp !== undefined) {
      if (nohp && typeof nohp === "string" && nohp.trim() !== "") {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!phoneRegex.test(nohp.trim())) {
          return NextResponse.json(
            { message: "Format nomor telepon tidak valid." },
            { status: 400 }
          );
        }
      }
    }

    // Validate password if provided
    if (password !== undefined) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return NextResponse.json({ message: passwordError }, { status: 400 });
      }
    }

    // Validate role if provided
    if (role !== undefined && role !== "DOSEN" && role !== "ADMIN") {
      return NextResponse.json(
        { message: "Role tidak valid." },
        { status: 400 }
      );
    }

    // Check for duplicate name
    if (name && name.trim() !== existingUser.name) {
      const existingUserByName = await prismaEdge.user.findUnique({
        where: { name: name.trim() },
      });

      if (existingUserByName) {
        return NextResponse.json(
          { message: "Nama sudah digunakan." },
          { status: 409 }
        );
      }
    }

    // Check for duplicate email
    if (email !== undefined && email?.trim() !== existingUser.email) {
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
    }

    // Check for duplicate phone number
    if (nohp !== undefined && nohp?.trim() !== existingUser.nohp) {
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
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (email !== undefined) {
      updateData.email = email?.trim() || null;
    }
    if (nohp !== undefined) {
      updateData.nohp = nohp?.trim() || null;
    }
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role !== undefined) {
      updateData.role = role;
    }

    const updatedUser = await prismaEdge.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        nohp: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "User berhasil diperbarui", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID user diperlukan." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prismaEdge.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (existingUser.id === session.user.id) {
      return NextResponse.json(
        { message: "Tidak dapat menghapus akun sendiri." },
        { status: 400 }
      );
    }

    // Delete the user
    await prismaEdge.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
} 