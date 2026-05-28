import { db, pacientes } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { pacienteSchema } from "@/lib/validators/paciente";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();

  try {
    if (role === "profissional") {
      const lista = await db.select().from(pacientes).where(and(eq(pacientes.ativo, true), eq(pacientes.terapeutaId, userId))).orderBy(desc(pacientes.criadoEm));
      return NextResponse.json(lista);
    }

    if (role === "pais") {
      const lista = await db.select().from(pacientes).where(and(eq(pacientes.ativo, true), eq(pacientes.responsavelUserId, userId))).orderBy(desc(pacientes.criadoEm));
      return NextResponse.json(lista);
    }

    return unauthorized();
  } catch (err) {
    console.error("[GET /api/pacientes]", err);
    return NextResponse.json({ error: "Erro ao buscar pacientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const body = await req.json();
    const dados = pacienteSchema.parse(body);

    const [novo] = await db
      .insert(pacientes)
      .values({
        ...dados,
        terapeutaId: userId,
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
