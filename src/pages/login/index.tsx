import ExternalLayout from "@/components/external-layout";

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

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { LoaderIcon, LogInIcon } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setError("Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExternalLayout>
      <div className="m-4 grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Bem-vindo de volta. Entre para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@email.com"
                  required
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
                />
              </div>

              <Button type="submit" className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogInIcon />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <Link href="/register" className="text-sm w-full text-center">
              Não possui uma conta? Clique para se cadastrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </ExternalLayout>
  );
}
