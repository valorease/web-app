import { Button } from "@/components/ui/button";
import RootLayout from "@/components/root-layout";

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
    props: { products: JSON.parse(JSON.stringify(products)) as Product[] },
  };
};

const Products = ({ products }: { products: Product[] }) => (
  <div className="flex flex-wrap gap-4">
    {products.map((product) => (
      <Card key={product.publicId} className="flex-1 max-w-96">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <p>
            Última pesquisa:{" "}
            {product.lastSearch == null
              ? "..."
              : new Date(product.lastSearch).toLocaleDateString()}
          </p>

          <p>
            Preço médio: {product.average ? `R\$${product.average}` : "..."}
          </p>
        </CardContent>

        <CardFooter className="gap-2">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/products/${product.publicId}`}>Detalhes</Link>
          </Button>

          <Button variant="outline" className="w-full">
            Remover
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default function Page({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <RootLayout breadcrumb={["Produtos"]} className="flex flex-col gap-4">
      <Button asChild className="w-fit">
        <Link href="/products/add">
          <PlusIcon />
          Adicionar
        </Link>
      </Button>

      {products.length < 1 ? (
        <p>Nenhum produto adicionado.</p>
      ) : (
        <Products products={products} />
      )}
    </RootLayout>
  );
}
