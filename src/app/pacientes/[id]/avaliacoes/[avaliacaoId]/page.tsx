import { notFound } from "next/navigation";
import Link from "next/link";
import { db, pacientes, avaliacoes, respostasMarcos } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatarData } from "@/lib/utils";
import { AvaliacaoForm } from "@/components/avaliacao-form";

export default async function AvaliacaoPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string }>;
}) {
  const { id, avaliacaoId } = await params;
  const pacienteId = Number(id);
  const avId = Number(avaliacaoId);

  const [paciente] = await db
    .select()
    .from(pacientes)
    .where(eq(pacientes.id, pacienteId));

  if (!paciente) notFound();

  const [avaliacao] = await db
    .select()
    .from(avaliacoes)
    .where(and(eq(avaliacoes.id, avId), eq(avaliacoes.pacienteId, pacienteId)));

  if (!avaliacao) notFound();

  const respostas = await db
    .select()
    .from(respostasMarcos)
    .where(eq(respostasMarcos.avaliacaoId, avId));

  const respostasMap: Record<string, number | null> = {};
  for (const r of respostas) {
    respostasMap[r.marcoId] = r.pontuacao;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar px-6 py-4 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/pacientes/${pacienteId}`}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {paciente.nome}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate">
              {avaliacao.numero}ª Avaliação — {formatarData(avaliacao.dataAvaliacao)}
              {avaliacao.idadeEmMeses ? ` (${avaliacao.idadeEmMeses} meses)` : ""}
            </span>
          </div>

          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded border ${
              avaliacao.status === "em_andamento"
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : "text-emerald-600 bg-emerald-50 border-emerald-200"
            }`}
          >
            {avaliacao.status === "em_andamento" ? "Em andamento" : "Concluída"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <AvaliacaoForm
          avaliacaoId={avId}
          pacienteId={pacienteId}
          respostasIniciais={respostasMap}
          statusInicial={avaliacao.status as "em_andamento" | "concluida"}
        />
      </main>
    </div>
  );
}
