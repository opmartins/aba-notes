"use client";

import { useState } from "react";
import { MailIcon, CheckCircle2Icon, ClockIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatarData } from "@/lib/utils";

interface ConviteUI {
  id: number;
  email: string;
  criadoEm: string;
  expiraEm: string;
  aceitoEm: string | null;
  revogadoEm: string | null;
}

interface ConviteResponsavelProps {
  pacienteId: number;
  responsavelVinculado: boolean;
  convitePendente: ConviteUI | null;
  conviteAceito: ConviteUI | null;
}

export function ConviteResponsavel({
  pacienteId,
  responsavelVinculado,
  convitePendente,
  conviteAceito,
}: ConviteResponsavelProps) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pendenteAtual, setPendenteAtual] = useState<ConviteUI | null>(convitePendente);

  const enviarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch(`/api/pacientes/${pacienteId}/convites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const novo: ConviteUI = await res.json();
      setPendenteAtual(novo);
      setEmail("");
      setDialogAberto(false);
      toast.success("Convite enviado por e-mail");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar convite");
    } finally {
      setEnviando(false);
    }
  };

  const revogar = async () => {
    if (!pendenteAtual) return;
    if (!confirm("Cancelar este convite?")) return;
    try {
      const res = await fetch(`/api/convites/${pendenteAtual.id}`, { method: "DELETE" });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setPendenteAtual(null);
      toast.success("Convite cancelado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cancelar convite");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <MailIcon className="h-4 w-4" />
          Acesso do responsável
        </CardTitle>
      </CardHeader>
      <CardContent>
        {responsavelVinculado && conviteAceito ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
              <span>
                <span className="font-medium">{conviteAceito.email}</span>
                <span className="text-muted-foreground"> · aceito em {formatarData(conviteAceito.aceitoEm!)}</span>
              </span>
            </div>
          </div>
        ) : pendenteAtual ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-amber-600" />
              <span>
                Convite enviado para <span className="font-medium">{pendenteAtual.email}</span>
                <span className="text-muted-foreground"> · expira em {formatarData(pendenteAtual.expiraEm)}</span>
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={revogar}>
              <XIcon className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Nenhum responsável vinculado a este paciente.
            </p>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger render={<Button size="sm" />}>
                <MailIcon className="h-4 w-4" />
                Convidar responsável
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Convidar responsável</DialogTitle>
                </DialogHeader>
                <form onSubmit={enviarConvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail do responsável *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="responsavel@email.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Um e-mail com link de cadastro será enviado. O convite expira em 7 dias.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogAberto(false)}
                      disabled={enviando}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={enviando}>
                      {enviando ? "Enviando..." : "Enviar convite"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
