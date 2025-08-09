import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaEdge } from "@/lib/prisma-edge";

type Role = "PIMPINAN" | "ADMIN" | "DOSEN";
const prisma = prismaEdge;

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 },
  jwt: { maxAge: 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Nama", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials.password) return null;

        const start = Date.now();
        const user = await prisma.user.findUnique({
          where: { name: credentials.name },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });
        console.log("Login DB duration:", Date.now() - start, "ms");

        if (!user || credentials.password !== user.password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
