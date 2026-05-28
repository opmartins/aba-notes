import { db, avaliacoes, pacientes } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const novaAvaliacaoSchema = z.object({
  pacienteId: z.number(),
  numero: z.number(),
  dataAvaliacao: z.string(),
  idadeEmMeses: z.number().optional(),
  terapeuta: z.string().optional(),
});

async function getPacienteComAcesso(pacienteId: number, userId: string) {
  const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, pacienteId));
  if (!paciente) return null;
  if (paciente.terapeutaId !== userId) return null;
  return paciente;
}

export async function POST(req: NextRequest) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const body = await req.json();
    const dados = novaAvaliacaoSchema.parse(body);

    const paciente = await getPacienteComAcesso(dados.pacienteId, userId);
    if (!paciente) return unauthorized("Sem acesso a este paciente");

    const [nova] = await db.insert(avaliacoes).values(dados).returning();
    return NextResponse.json(nova, { status: 201 });
  } catch (err) {
    console.error("[POST /api/avaliacoes]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 });
  }
}
