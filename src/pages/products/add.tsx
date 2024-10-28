import { FormEvent, useState } from "react";

import RootLayout from "@/components/root-layout";

import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertCircleIcon, LoaderIcon, PlusIcon } from "lucide-react";

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

export default function Page() {
  const session = useSession();

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const registerResponse = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          target: formData.get("target"),
          description: formData.get("description"),
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
    }
  };

  return (
    <RootLayout
      breadcrumb={[["/products", "Produtos"], "Adicionar"]}
      className=""
    >
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
