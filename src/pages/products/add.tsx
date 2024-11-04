import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";

import RootLayout from "@/components/root-layout";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  AlertCircleIcon,
  CheckIcon,
  LoaderIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

import { getURL } from "@/lib/product";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Target } from "@/types/target";

interface SubmitState {
  isLoading: boolean;
  error: string | null;
}

const useProductSubmission = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [submitState, setSubmitState] = useState<SubmitState>({
    isLoading: false,
    error: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);

  const getPreviewUrl = useCallback((name: string, target: Target) => {
    return getURL(name, target);
  }, []);

  const submitProduct = async (formData: FormData) => {
    if (!session?.consumer?.publicId) {
      setSubmitState({
        isLoading: false,
        error: "Sessão expirada. Por favor, faça login novamente.",
      });
      return;
    }

    setSubmitState({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          target: formData.get("target"),
          publicId: session.consumer.publicId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao criar produto");
      }

      await router.push("/products");
    } catch (error) {
      setPreviewUrl(null);
      setSubmitState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao criar produto",
      });
    }
  };

  return {
    submitState,
    previewUrl,
    setPreviewUrl,
    getPreviewUrl,
    submitProduct,
    currentFormData,
    setCurrentFormData,
  };
};

export default function Page() {
  const {
    submitState,
    previewUrl,
    setPreviewUrl,
    getPreviewUrl,
    submitProduct,
    currentFormData,
    setCurrentFormData,
  } = useProductSubmission();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString();
    const target = formData.get("target")?.toString() as Target;

    if (!name || !target) {
      return;
    }

    setCurrentFormData(formData);
    const url = getPreviewUrl(name, target);
    setPreviewUrl(url);
  };

  const handleConfirmSubmit = async () => {
    if (currentFormData) {
      await submitProduct(currentFormData);
    }
  };

  const [loadingIframe, setLoadingIframe] = useState(true);

  const handleCancel = () => {
    setLoadingIframe(true);
    setPreviewUrl(null);
    setCurrentFormData(null);
  };

  return (
    <RootLayout
      breadcrumb={[["/products", "Produtos"], "Adicionar"]}
      className=""
    >
      <Dialog open={!!previewUrl} onOpenChange={() => handleCancel()}>
        <DialogContent className="w-[90%] sm:min-w-[80%] h-[90%] sm:min-h-[80%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              Antes de continuarmos...
            </DialogTitle>

            <DialogDescription className="gap-4 flex flex-col h-full items-center justify-between">
              <p>Esse é o resultado que você busca?</p>

              {previewUrl && (
                <div className="relative min-h-[80%] h-full w-full flex flex-col items-center justify-center">
                  {loadingIframe && <LoadingSpinner className="h-20 w-20" />}

                  <iframe
                    className="absolute inset-0 w-full h-full rounded-xl"
                    src={previewUrl}
                    onLoad={() => setLoadingIframe(false)}
                  ></iframe>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitState.isLoading}
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>

                <Button
                  onClick={handleConfirmSubmit}
                  className="w-full"
                  disabled={submitState.isLoading}
                >
                  {submitState.isLoading ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Confirmar
                    </>
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Adicionar produto</CardTitle>

          <CardDescription>
            O nome do produto será pesquisado na loja virtual escolhida como
            alvo
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full h-[calc(100%-100px)] flex items-center justify-center">
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            {submitState.error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex gap-2 items-center">
                <AlertCircleIcon className="w-4 h-4" />
                {submitState.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Celular iPhone 15"
                required
                disabled={submitState.isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                required
                disabled={submitState.isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Loja alvo</Label>
              <Select name="target" disabled={submitState.isLoading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ML">Mercado Livre</SelectItem>
                  <SelectItem value="AZ">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full !mt-8"
              disabled={submitState.isLoading}
            >
              {submitState.isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </RootLayout>
  );
}
