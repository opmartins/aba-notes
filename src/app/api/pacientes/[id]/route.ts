import { db, pacientes } from "@/lib/db";
import { pacienteSchema } from "@/lib/validators/paciente";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [paciente] = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.id, Number(id)));

    if (!paciente) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    return NextResponse.json(paciente);
  } catch (err) {
    console.error("[GET /api/pacientes/:id]", err);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const dados = pacienteSchema.parse(body);

    const [atualizado] = await db
      .update(pacientes)
      .set({ ...dados, atualizadoEm: new Date().toISOString() })
      .where(eq(pacientes.id, Number(id)))
      .returning();

    if (!atualizado) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    return NextResponse.json(atualizado);
  } catch (err) {
    console.error("[PUT /api/pacientes/:id]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar paciente" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db
      .update(pacientes)
      .set({ ativo: false, atualizadoEm: new Date().toISOString() })
      .where(eq(pacientes.id, Number(id)));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/pacientes/:id]", err);
    return NextResponse.json({ error: "Erro ao excluir paciente" }, { status: 500 });
  }
}
