import RootLayout from "@/components/root-layout";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const publicId = context.params!["public-id"] as string;

  const product = await prisma.product.findFirst({
    where: {
      publicId,
    },
  });

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
    <RootLayout breadcrumb={[["/products", "Produtos"], product.name]}>
      .
    </RootLayout>
  );
}
