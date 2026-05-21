import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/core/repositories/projects";
import { requireAuth } from "@/core/security/auth";

const createProjectSchema = z.object({ name: z.string().min(2).max(120), description: z.string().max(1000).optional() });

export async function GET(request: Request): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const data = await listProjects(auth.userId);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : 400 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const payload = createProjectSchema.parse(await request.json());
    const data = await createProject({ userId: auth.userId, name: payload.name, description: payload.description });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : error instanceof ZodError ? 422 : 400 });
  }
}
