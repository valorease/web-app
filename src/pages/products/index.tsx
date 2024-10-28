import type { InferGetServerSidePropsType } from "next";

import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getSession, GetSessionParams } from "next-auth/react";
import { PlusIcon } from "lucide-react";
import { Product } from "@prisma/client";

export const getServerSideProps = async (context: GetSessionParams) => {
  const session = await getSession(context);

  const products = await prisma.product.findMany({
    where: {
      consumerId: session?.consumer.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  return { props: { products } };
};

const Products = ({ products }: { products: Product[] }) => <div></div>;

export default function Page({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <RootLayout
      breadcrumb={["Produtos"]}
      className="flex flex-col gap-4 items-center justify-center"
    >
      {products.length < 1 ? (
        <p>Nenhum produto adicionado</p>
      ) : (
        <Products products={products} />
      )}

      <Button asChild className="w-full max-w-52">
        <Link href="/products/add">
          <PlusIcon />
          Adicionar
        </Link>
      </Button>
    </RootLayout>
  );
}
