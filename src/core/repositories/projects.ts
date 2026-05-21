import { randomUUID } from "node:crypto";
import { getDbPool } from "@/core/repositories/db";

export interface ProjectRecord {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export async function listProjects(userId: string): Promise<ProjectRecord[]> {
  const res = await getDbPool().query(
    `SELECT id, user_id, name, description, status, created_at, updated_at
     FROM projects
     WHERE user_id=$1
     ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString(), updated_at: new Date(r.updated_at).toISOString() }));
}

export async function createProject(input: { userId: string; name: string; description?: string }): Promise<ProjectRecord> {
  const id = randomUUID();
  const res = await getDbPool().query(
    `INSERT INTO projects (id, user_id, name, description, status)
     VALUES ($1,$2,$3,$4,'active')
     RETURNING id, user_id, name, description, status, created_at, updated_at`,
    [id, input.userId, input.name, input.description ?? null]
  );
  const r = res.rows[0];
  return { ...r, created_at: new Date(r.created_at).toISOString(), updated_at: new Date(r.updated_at).toISOString() };
}

export async function getProject(projectId: string, userId: string): Promise<ProjectRecord | null> {
  const res = await getDbPool().query(
    `SELECT id, user_id, name, description, status, created_at, updated_at
     FROM projects
     WHERE id=$1 AND user_id=$2`,
    [projectId, userId]
  );
  if (!res.rows[0]) return null;
  const r = res.rows[0];
  return { ...r, created_at: new Date(r.created_at).toISOString(), updated_at: new Date(r.updated_at).toISOString() };
}

export async function updateProject(projectId: string, userId: string, patch: { name?: string; description?: string; status?: "active" | "archived" }): Promise<ProjectRecord | null> {
  const current = await getProject(projectId, userId);
  if (!current) return null;
  const res = await getDbPool().query(
    `UPDATE projects
     SET name=$3, description=$4, status=$5, updated_at=NOW()
     WHERE id=$1 AND user_id=$2
     RETURNING id, user_id, name, description, status, created_at, updated_at`,
    [projectId, userId, patch.name ?? current.name, patch.description ?? current.description, patch.status ?? current.status]
  );
  const r = res.rows[0];
  return { ...r, created_at: new Date(r.created_at).toISOString(), updated_at: new Date(r.updated_at).toISOString() };
}
