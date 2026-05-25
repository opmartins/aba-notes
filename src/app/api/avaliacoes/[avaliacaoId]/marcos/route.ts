import { db, respostasMarcos } from "@/lib/db";
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ avaliacaoId: string }> }
) {
  try {
    const { avaliacaoId } = await params;
    const body = await req.json();
    const dados = respostaSchema.parse(body);
    const existente = await db
      .select()
      .from(respostasMarcos)
      .where(
        and(
          eq(respostasMarcos.avaliacaoId, Number(avaliacaoId)),
          eq(respostasMarcos.marcoId, dados.marcoId)
        )
      )
      .limit(1);

    if (existente.length > 0) {
      await db
        .update(respostasMarcos)
        .set({ pontuacao: dados.pontuacao })
        .where(
          and(
            eq(respostasMarcos.avaliacaoId, Number(avaliacaoId)),
            eq(respostasMarcos.marcoId, dados.marcoId)
          )
        );
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
