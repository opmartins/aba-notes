import { db, convites } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const { id } = await params;
    const conviteId = Number(id);

    const [convite] = await db.select().from(convites).where(eq(convites.id, conviteId));
    if (!convite) return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    if (convite.criadoPorUserId !== userId) return unauthorized();
    if (convite.aceitoEm) {
      return NextResponse.json({ error: "Convite já aceito não pode ser revogado" }, { status: 400 });
    }
    if (convite.revogadoEm) {
      return NextResponse.json({ error: "Convite já revogado" }, { status: 400 });
    }

    const client = await clerkClient();
    try {
      await client.invitations.revokeInvitation(convite.clerkInvitationId);
    } catch (err) {
      console.warn("Falha ao revogar convite no Clerk:", err);
    }

    await db
      .update(convites)
      .set({ revogadoEm: new Date().toISOString() })
      .where(eq(convites.id, conviteId));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/convites/:id]", err);
    return NextResponse.json({ error: "Erro ao revogar convite" }, { status: 500 });
  }
}
