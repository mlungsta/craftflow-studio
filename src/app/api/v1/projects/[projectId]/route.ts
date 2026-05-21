import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { getProject, updateProject } from "@/core/repositories/projects";
import { requireAuth } from "@/core/security/auth";

const updateProjectSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["active", "archived"]).optional()
});

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const { projectId } = await context.params;
    const project = await getProject(projectId, auth.userId);
    if (!project) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : 400 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ projectId: string }> }): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const { projectId } = await context.params;
    const payload = updateProjectSchema.parse(await request.json());
    const project = await updateProject(projectId, auth.userId, payload);
    if (!project) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : error instanceof ZodError ? 422 : 400 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ projectId: string }> }): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const { projectId } = await context.params;
    const project = await updateProject(projectId, auth.userId, { status: "archived" });
    if (!project) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : 400 });
  }
}
