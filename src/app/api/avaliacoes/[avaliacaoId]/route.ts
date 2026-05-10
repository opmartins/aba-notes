import { getDb, avaliacoes } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const patchSchema = z.object({
  status: z.enum(["em_andamento", "concluida"]).optional(),
  observacoesGerais: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ avaliacaoId: string }> }
) {
  try {
    const { avaliacaoId } = await params;
    const body = await req.json();
    const dados = patchSchema.parse(body);

    const [atualizada] = await getDb()
      .update(avaliacoes)
      .set({ ...dados, atualizadoEm: new Date().toISOString() })
      .where(eq(avaliacoes.id, Number(avaliacaoId)))
      .returning();

    if (!atualizada) {
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 });
    }

    return NextResponse.json(atualizada);
  } catch (err) {
    console.error("[PATCH /api/avaliacoes/:id]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar avaliação" }, { status: 500 });
  }
}
