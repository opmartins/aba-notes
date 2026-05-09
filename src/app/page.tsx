"use client";

import { useEffect, useState } from "react";
import { PlusIcon, UserRoundIcon, CalendarIcon, ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PacienteForm } from "@/components/paciente-form";
import { type Paciente } from "@/types";
import { calcularIdade, formatarData } from "@/lib/utils";
import { toast } from "sonner";

export default function Home() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | undefined>();

  const carregarPacientes = async () => {
    try {
      const res = await fetch("/api/pacientes");
      const dados: Paciente[] = await res.json();
      setPacientes(dados);
    } catch {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const abrirEdicao = (paciente: Paciente) => {
    setPacienteEditando(paciente);
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setPacienteEditando(undefined);
  };

  const aoSalvar = (paciente: Paciente) => {
    setPacientes((prev) => {
      const idx = prev.findIndex((p) => p.id === paciente.id);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx] = paciente;
        return novo;
      }
      return [paciente, ...prev];
    });
    fecharDialog();
  };

  const excluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;
    try {
      await fetch(`/api/pacientes/${id}`, { method: "DELETE" });
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Paciente excluído");
    } catch {
      toast.error("Erro ao excluir paciente");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ActivityIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">VB-MAPP Assistant</h1>
              <p className="text-xs text-muted-foreground">Avaliação e acompanhamento clínico</p>
            </div>
          </div>

          <Dialog open={dialogAberto} onOpenChange={(open) => { if (!open) fecharDialog(); setDialogAberto(open); }}>
            <DialogTrigger render={<Button onClick={() => setPacienteEditando(undefined)} />}>
              <PlusIcon className="h-4 w-4" />
              Novo paciente
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {pacienteEditando ? "Editar paciente" : "Cadastrar novo paciente"}
                </DialogTitle>
              </DialogHeader>
              <PacienteForm
                paciente={pacienteEditando}
                onSucesso={aoSalvar}
                onCancelar={fecharDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserRoundIcon className="h-4 w-4" />
                Total de pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pacientes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Em atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pacientes.filter((p) => p.ativo).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ActivityIcon className="h-4 w-4" />
                Avaliações este mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-muted-foreground">—</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de pacientes */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pacientes</h2>

          {carregando ? (
            <div className="text-center py-12 text-muted-foreground">Carregando...</div>
          ) : pacientes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <UserRoundIcon className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">Nenhum paciente cadastrado ainda.</p>
                <Button
                  variant="outline"
                  onClick={() => { setPacienteEditando(undefined); setDialogAberto(true); }}
                >
                  <PlusIcon className="h-4 w-4" />
                  Cadastrar primeiro paciente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {pacientes.map((p) => (
                <Card key={p.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{p.nome}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{calcularIdade(p.dataNascimento)}</span>
                          {p.diagnostico && (
                            <>
                              <span>·</span>
                              <span>{p.diagnostico}</span>
                            </>
                          )}
                          {p.responsavel && (
                            <>
                              <span>·</span>
                              <span>Resp: {p.responsavel}</span>
                            </>
                          )}
                        </div>
                        {p.dataInicio && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Desde {formatarData(p.dataInicio)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" render={<a href={`/pacientes/${p.id}`} />}>
                        Ver avaliações
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirEdicao(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => excluir(p.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
