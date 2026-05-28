import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type Role = "profissional" | "pais";

export async function getUserRole(): Promise<Role | null> {
  const user = await currentUser();
  if (!user) return null;
  return (user.publicMetadata?.role as Role) ?? null;
}

export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export function unauthorized(message = "Acesso não autorizado") {
  return NextResponse.json({ error: message }, { status: 403 });
}
