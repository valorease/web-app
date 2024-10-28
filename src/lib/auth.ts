import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const consumer = await prisma.consumer.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!consumer) {
          throw new Error("Credenciais inválidas");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          consumer.password
        );

        if (!passwordMatch) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: consumer.publicId,
          email: consumer.email,
          name: consumer.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.consumer = {
          publicId: token.id as string,
          email: session.user?.email as string,
          name: session.user?.name as string,
        };
      }

      return session;
    },
  },
};
