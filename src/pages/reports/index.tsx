import RootLayout from "@/components/root-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { AlertCircleIcon, GhostIcon } from "lucide-react";
import { generatePDF } from "../api/reports";

export default function Page() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics");
      if (!response.ok) {
        throw new Error("Erro ao carregar as métricas");
      }
      const data = await response.json();
      setMetrics(data);
      const generatedPdfUrl = await generatePDF(data);
      setPdfUrl(generatedPdfUrl);
    } catch (error) {
      console.error("Erro ao carregar as métricas:", error);
    }
  };

  return (
    <RootLayout breadcrumb={["Relatórios"]} className="flex flex-col gap-4">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Gerar Relatório de Métricas</h2>
            <p className="text-lg">Com base nos produtos que você adicionou, clique abaixo para gerar um relatório completo.</p>
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-6 w-6 text-gray-600" />
              <span className="text-sm text-gray-600">Clique no botão abaixo para começar.</span>
            </div>
            <Button
              onClick={fetchMetrics}
              variant="outline"
              className="mt-4 border-gray-600 text-gray-600 hover:bg-gray-100"
            >
              Gerar Relatório
            </Button>
          </div>
        </CardHeader>
      </Card>

      {pdfUrl ? (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="flex flex-col gap-4 items-center" style={{marginTop:'15px'}}>
            <p>Relatório gerado com sucesso!</p>
            <iframe
              src={pdfUrl}
              width="350%"
              height="410px"
              frameBorder="0"
              title="Relatório PDF"
              className="border-2 rounded-lg shadow-lg"
            />
            <Button
              onClick={() => window.open(pdfUrl, "_blank")}
              className="mt-4"
            >
              Baixar PDF
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="flex flex-col gap-4 items-center">
            <GhostIcon className="h-20 w-20" />
            <p>Nenhum relatório para ser exibido.</p>
          </CardContent>
        </Card>
      )}
    </RootLayout>
  );
}