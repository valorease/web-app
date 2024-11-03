import RootLayout from "@/components/root-layout";
import { prisma } from "@/lib/prisma";
import { Consumer } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps = async () => {
  const session = await getSession();

  const consumer = await prisma.consumer.findFirst({
    where: {
      publicId: session?.consumer.publicId,
    },
  });

  return {
    props: {
      consumer: JSON.parse(JSON.stringify(consumer)) as Consumer,
    },
  };
};

export default function Page({
  consumer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <RootLayout breadcrumb={["Sua conta"]}>
      {new Date(consumer.createdAt).toLocaleString()}
    </RootLayout>
  );
}
