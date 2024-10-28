import RootLayout from "@/components/root-layout";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  return (
    <RootLayout breadcrumb={["Início"]}>
      {session.data?.consumer.publicId}
    </RootLayout>
  );
}
