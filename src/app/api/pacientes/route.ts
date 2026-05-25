import { db, pacientes } from "@/lib/db";
import { pacienteSchema } from "@/lib/validators/paciente";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const lista = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.ativo, true))
      .orderBy(desc(pacientes.criadoEm));
    return NextResponse.json(lista);
  } catch (err) {
    console.error("[GET /api/pacientes]", err);
    return NextResponse.json({ error: "Erro ao buscar pacientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dados = pacienteSchema.parse(body);

    const [novo] = await db
      .insert(pacientes)
      .values({
        ...dados,
        dataInicio: dados.dataInicio || new Date().toISOString().split("T")[0],
      })
      .returning();

    return NextResponse.json(novo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/pacientes]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar paciente" }, { status: 500 });
  }
}
