import { FormEvent, useState } from "react";

import RootLayout from "@/components/root-layout";

import { useRouter } from "next/router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertCircleIcon,
  CheckIcon,
  LoaderIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/product";
import { Target } from "@/types/target";

export default function Page() {
  const session = useSession();

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalIsLoading, setConfirmModalIsLoading] = useState(false);
  const [productSource, setProductSource] = useState<string | undefined>(
    undefined
  );

  let formData: FormData | undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    formData = new FormData(event.target as HTMLFormElement);

    setProductSource(
      "https://lista.mercadolivre.com.br/" +
        slugify(
          formData.get("name")!.toString(),
          formData.get("target")?.toString() as Target
        )
    );
  };

  const finishSubmit = async () => {
    setProductSource(undefined);
    setConfirmModalIsLoading(true);

    try {
      const registerResponse = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData!.get("name"),
          target: formData!.get("target"),
          description: formData!.get("description"),
          publicId: session.data?.consumer.publicId,
        }),
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(data.message ?? "Erro ao criar produto");
      }

      router.push("/products");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao criar produto"
      );
    } finally {
      setIsLoading(false);
      setConfirmModalIsLoading(false);
    }
  };

  return (
    <RootLayout
      breadcrumb={[["/products", "Produtos"], "Adicionar"]}
      className=""
    >
      <Dialog open={productSource !== undefined}>
        <DialogContent className="sm:min-w-[80%] sm:min-h-[80%]">
          <DialogHeader>
            <DialogTitle>Antes de continuarmos...</DialogTitle>
            <DialogDescription className="gap-4 flex flex-col h-full">
              Esse é o resultado que você busca?
              <iframe
                className="min-h-[80%] w-full rounded-xl"
                src={productSource}
              ></iframe>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setProductSource(undefined);
                    setIsLoading(false);
                    setConfirmModalIsLoading(false);
                  }}
                >
                  <XIcon />
                  Cancelar
                </Button>
                <Button
                  onClick={() => finishSubmit()}
                  className="w-full"
                  disabled={confirmModalIsLoading}
                >
                  {confirmModalIsLoading ? (
                    <>
                      <LoaderIcon />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      Sim
                    </>
                  )}
                </Button>{" "}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Adicionar produto</CardTitle>
          <CardDescription>
            O nome do produto será pesquisado na loja virtual escolhida como
            alvo
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex gap-2 items-center">
                <AlertCircleIcon />

                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Celular iPhone 15"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Loja alvo</Label>

              <Select name="target" disabled={isLoading} required>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ML">Mercado Livre</SelectItem>
                  <SelectItem value="AZ">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full !mt-8" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderIcon />
                  Adicionando...
                </>
              ) : (
                <>
                  <PlusIcon />
                  Adicionar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </RootLayout>
  );
}
