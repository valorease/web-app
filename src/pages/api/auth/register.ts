import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { z } from "zod";

const RequestPostBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não autorizado" });
  }

  try {
    const { body } = request;

    const { success, data } = RequestPostBodySchema.safeParse(body);

    if (!success) {
      return response.status(400).json({ message: "Dados inválidos" });
    }

    const existingUser = await prisma.consumer.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return response.status(400).json({ message: "Email já está em uso" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await prisma.consumer.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        planId: 1,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  } catch (error) {
    return response.status(500).json({ message: "Erro ao criar conta" });
  }
}
