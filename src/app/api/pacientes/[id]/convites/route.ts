import { db, pacientes, convites } from "@/lib/db";
import { getUserId, getUserRole, unauthorized } from "@/lib/auth/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const conviteSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const { id } = await params;
    const pacienteId = Number(id);

    const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, pacienteId));
    if (!paciente) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    if (paciente.terapeutaId !== userId) return unauthorized();

    const lista = await db
      .select()
      .from(convites)
      .where(eq(convites.pacienteId, pacienteId))
      .orderBy(desc(convites.criadoEm));

    return NextResponse.json(lista);
  } catch (err) {
    console.error("[GET /api/pacientes/:id/convites]", err);
    return NextResponse.json({ error: "Erro ao listar convites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const [userId, role] = await Promise.all([getUserId(), getUserRole()]);
  if (!userId || !role) return unauthorized();
  if (role !== "profissional") return unauthorized();

  try {
    const { id } = await params;
    const pacienteId = Number(id);

    const [paciente] = await db.select().from(pacientes).where(eq(pacientes.id, pacienteId));
    if (!paciente) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    if (paciente.terapeutaId !== userId) return unauthorized();
    if (paciente.responsavelUserId) {
      return NextResponse.json({ error: "Este paciente já tem responsável vinculado" }, { status: 400 });
    }

    const body = await req.json();
    const { email } = conviteSchema.parse(body);

    const client = await clerkClient();

    const pendentes = await db
      .select()
      .from(convites)
      .where(
        and(
          eq(convites.pacienteId, pacienteId),
          isNull(convites.aceitoEm),
          isNull(convites.revogadoEm),
        ),
      );

    for (const c of pendentes) {
      try {
        await client.invitations.revokeInvitation(c.clerkInvitationId);
      } catch (err) {
        console.warn(`Falha ao revogar convite Clerk ${c.clerkInvitationId}:`, err);
      }
      await db
        .update(convites)
        .set({ revogadoEm: new Date().toISOString() })
        .where(eq(convites.id, c.id));
    }

    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    const [novoConvite] = await db
      .insert(convites)
      .values({
        pacienteId,
        email,
        clerkInvitationId: "pending",
        criadoPorUserId: userId,
        expiraEm: expiraEm.toISOString(),
      })
      .returning();

    let invitation;
    try {
      const baseUrl = new URL(req.url).origin;
      invitation = await client.invitations.createInvitation({
        emailAddress: email,
        publicMetadata: { role: "pais", conviteId: novoConvite.id },
        redirectUrl: `${baseUrl}/convite/aceitar`,
        notify: true,
      });
    } catch (err) {
      await db.delete(convites).where(eq(convites.id, novoConvite.id));
      throw err;
    }

    const [atualizado] = await db
      .update(convites)
      .set({ clerkInvitationId: invitation.id })
      .where(eq(convites.id, novoConvite.id))
      .returning();

    return NextResponse.json(atualizado, { status: 201 });
  } catch (err) {
    console.error("[POST /api/pacientes/:id/convites]", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar convite" }, { status: 500 });
  }
}
