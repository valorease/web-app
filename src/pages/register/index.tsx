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

import { FormEvent } from "react";

import Link from "next/link";

export default function Page() {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João de Souza Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cellphone">Telefone</Label>
                <Input
                  id="cellphone"
                  type="tel"
                  placeholder="11 99200-2000"
                  required
                />
              </div>

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
                Cadastrar-se
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
