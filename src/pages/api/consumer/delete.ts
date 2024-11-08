import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).end();
  }

  try {
    await prisma.consumer.delete({
      where: {
        publicId: token.publicId,
      },
    });

    res.status(200).json({ message: "Conta excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir conta" });
  }
}
