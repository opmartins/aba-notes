import { db, avaliacoes, pacientes } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const patchSchema = z.object({
  status: z.enum(["em_andamento", "concluida"]).optional(),
  observacoesGerais: z.string().optional(),
});

async function getAvaliacaoComAcesso(avaliacaoId: number, userId: string, role: string) {
  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, avaliacaoId));
  if (!avaliacao) return null;

  const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, avaliacao.pacienteId));
  if (!paciente) return null;

  if (role === "profissional" && paciente.terapeutaId === userId) return avaliacao;
  if (role === "pais" && paciente.responsavelUserId === userId) return avaliacao;

  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ avaliacaoId: string }> }
) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const { avaliacaoId } = await params;
    const avaliacao = await getAvaliacaoComAcesso(Number(avaliacaoId), userId, role);
    if (!avaliacao) return unauthorized("Sem acesso a esta avaliação");

    const body = await req.json();
    const dados = patchSchema.parse(body);

    const [atualizada] = await db
      .update(avaliacoes)
      .set({ ...dados, atualizadoEm: new Date().toISOString() })
      .where(eq(avaliacoes.id, Number(avaliacaoId)))
      .returning();

    return NextResponse.json(atualizada);
  } catch (err) {
    console.error("[PATCH /api/avaliacoes/:id]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar avaliação" }, { status: 500 });
  }
}
