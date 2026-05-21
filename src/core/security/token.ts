import { createHmac, timingSafeEqual } from "node:crypto";
import { getEnv } from "@/core/config/env";

function sign(payload: string): string {
  const env = getEnv();
  return createHmac("sha256", env.JWT_SECRET).update(payload).digest("hex");
}

export function createAccessToken(userId: string, expiresAtEpochSec: number): string {
  const payload = `${userId}.${expiresAtEpochSec}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyAccessToken(token: string): { userId: string; expiresAt: number } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [userId, expiresAtRaw, sig] = decoded.split(".");
    if (!userId || !expiresAtRaw || !sig) return null;

    const payload = `${userId}.${expiresAtRaw}`;
    const expected = sign(payload);
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) return null;

    return { userId, expiresAt };
  } catch {
    return null;
  }
}
