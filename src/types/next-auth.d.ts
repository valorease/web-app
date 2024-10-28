import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    consumer: {
      id: number;
      publicId: string;
      email: string;
      name: string;
    };
  }
  interface User {
    id: number;
    publicId: string;
    email: string;
    name: string;
  }
}
