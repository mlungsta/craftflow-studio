"use client";

import { useState } from "react";

const uidPlaceholder = "00000000-0000-0000-0000-000000000001";
const projectPlaceholder = "11111111-1111-1111-1111-111111111111";

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export default function WebsiteMakerPage() {
  const [projectId, setProjectId] = useState(projectPlaceholder);
  const [userId, setUserId] = useState(uidPlaceholder);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("demo@craftflow.local");
  const [password, setPassword] = useState("password123");
  const [storeName, setStoreName] = useState("Civil Templates Hub");
  const [audience, setAudience] = useState("Construction teams and consulting engineers");
  const [productType, setProductType] = useState("Spreadsheets");
  const [colorTheme, setColorTheme] = useState("Teal");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState<unknown>(null);

  function authHeaders(): HeadersInit {
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json", "x-user-id": userId };
  }

  async function initSessionAndProject(): Promise<void> {
    setStatus("auth");
    const sessionRes = await fetch("/api/v1/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const session = await sessionRes.json();
    setResult(session);
    if (!sessionRes.ok) return;

    setUserId(session.user_id);
    setToken(session.token);

    const projectRes = await fetch("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ name: "Website Maker Project", description: "Autocreated for testing" })
    });
    const project = await projectRes.json();
    setResult({ session, project });
    if (projectRes.ok && project.id) setProjectId(project.id);
    setStatus(projectRes.ok ? "ready" : "failed");
  }

  async function generate(): Promise<void> {
    setStatus("submitting");
    const res = await fetch("/api/v1/website-maker/generations", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        project_id: projectId,
        product_type: productType,
        audience,
        color_theme: colorTheme,
        store_name: storeName,
        has_shopify_account: true
      })
    });

    const data = await res.json();
    setResult(data);
    if (!res.ok || !data?.generation_id) {
      setStatus("failed");
      return;
    }

    for (let i = 0; i < 14; i += 1) {
      await new Promise((r) => setTimeout(r, 700));
      const poll = await fetch(`/api/v1/generations/${data.generation_id}`, { headers: token ? { Authorization: `Bearer ${token}` } : { "x-user-id": userId } });
      const pollData = await poll.json();
      setResult(pollData);
      if (pollData?.status === "completed" || pollData?.status === "failed") {
        setStatus(pollData.status);
        return;
      }
    }

    setStatus("processing");
  }

  async function loadHistory(): Promise<void> {
    const res = await fetch(`/api/v1/projects/${projectId}/generations`, { headers: token ? { Authorization: `Bearer ${token}` } : { "x-user-id": userId } });
    setResult(await res.json());
    setStatus("history");
  }

  return (
    <main style={{ padding: 30, maxWidth: 980, margin: "0 auto" }}>
      <h1>Website Maker</h1>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={initSessionAndProject}>Init Session + Project</button>
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project UUID" />
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User UUID" />
        <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Store Name" />
        <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
        <input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="Product Type" />
        <input value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} placeholder="Color Theme" />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={generate}>Generate Website Package</button>
        <button onClick={loadHistory}>Load Project History</button>
      </div>
      <div>Status: {status}</div>
      <pre style={{ whiteSpace: "pre-wrap", background: "#0f1a36", padding: 12, borderRadius: 8 }}>{pretty(result)}</pre>
    </main>
  );
}
