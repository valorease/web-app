import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { Consumer } from "@prisma/client";
import { HeartFilledIcon } from "@radix-ui/react-icons";

import {
  AlertCircleIcon,
  ChartNoAxesColumnIncreasingIcon,
  CheckIcon,
  CreditCardIcon,
  Edit3Icon,
  HandIcon,
  TornadoIcon,
  UserCircle2Icon,
} from "lucide-react";

import { InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps = async () => {
  const session = await getSession();

  const consumer = await prisma.consumer.findFirst({
    where: {
      publicId: session?.consumer.publicId,
    },
  });

  const plans = await prisma.plan.findMany({
    include: {
      PlanBenefits: true,
    },
  });

  return {
    props: {
      consumer: JSON.parse(JSON.stringify(consumer)) as Consumer,
      plans: plans,
    },
  };
};

export default function Page({
  consumer,
  plans,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <RootLayout breadcrumb={["Minha conta"]} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2Icon />
            Olá, {consumer.name.split(" ").slice(0, 2).join(" ")}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap">
          <div className="flex flex-col sm:flex-row w-fit items-center justify-center gap-2">
            <Label className="text-nowrap">E-mail cadastrado:</Label>
            <Input type="email" readOnly value={consumer.email} />
          </div>

          <Button variant="secondary">
            <Edit3Icon />
            Alterar minha senha
          </Button>

          <Button variant="destructive" className="ms-auto">
            <AlertCircleIcon />
            Excluir minha conta
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartNoAxesColumnIncreasingIcon />
            Planos
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-6 flex-wrap justify-center w-full">
          {plans.map((plan) => (
            <Card
              className={`flex-1 flex flex-col justify-between pb-4 w-full ${
                consumer.planId == plan.id ? "bg-[hsl(var(--accent))]" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-center p-2 mb-6 text-xl font-bold">
                  R$ {plan.price} / mês
                </p>

                <ul>
                  {plan.PlanBenefits.map((benefit) => (
                    <li className="flex gap-2 items-center">
                      <CheckIcon className="h-4 w-4" />
                      <p>{benefit.name}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex items-center justify-center h-12">
                {consumer.planId == plan.id ? (
                  <p className="flex items-center gap-2">
                    <HeartFilledIcon />
                    Seu plano atual
                  </p>
                ) : (
                  <Button>
                    <HandIcon />
                    Trocar para esse
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon />
            Pagamento
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap  items-center">
          <TornadoIcon />
          Há implementar...
        </CardContent>
      </Card>
    </RootLayout>
  );
}
