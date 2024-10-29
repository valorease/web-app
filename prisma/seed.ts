import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();

    await prisma.plan.createMany({
      data: [
        {
          name: "Basic",
          description: "Para pequenos negócios",
          price: 39.98,
          productQuantityLimit: 30,
          viewHistoryLimitInMonths: 3,
          updateProductTimeWindowInDays: 7,
          reportType: 1,
        },
        {
          name: "Premium",
          description: "Para empresas de médio porte",
          price: 109.98,
          productQuantityLimit: 100,
          viewHistoryLimitInMonths: 12,
          updateProductTimeWindowInDays: 1,
          reportType: 2,
        },
        {
          name: "Business",
          description: "Para grandes empresas",
          price: 299.98,
          productQuantityLimit: 100_000,
          viewHistoryLimitInMonths: 48,
          updateProductTimeWindowInDays: 1,
          reportType: 3,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
})();
