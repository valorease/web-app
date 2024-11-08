import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).end();
  }

  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Senha vazia" });
    }

    const user = await prisma.consumer.findFirst({
      where: {
        publicId: token.publicId,
      },
    });

    const valid = await bcrypt.compare(currentPassword, user?.password ?? "");

    if (!user || !valid) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    await prisma.consumer.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Erro ao atualizar senha" });
  }
}
