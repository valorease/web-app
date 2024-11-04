import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { Consumer } from "@prisma/client";
import {
  AlertCircleIcon,
  CreditCardIcon,
  Edit3Icon,
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

  return {
    props: {
      consumer: JSON.parse(JSON.stringify(consumer)) as Consumer,
    },
  };
};

export default function Page({
  consumer,
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
