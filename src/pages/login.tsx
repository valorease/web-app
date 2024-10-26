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

import { FormEvent } from "react";
import Link from "next/link";
import ExternalLayout from "@/components/external-layout";

export default function LoginForm() {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Entrar
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
