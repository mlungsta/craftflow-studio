import { randomUUID } from "node:crypto";
import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { createAccessToken } from "@/core/security/token";
import { getDbPool } from "@/core/repositories/db";

const sessionSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = sessionSchema.parse(await request.json());
    const db = getDbPool();
    const userRes = await db.query("SELECT id, email, password_hash FROM users WHERE email=$1", [payload.email]);

    let userId: string;
    if (!userRes.rows[0]) {
      userId = randomUUID();
      await db.query(
        "INSERT INTO users (id, email, password_hash, full_name, status) VALUES ($1,$2,$3,$4,'active')",
        [userId, payload.email, payload.password, payload.email.split("@")[0]]
      );
    } else {
      userId = String(userRes.rows[0].id);
      if (String(userRes.rows[0].password_hash) !== payload.password) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } }, { status: 401 });
      }
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const token = createAccessToken(userId, expiresAt);
    return NextResponse.json({ token, expires_at: new Date(expiresAt * 1000).toISOString(), user_id: userId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: error instanceof ZodError ? 422 : 400 });
  }
}

export async function DELETE(): Promise<Response> {
  return new Response(null, { status: 204 });
}
