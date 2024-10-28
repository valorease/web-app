import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    consumer: {
      publicId: string;
      email: string;
      name: string;
    };
  }
}
