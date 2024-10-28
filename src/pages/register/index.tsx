import ExternalLayout from "@/components/external-layout";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { AlertCircleIcon, LoaderIcon, LogInIcon } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: password,
        }),
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      const signInResponse = await signIn("credentials", {
        email: formData.get("email"),
        password: password,
        redirect: false,
      });

      if (signInResponse?.error) {
        throw new Error(signInResponse.error);
      }

      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar sua conta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExternalLayout>
      <div className="m-4 grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Cadastre-se</CardTitle>
            <CardDescription>
              Bem-vindo, crie uma conta para utilizar a Valorease
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
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João de Souza Silva"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirme sua senha</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="******"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderIcon />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <LogInIcon />
                    Cadastrar-se
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <Link href="/login" className="text-sm w-full text-center">
              Já possui uma conta? Clique para entrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </ExternalLayout>
  );
}
