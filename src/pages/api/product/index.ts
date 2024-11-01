import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/product";
import { Target } from "@/types/target";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const RequestPostBodySchema = z.object({
  name: z.string(),
  target: z.string(),
  publicId: z.string(),
  description: z.string(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não autorizado" });
  }

  const { success, data } = RequestPostBodySchema.safeParse(request.body);

  if (!success) {
    return response.status(400).json({ message: "Dados incorretos" });
  }

  const consumer = await prisma.consumer.findFirst({
    where: {
      publicId: data.publicId,
    },
    include: {
      Product: true,
      plan: true,
    },
  });

  if (!consumer) {
    return response.status(400).json({ message: "Dados incorretos" });
  }

  if (consumer.Product.length >= consumer.plan.productQuantityLimit) {
    return response
      .status(400)
      .json({ message: "Limite de produtos atingido" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        target: data.target,
        slug: slugify(data.name, data.target as Target),
        description: data.description,
        consumerId: consumer.id,
      },
    });

    response.status(201).json(product);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Erro ao criar produto" });
  }
}
