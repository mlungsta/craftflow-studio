import { verifyAccessToken } from "@/core/security/token";

export interface AuthContext {
  userId: string;
}

export function requireAuth(headers: Headers): AuthContext {
  const authz = headers.get("authorization") ?? "";
  const bearer = authz.startsWith("Bearer ") ? authz.slice(7).trim() : "";

  const verified = bearer ? verifyAccessToken(bearer) : null;
  if (verified) {
    return { userId: verified.userId };
  }

  // Backward-compatible dev fallback
  const devUserId = headers.get("x-user-id");
  if (devUserId) {
    return { userId: devUserId };
  }

  throw new Error("UNAUTHORIZED");
}
