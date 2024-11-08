import RootLayout from "@/components/root-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Loader2Icon,
  TornadoIcon,
  UserCircle2Icon,
} from "lucide-react";

import { InferGetServerSidePropsType } from "next";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

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
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const updatePassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/consumer/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPasswordMessage("Sua senha foi atualizada com sucesso.");
      setShowSuccessDialog(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      setPasswordMessage(error.message || "Erro ao atualizar senha.");
      setShowSuccessDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setIsLoading(true);

      await fetch("/api/consumer/delete", {
        method: "DELETE",
      });

      await signOut();
      router.push("/");
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <RootLayout breadcrumb={["Minha conta"]} className="flex flex-col gap-4">
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Senha</DialogTitle>
            <DialogDescription>{passwordMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
              conta e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={deleteUser}>
                {isLoading ? <Loader2Icon /> : <>Sim, excluir conta</>}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex gap-2 items-center my-2">
        <UserCircle2Icon className="h-8 w-8" />
        <h1 className="text-xl font-bold">
          Olá, {consumer.name.split(" ").slice(0, 2).join(" ")}
        </h1>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3Icon />
            Alterar minha senha
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap">
          <div className="flex flex-col sm:flex-row w-fit items-center justify-center gap-2">
            <Label className="text-nowrap">Senha atual:</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-fit items-center justify-center gap-2">
            <Label className="text-nowrap">Nova senha:</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            variant="secondary"
            onClick={updatePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin">...</div>
            ) : (
              <>
                <CheckIcon />
                Atualizar senha
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircleIcon />
            Área perigosa
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap items-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin">...</div>
            ) : (
              <>
                <TornadoIcon />
                Excluir conta
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </RootLayout>
  );
}
