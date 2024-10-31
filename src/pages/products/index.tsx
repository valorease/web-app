import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

import type { InferGetServerSidePropsType } from "next";

import Link from "next/link";

import { PlusIcon } from "lucide-react";

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
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import plan from "@/lib/plan";

import { Product } from "@prisma/client";

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const products = await prisma.product.findMany({
    where: {
      consumerId: session!.consumer.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)) as Product[],
      plan: await plan.byConsumer(session!.consumer.publicId),
    },
  };
};

const Products = ({ products }: { products: Product[] }) => (
  <div className="flex flex-wrap gap-4">
    {products.map((product) => (
      <Card
        key={product.publicId}
        className="flex-1 max-w-96 flex flex-col justify-between"
      >
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <p>
            {product.lastSearch == null ? (
              "Nunca pesquisado"
            ) : (
              <>
                Última pesquisa:{" "}
                <span className="font-bold">
                  {new Date(product.lastSearch).toLocaleDateString()}
                </span>
              </>
            )}
          </p>

          {product.average && (
            <p>
              Preço médio:{" "}
              <span className="font-bold">
                R$ {product.average.toFixed(2).replace(".", ",")}
              </span>
            </p>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/products/${product.publicId}`}>Detalhes</Link>
          </Button>

          <Button variant="outline" className="w-full">
            <Dialog>
              <DialogTrigger>Remover</DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    <p>Tem certeza que deseja remover esse produto?</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default function Page({
  products,
  plan,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const blockAdd = products.length >= plan.productQuantityLimit;

  return (
    <RootLayout breadcrumb={["Produtos"]} className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Link href={blockAdd ? "#" : "/products/add"}>
          <Button className="w-fit" disabled={blockAdd}>
            <PlusIcon />
            Adicionar
          </Button>
        </Link>

        <p>
          {products.length} / {plan.productQuantityLimit}
        </p>
      </div>

      {products.length < 1 ? (
        <p>Nenhum produto adicionado.</p>
      ) : (
        <Products products={products} />
      )}
    </RootLayout>
  );
}
