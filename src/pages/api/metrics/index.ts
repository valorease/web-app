import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

type ProductMetric = {
  name: string;
  media: number;
  priceIncrease: number;
  maxPrice: number;
  minPrice: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const session = await getSession({ req });

    if (!session || !session.consumer) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const metrics = await prisma.product.findMany({
      where: {
        consumerId: session.consumer.id,
      },
      include: {
        ProductHistory: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const productMetrics: ProductMetric[] = metrics.map((product) => {
      const history = product.ProductHistory;

      if (history.length === 0) {
        return null;
      }

      const maxPrice = Math.max(...history.map((entry) => entry.price));
      const minPrice = Math.min(...history.map((entry) => entry.price));
      const media = product.average || 0;
      const priceIncrease = maxPrice - minPrice;

      return {
        name: product.name,
        media,
        priceIncrease,
        maxPrice,
        minPrice,
      };
    }).filter((metric) => metric !== null) as ProductMetric[];

    res.status(200).json(productMetrics);
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}