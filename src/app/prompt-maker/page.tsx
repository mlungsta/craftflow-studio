"use client";

import { useState } from "react";

type Flow = "blueprint" | "digital-product";

const uidPlaceholder = "00000000-0000-0000-0000-000000000001";
const projectPlaceholder = "11111111-1111-1111-1111-111111111111";

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export default function PromptMakerPage() {
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
    if (!sessionRes.ok) {
      setResult(session);
      setStatus("failed");
      return;
    }

    setUserId(session.user_id);
    setToken(session.token);

    const projectRes = await fetch("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ name: "Prompt Maker Project", description: "Session bootstrap project" })
    });

    const project = await projectRes.json();
    setResult({ session, project });
    if (projectRes.ok && project.id) {
      setProjectId(project.id);
      setStatus("ready");
    } else {
      setStatus("failed");
    }
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

    setStatus("queued");
    for (let i = 0; i < 14; i += 1) {
      await new Promise((r) => setTimeout(r, 700));
      const poll = await fetch(`/api/v1/generations/${data.generation_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : { "x-user-id": userId }
      });
      const pollData = await poll.json();
      setResult(pollData);
      if (pollData?.status === "completed" || pollData?.status === "failed") {
        setStatus(pollData.status);
        return;
      }
    }

    setStatus("processing");
  }

  async function runQuality(): Promise<void> {
    const payload = flow === "blueprint"
      ? {
          project_id: projectId,
          tool_target: toolTarget,
          questionnaire: {
            business: { niche: "Civil engineering templates", offer_type: "Template bundle", monetization_model: "One-time payment" },
            audience: { target_audience: "Construction teams", primary_pain_points: ["Slow drafting"], desired_outcomes: ["Faster delivery"] },
            positioning: { unique_value_proposition: "Practical templates for engineering teams", brand_tone: "Practical", pricing_hint: "$49" },
            execution: { launch_window_days: 30, channels: ["LinkedIn"], constraints: [] }
          }
        }
      : {
          project_id: projectId,
          tool_target: toolTarget,
          questionnaire: {
            core: { product_type: "Prompt pack", product_topic: "Proposal automation", transformation_goal: "Faster proposals" },
            specs: { format: "PDF", depth_level: "intermediate", estimated_length: "30 pages" },
            audience: { target_audience: "Engineers", pain_points: ["Slow writing"], objections: [] },
            outcomes: { deliverables: ["Prompt set"], call_to_action: "Run this in 1 week", compliance_notes: [] }
          }
        };

    const endpoint = flow === "blueprint" ? "/api/v1/prompt-maker/blueprint/quality" : "/api/v1/prompt-maker/digital-product/quality";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setResult(await res.json());
    setStatus("quality");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">Prompt Maker</div>
        <div className="status">Status: {status}</div>
      </header>

      <section className="grid-2">
        <article className="panel">
          <h3>Session Bootstrap</h3>
          <p>Initialize authenticated context and a valid project for generation tests.</p>
          <div className="controls">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button className="primary" onClick={initSessionAndProject}>Init Session + Project</button>
          </div>
        </article>

        <article className="panel">
          <h3>Flow Controls</h3>
          <p>Select flow and target model adapter.</p>
          <div className="controls">
            <div className="row">
              <button className={flow === "blueprint" ? "primary" : ""} onClick={() => setFlow("blueprint")}>Business Blueprint</button>
              <button className={flow === "digital-product" ? "primary" : ""} onClick={() => setFlow("digital-product")}>Digital Product</button>
            </div>
            <select value={toolTarget} onChange={(e) => setToolTarget(e.target.value)}>
              <option value="chatgpt">chatgpt</option>
              <option value="claude">claude</option>
              <option value="gemini">gemini</option>
            </select>
          </div>
        </article>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h3>Execution</h3>
        <div className="controls">
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project UUID" />
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User UUID" />
          <div className="row">
            <button className="accent" onClick={submit}>Generate</button>
            <button onClick={runQuality}>Quality Score</button>
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h3>Output</h3>
        <pre className="code">{pretty(result)}</pre>
      </section>
    </main>
  );
}
