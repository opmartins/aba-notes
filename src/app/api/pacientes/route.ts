import { db, pacientes, supervisoes } from "@/lib/db";
import { getUserId, getUserRole, unauthorized, visitanteExpirado } from "@/lib/auth/roles";
import { pacienteSchema } from "@/lib/validators/paciente";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();

  try {
    if (role === "visitante") {
      const { publicMetadata } = (await import("@clerk/nextjs/server").then(m => m.currentUser()))!;
      if (visitanteExpirado(publicMetadata as Record<string, unknown>)) {
        return unauthorized("Acesso de visitante expirado");
      }
      const lista = await db.select().from(pacientes).where(eq(pacientes.ativo, true)).orderBy(desc(pacientes.criadoEm));
      return NextResponse.json(lista);
    }

    if (role === "admin") {
      const lista = await db.select().from(pacientes).where(eq(pacientes.ativo, true)).orderBy(desc(pacientes.criadoEm));
      return NextResponse.json(lista);
    }

    if (role === "terapeuta") {
      const lista = await db.select().from(pacientes).where(and(eq(pacientes.ativo, true), eq(pacientes.terapeutaId, userId))).orderBy(desc(pacientes.criadoEm));
      return NextResponse.json(lista);
    }

    if (role === "supervisor") {
      const supervisionados = await db.select({ terapeutaId: supervisoes.terapeutaId }).from(supervisoes).where(eq(supervisoes.supervisorId, userId));
      const ids = supervisionados.map(s => s.terapeutaId);
      if (ids.length === 0) return NextResponse.json([]);
      const lista = await db.select().from(pacientes).where(and(eq(pacientes.ativo, true), inArray(pacientes.terapeutaId, ids))).orderBy(desc(pacientes.criadoEm));
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
  if (role !== "admin" && role !== "terapeuta") return unauthorized();

  try {
    const body = await req.json();
    const dados = pacienteSchema.parse(body);

    const [novo] = await db
      .insert(pacientes)
      .values({
        ...dados,
        terapeutaId: role === "terapeuta" ? userId : (dados.terapeutaId ?? userId),
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
