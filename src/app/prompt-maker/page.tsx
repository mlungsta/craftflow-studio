"use client";

import { useState } from "react";

type Flow = "blueprint" | "digital-product";

const uidPlaceholder = "00000000-0000-0000-0000-000000000001";
const projectPlaceholder = "11111111-1111-1111-1111-111111111111";

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export default function PromptMakerTestPage() {
  const [flow, setFlow] = useState<Flow>("blueprint");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState<unknown>(null);

  const [projectId, setProjectId] = useState(projectPlaceholder);
  const [userId, setUserId] = useState(uidPlaceholder);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("demo@craftflow.local");
  const [password, setPassword] = useState("password123");
  const [toolTarget, setToolTarget] = useState("chatgpt");

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
      body: JSON.stringify({ name: "Prompt Maker Project", description: "Autocreated for testing" })
    });
    const project = await projectRes.json();
    setResult({ session, project });
    if (projectRes.ok && project.id) setProjectId(project.id);
    setStatus(projectRes.ok ? "ready" : "failed");
  }

  async function submit(): Promise<void> {
    setStatus("submitting");
    const isBlueprint = flow === "blueprint";

    const payload = isBlueprint
      ? {
          project_id: projectId,
          tool_target: toolTarget,
          questionnaire: {
            business: { niche: "Civil engineering templates", offer_type: "Template bundle", monetization_model: "One-time payment" },
            audience: {
              target_audience: "Construction teams and consulting engineers",
              primary_pain_points: ["Slow proposal drafting", "Inconsistent calculations"],
              desired_outcomes: ["Faster delivery", "Higher quality outputs"]
            },
            positioning: {
              unique_value_proposition: "Production-ready templates tailored to civil engineering workflows.",
              brand_tone: "Expert and practical",
              pricing_hint: "$49-$149"
            },
            execution: { launch_window_days: 30, channels: ["LinkedIn", "Email list"], constraints: ["Limited design capacity"] }
          }
        }
      : {
          project_id: projectId,
          tool_target: toolTarget,
          questionnaire: {
            core: {
              product_type: "Prompt pack",
              product_topic: "Engineering proposal automation",
              transformation_goal: "Help engineers generate winning proposals in half the time."
            },
            specs: { format: "PDF + prompt library", depth_level: "intermediate", estimated_length: "45 pages" },
            audience: {
              target_audience: "Freelance and agency engineers",
              pain_points: ["Low conversion proposals", "Manual repetitive drafting"],
              objections: ["Too generic", "Not practical enough"]
            },
            outcomes: {
              deliverables: ["Proposal prompt templates", "Offer positioning worksheet"],
              call_to_action: "Use this system on your next 3 client proposals",
              compliance_notes: ["Do not fabricate technical credentials"]
            }
          }
        };

    const endpoint = isBlueprint ? "/api/v1/prompt-maker/blueprint/generations" : "/api/v1/prompt-maker/digital-product/generations";

    const response = await fetch(endpoint, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
    const data = await response.json();
    setResult(data);

    if (!response.ok || !data?.generation_id) {
      setStatus("failed");
      return;
    }

    for (let i = 0; i < 12; i += 1) {
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

  return (
    <main style={{ padding: 30, maxWidth: 980, margin: "0 auto" }}>
      <h1>Prompt Maker</h1>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={initSessionAndProject}>Init Session + Project</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setFlow("blueprint")}>Business Blueprint</button>
        <button onClick={() => setFlow("digital-product")}>Digital Product</button>
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project UUID" />
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User UUID" />
        <select value={toolTarget} onChange={(e) => setToolTarget(e.target.value)}>
          <option value="chatgpt">chatgpt</option>
          <option value="claude">claude</option>
          <option value="gemini">gemini</option>
        </select>
      </div>
      <button onClick={submit}>Generate</button>
      <div>Status: {status}</div>
      <pre style={{ whiteSpace: "pre-wrap", background: "#0f1a36", padding: 12, borderRadius: 8 }}>{pretty(result)}</pre>
    </main>
  );
}
