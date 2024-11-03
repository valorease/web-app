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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import plan from "@/lib/plan";

import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

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

const Products = ({ products }: { products: Product[] }) => {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (publicId: string) => {
    setIsDeleting(true);

    await fetch(`/api/product/${publicId}`, {
      method: "DELETE",
    });

    router.reload();
  };

  return (
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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Remover
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle>Remover produto</DialogTitle>

                <DialogHeader>
                  <DialogDescription>
                    <p>Tem certeza que deseja remover esse produto?</p>
                  </DialogDescription>

                  <DialogFooter className="!justify-center !mt-4">
                    <DialogClose asChild>
                      <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <Button
                      onClick={() => handleDelete(product.publicId)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Removendo..." : "Remover"}
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

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
