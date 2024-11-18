import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export type ProductMetric = {
  publicId: string;
  priceIncrease: number;
  priceVariation: number;
  maxPrice: number;
  minPrice: number;
};

type ResponseData = ProductMetric[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === "GET") {
      return await handleGet(res);
    } else {
      return res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
}

async function handleGet(res: NextApiResponse<ResponseData>) {
  const products = await prisma.product.findMany({
    include: {
      ProductHistory: true, 
    },
  });

  if (!products || products.length === 0) {
    return res.status(404).json({ message: "Nenhum produto encontrado" });
  }

  const metrics: ProductMetric[] = products.map((product) => {
    const history = product.ProductHistory;

    if (history.length === 0) {
      return null; 
    }

    const priceStart = history[0].price;
    const priceEnd = history[history.length - 1].price;
    const maxPrice = Math.max(...history.map((entry) => entry.price));
    const minPrice = Math.min(...history.map((entry) => entry.price));

    const priceIncrease = priceEnd - priceStart;
    const priceVariation = ((maxPrice - minPrice) / minPrice) * 100;

    return {
      publicId: product.publicId,
      priceIncrease,
      priceVariation,
      maxPrice,
      minPrice,
    };
  }).filter((metric) => metric !== null);

  if (metrics.length === 0) {
    return res.status(404).json({ message: "Sem métricas para os produtos" });
  }

  return res.status(200).json(metrics);
}
