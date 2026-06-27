import db from "@repo/db/client";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Phone number",
    credentials: {
      phone: {
        label: "Phone number",
        type: "text",
        placeholder: "9876543210",
      },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const phone = credentials?.phone?.trim();
      const password = credentials?.password;

      if (!phone || !password) {
        return null;
      }

      const existingUser = await db.user.findUnique({
        where: {
          phone,
        },
      });

      if (!existingUser?.password) {
        return null;
      }

      const passwordValidation = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!passwordValidation) {
        return null;
      }

      return {
        id: existingUser.id.toString(),
        name: existingUser.name,
        email: existingUser.email ?? existingUser.phone,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "secret",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
