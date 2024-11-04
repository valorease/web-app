import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();

    const plans = [
      {
        plan: {
          name: "Basic",
          description: "Para pequenos negócios",
          price: 39.98,
          productQuantityLimit: 30,
          viewHistoryLimitInMonths: 3,
          updateProductTimeWindowInDays: 7,
          reportType: 1,
        },
        benefits: [
          "Acesso ao banco de dados de preços",
          "Histórico de preços (3 meses)",
          "Monitoramento de até 30 produtos",
          "Atualizações semanais de preços",
          "Relatórios básicos",
          "Suporte via e-mail (resposta em até 48h)",
        ],
      },
      {
        plan: {
          name: "Premium",
          description: "Para empresas de médio porte",
          price: 109.98,
          productQuantityLimit: 100,
          viewHistoryLimitInMonths: 12,
          updateProductTimeWindowInDays: 1,
          reportType: 2,
        },
        benefits: [
          "Histórico de preços (12 meses)",
          "Monitoramento de até 100 produtos",
          "Atualizações diárias de preços",
          "Relatórios avançados",
          "Sugestões com IA",
          "Suporte prioritário (resposta em até 24h)",
        ],
      },
      {
        plan: {
          name: "Business",
          description: "Para grandes empresas",
          price: 299.98,
          productQuantityLimit: 100_000,
          viewHistoryLimitInMonths: 48,
          updateProductTimeWindowInDays: 1,
          reportType: 3,
        },
        benefits: [
          "Histórico de preços completo",
          "Monitoramento ilimitado",
          "Atualizações em tempo real",
          "Relatórios personalizados",
          "Recomendações de IA avançadas",
          "API de integração",
          "Suporte dedicado 24/7",
        ],
      },
    ];

    plans.forEach(async ({ plan, benefits }) => {
      const { id } = await prisma.plan.create({
        data: plan,
      });

      await prisma.planBenefits.createMany({
        data: benefits.map((benefit) => ({
          planId: id,
          name: benefit,
          description: benefit,
        })),
      });
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
})();
