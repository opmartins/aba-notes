"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2Icon, XCircleIcon, Loader2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "carregando" | "sucesso" | "erro";

export default function AceitarConvitePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [status, setStatus] = useState<Status>("carregando");
  const [mensagem, setMensagem] = useState<string>("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    const aceitar = async () => {
      try {
        const res = await fetch("/api/convites/aceitar", { method: "POST" });
        const dados = await res.json();
        if (!res.ok) throw new Error(dados.error ?? "Erro ao aceitar convite");
        setPacienteId(dados.pacienteId);
        setStatus("sucesso");
        await user?.reload();
      } catch (err) {
        setMensagem(err instanceof Error ? err.message : "Erro ao aceitar convite");
        setStatus("erro");
      }
    };

    aceitar();
  }, [isLoaded, isSignedIn, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center text-center gap-4 py-10">
          {status === "carregando" && (
            <>
              <Loader2Icon className="h-10 w-10 text-primary animate-spin" />
              <div>
                <p className="font-medium">Processando seu convite...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aguarde um instante.
                </p>
              </div>
            </>
          )}

          {status === "sucesso" && (
            <>
              <CheckCircle2Icon className="h-10 w-10 text-emerald-600" />
              <div>
                <p className="font-medium">Convite aceito!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Você agora tem acesso aos dados do paciente.
                </p>
              </div>
              <Button
                onClick={() => (pacienteId ? router.replace(`/pacientes/${pacienteId}`) : router.replace("/"))}
              >
                Acessar dados do paciente
              </Button>
            </>
          )}

          {status === "erro" && (
            <>
              <XCircleIcon className="h-10 w-10 text-destructive" />
              <div>
                <p className="font-medium">Não foi possível aceitar o convite</p>
                <p className="text-sm text-muted-foreground mt-1">{mensagem}</p>
              </div>
              <Button variant="outline" onClick={() => router.replace("/")}>
                Voltar ao início
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
