import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "PIMPINAN" | "ADMIN" | "DOSEN";
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: "PIMPINAN" | "ADMIN" | "DOSEN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PIMPINAN" | "ADMIN" | "DOSEN";
  }
}
