import RootLayout from "@/components/root-layout";
import { prisma } from "@/lib/prisma";
import { LayoutDashboardIcon } from "lucide-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const publicId = context.params!["public-id"] as string;

  const product = await prisma.product.findFirst({
    where: {
      publicId,
    },
    include: {
      ProductHistory: {
        take: 100,
      },
    },
  });

  type Product = typeof product;
  console.log(product?.ProductHistory);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)) as Product,
    },
  };
};

export default function Page({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <RootLayout breadcrumb={[["/products", "Produtos"], product!.name]}>
      <div className="flex gap-2 items-center">
        <LayoutDashboardIcon />
        <h1 className="text-xl font-bold">{product!.name}</h1>
      </div>

      <h2>{product!.description}</h2>

      <section>
        {product?.ProductHistory.map((productHistory) => (
          <div>
            {productHistory.price}
            {productHistory.url}
            {productHistory.updatedAt?.toString()}
          </div>
        ))}
      </section>
    </RootLayout>
  );
}
