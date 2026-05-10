import { getDb, avaliacoes } from "@/lib/db";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const novaAvaliacaoSchema = z.object({
  pacienteId: z.number(),
  numero: z.number(),
  dataAvaliacao: z.string(),
  idadeEmMeses: z.number().optional(),
  terapeuta: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dados = novaAvaliacaoSchema.parse(body);

    const [nova] = await getDb()
      .insert(avaliacoes)
      .values(dados)
      .returning();

    return NextResponse.json(nova, { status: 201 });
  } catch (err) {
    console.error("[POST /api/avaliacoes]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 });
  }
}
