import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db, pacientes, avaliacoes, convites } from "@/lib/db";
import { and, eq, desc, isNull, isNotNull } from "drizzle-orm";
import { ArrowLeftIcon, ActivityIcon, CalendarIcon, ClipboardListIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calcularIdade, formatarData } from "@/lib/utils";
import { NovaAvaliacaoButton } from "@/components/nova-avaliacao-button";
import { ConviteResponsavel } from "@/components/convite-responsavel";
import { getUserId, getUserRole } from "@/lib/auth/roles";

export default async function PacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pacienteId = Number(id);

  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) redirect("/sign-in");

  const [paciente] = await db
    .select()
    .from(pacientes)
    .where(eq(pacientes.id, pacienteId));

  if (!paciente) notFound();

  if (role === "profissional" && paciente.terapeutaId !== userId) notFound();
  if (role === "pais" && paciente.responsavelUserId !== userId) notFound();

  const isProfissional = role === "profissional";

  const listaAvaliacoes = await db
    .select()
    .from(avaliacoes)
    .where(eq(avaliacoes.pacienteId, pacienteId))
    .orderBy(desc(avaliacoes.dataAvaliacao));

  const [convitePendente] = isProfissional
    ? await db
        .select()
        .from(convites)
        .where(
          and(
            eq(convites.pacienteId, pacienteId),
            isNull(convites.aceitoEm),
            isNull(convites.revogadoEm),
          ),
        )
        .limit(1)
    : [];

  const [conviteAceito] = isProfissional && paciente.responsavelUserId
    ? await db
        .select()
        .from(convites)
        .where(and(eq(convites.pacienteId, pacienteId), isNotNull(convites.aceitoEm)))
        .orderBy(desc(convites.aceitoEm))
        .limit(1)
    : [];

  const statusLabel: Record<string, string> = {
    em_andamento: "Em andamento",
    concluida: "Concluída",
  };

  const statusColor: Record<string, string> = {
    em_andamento: "text-amber-600 bg-amber-50 border-amber-200",
    concluida: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Pacientes
            </Link>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {paciente.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight">{paciente.nome}</h1>
                <p className="text-xs text-muted-foreground">
                  {calcularIdade(paciente.dataNascimento)}
                  {paciente.diagnostico && ` · ${paciente.diagnostico}`}
                </p>
              </div>
            </div>
          </div>

          {isProfissional && (
            <NovaAvaliacaoButton
              pacienteId={pacienteId}
              proximoNumero={listaAvaliacoes.length + 1}
            />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {isProfissional && (
          <ConviteResponsavel
            pacienteId={pacienteId}
            responsavelVinculado={!!paciente.responsavelUserId}
            convitePendente={convitePendente ?? null}
            conviteAceito={conviteAceito ?? null}
          />
        )}

        {/* Dados do paciente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardListIcon className="h-4 w-4" />
              Dados do paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Data de nascimento</dt>
                <dd className="font-medium mt-0.5">{formatarData(paciente.dataNascimento)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Idade atual</dt>
                <dd className="font-medium mt-0.5">{calcularIdade(paciente.dataNascimento)}</dd>
              </div>
              {paciente.responsavel && (
                <div>
                  <dt className="text-muted-foreground">Responsável</dt>
                  <dd className="font-medium mt-0.5">{paciente.responsavel}</dd>
                </div>
              )}
              {paciente.dataInicio && (
                <div>
                  <dt className="text-muted-foreground">Início do atendimento</dt>
                  <dd className="font-medium mt-0.5">{formatarData(paciente.dataInicio)}</dd>
                </div>
              )}
              {paciente.diagnostico && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Diagnóstico</dt>
                  <dd className="font-medium mt-0.5">{paciente.diagnostico}</dd>
                </div>
              )}
              {paciente.observacoes && (
                <div className="col-span-2 sm:col-span-4">
                  <dt className="text-muted-foreground">Observações</dt>
                  <dd className="mt-0.5 text-muted-foreground">{paciente.observacoes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Avaliações */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-primary" />
            Avaliações VB-MAPP
          </h2>

          {listaAvaliacoes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">Nenhuma avaliação registrada ainda.</p>
                {isProfissional && (
                  <NovaAvaliacaoButton
                    pacienteId={pacienteId}
                    proximoNumero={1}
                    variant="outline"
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {listaAvaliacoes.map((av) => (
                <Card key={av.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {av.numero}ª
                      </div>
                      <div>
                        <p className="font-medium">
                          {av.numero}ª Avaliação
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                          <span>{formatarData(av.dataAvaliacao)}</span>
                          {av.idadeEmMeses && (
                            <>
                              <span>·</span>
                              <span>{av.idadeEmMeses} meses de idade</span>
                            </>
                          )}
                          {av.terapeuta && (
                            <>
                              <span>·</span>
                              <span>{av.terapeuta}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded border ${statusColor[av.status] ?? ""}`}
                      >
                        {statusLabel[av.status] ?? av.status}
                      </span>
                      <Link
                        href={`/pacientes/${pacienteId}/avaliacoes/${av.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        {av.status === "em_andamento" ? "Continuar" : "Ver resultado"}
                      </Link>
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
