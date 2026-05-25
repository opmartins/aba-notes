import { db, avaliacoes, pacientes, respostasMarcos, supervisoes } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const respostaSchema = z.object({
  marcoId: z.string(),
  area: z.string(),
  nivel: z.number(),
  item: z.number(),
  pontuacao: z.number().nullable(),
});

async function temAcessoEdicaoAvaliacao(avaliacaoId: number, userId: string, role: string) {
  if (role !== "admin" && role !== "terapeuta" && role !== "supervisor") return false;

  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, avaliacaoId));
  if (!avaliacao) return false;

  const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, avaliacao.pacienteId));
  if (!paciente) return false;

  if (role === "admin") return true;
  if (role === "terapeuta") return paciente.terapeutaId === userId;

  if (role === "supervisor") {
    const [supervisao] = await db.select().from(supervisoes).where(
      and(eq(supervisoes.supervisorId, userId), eq(supervisoes.terapeutaId, paciente.terapeutaId))
    );
    return !!supervisao;
  }

  return false;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ avaliacaoId: string }> }
) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();

  try {
    const { avaliacaoId } = await params;
    const temAcesso = await temAcessoEdicaoAvaliacao(Number(avaliacaoId), userId, role);
    if (!temAcesso) return unauthorized("Sem acesso a esta avaliação");

    const body = await req.json();
    const dados = respostaSchema.parse(body);

    const existente = await db
      .select()
      .from(respostasMarcos)
      .where(and(eq(respostasMarcos.avaliacaoId, Number(avaliacaoId)), eq(respostasMarcos.marcoId, dados.marcoId)))
      .limit(1);

    if (existente.length > 0) {
      await db
        .update(respostasMarcos)
        .set({ pontuacao: dados.pontuacao })
        .where(and(eq(respostasMarcos.avaliacaoId, Number(avaliacaoId)), eq(respostasMarcos.marcoId, dados.marcoId)));
    } else {
      await db.insert(respostasMarcos).values({
        avaliacaoId: Number(avaliacaoId),
        marcoId: dados.marcoId,
        area: dados.area,
        nivel: dados.nivel,
        item: dados.item,
        pontuacao: dados.pontuacao,
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[PUT /api/avaliacoes/:id/marcos]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao salvar resposta" }, { status: 500 });
  }
}
