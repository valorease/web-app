import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

import { z } from "zod";

type Product = {
  publicId: string;
  target: string;
  slug: string;
  average: number;
};

type ResponseData = Product | { message: string };

const RequestPutBodySchema = z.object({
  publicId: z.string(),
  target: z.string(),
  url: z.string().url(),
  prices: z.number().positive().array(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  try {
    switch (request.method) {
      case "GET":
        return handleGet(response);

      case "PUT":
        return handlePut(request, response);

      default:
        return response.status(405).json({ message: "Método não autorizado" });
    }
  } catch (error) {
    return response.status(500).json({ message: "Erro interno" });
  }
}

async function handleGet(response: NextApiResponse<ResponseData>) {
  const product = await prisma.product.findFirst({
    orderBy: {
      lastSearch: "desc",
    },
  });

  if (!product) {
    return response.status(204).end();
  }

  return response.status(200).json({
    publicId: product.publicId,
    average: product.average,
    target: product.target,
    slug: product.slug,
  });
}

async function handlePut(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  const { success, data } = RequestPutBodySchema.safeParse(request.body);

  if (!success) {
    return response.status(400).json({ message: "Dados inválidos" });
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { publicId: data.publicId },
      });

      if (!product) {
        return response.status(404).json({ message: "Produto não encontrado" });
      }

      await tx.productHistory.createMany({
        data: data.prices.map((price) => ({
          productId: product.id,
          url: data.url,
          price,
        })),
      });

      const average = calculateAverage(data.prices);

      await tx.product.update({
        where: { id: product.id },
        data: {
          lastSearch: new Date(),
          average,
        },
      });

      return response.status(200).json({
        publicId: product.publicId,
        target: product.target,
        slug: product.slug,
        average,
      });
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Erro ao atualizar o produto" });
  }
}

function calculateAverage(prices: number[]): number {
  return prices.length > 0
    ? prices.reduce((sum, price) => sum + price, 0) / prices.length
    : 0;
}
