import RootLayout from "@/components/root-layout";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { AlertCircleIcon, GhostIcon } from "lucide-react";

export default function Page() {
  return (
    <RootLayout breadcrumb={["Relatórios"]} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex gap-2 items-center">
            <AlertCircleIcon />
            Relatórios dinâmicos (com base em seus produtos adicionados) serão
            gerados regularmente e aparecerão nessa área.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex flex-col gap-4 items-center">
          <GhostIcon className="h-20 w-20" />

          <p>Nenhum relatório para ser exibido.</p>
        </CardContent>
      </Card>
    </RootLayout>
  );
}
