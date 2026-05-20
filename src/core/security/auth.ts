export interface AuthContext {
  userId: string;
}

export function requireAuth(headers: Headers): AuthContext {
  const userId = headers.get("x-user-id");
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return { userId };
}
