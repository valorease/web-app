import "next-auth";

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

declare module "next-auth/jwt" {
  interface JWT {
    id: string | number;
    publicId: string;
  }
}
