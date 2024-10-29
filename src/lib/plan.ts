import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

export default {
  byConsumer: async (consumerPublicId: string): Promise<Plan> => {
    const data = await prisma.consumer.findFirst({
      where: {
        publicId: consumerPublicId,
      },
      select: {
        plan: true,
      },
    });

    return data!.plan;
  },
};
