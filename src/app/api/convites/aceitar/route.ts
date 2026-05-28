import { db, pacientes, convites } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "pais") return unauthorized("Apenas responsáveis podem aceitar convites");

  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const conviteId = user.publicMetadata?.conviteId as number | undefined;
    if (!conviteId) {
      return NextResponse.json({ error: "Nenhum convite pendente para este usuário" }, { status: 404 });
    }

    const [convite] = await db.select().from(convites).where(eq(convites.id, conviteId));
    if (!convite) return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    if (convite.aceitoEm) return NextResponse.json({ error: "Convite já aceito" }, { status: 400 });
    if (convite.revogadoEm) return NextResponse.json({ error: "Convite revogado" }, { status: 400 });
    if (new Date(convite.expiraEm) < new Date()) {
      return NextResponse.json({ error: "Convite expirado" }, { status: 400 });
    }

    const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, convite.pacienteId));
    if (!paciente) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    if (paciente.responsavelUserId && paciente.responsavelUserId !== userId) {
      return NextResponse.json({ error: "Este paciente já tem outro responsável vinculado" }, { status: 400 });
    }

    await db
      .update(pacientes)
      .set({ responsavelUserId: userId, atualizadoEm: new Date().toISOString() })
      .where(eq(pacientes.id, convite.pacienteId));

    await db
      .update(convites)
      .set({ aceitoEm: new Date().toISOString() })
      .where(eq(convites.id, conviteId));

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "pais" },
    });

    return NextResponse.json({ pacienteId: convite.pacienteId });
  } catch (err) {
    console.error("[POST /api/convites/aceitar]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao aceitar convite" }, { status: 500 });
  }
}
