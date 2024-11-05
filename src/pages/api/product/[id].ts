import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "DELETE") {
    return response.status(405).json({ message: "Método não autorizado" });
  }

  const session = await getSession({ req: request });

  if (!session) {
    return response.status(401).json({ message: "Não autorizado" });
  }

  const { id } = request.query;

  if (!id || typeof id !== "string") {
    return response.status(400).json({ message: "ID inválido" });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        publicId: id,
        consumerId: session.consumer.id,
      },
    });

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return response
      .status(200)
      .json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao remover produto" });
  }
}
