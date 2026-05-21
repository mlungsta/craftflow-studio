export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">CraftFlow Studio</div>
        <div className="badge">Phase 1 + Phase 4 Ops Tracks</div>
      </header>

      <section className="kpi" style={{ marginBottom: 16 }}>
        <div className="item">
          <div className="label">Core Modules</div>
          <div className="value">2</div>
        </div>
        <div className="item">
          <div className="label">API Tracks Live</div>
          <div className="value">9</div>
        </div>
        <div className="item">
          <div className="label">Focus</div>
          <div className="value">Quality</div>
        </div>
      </section>

      <section className="grid-2">
        <article className="panel">
          <h2>Prompt Maker</h2>
          <p>Business Blueprint and Digital Product flows with scoring and section regeneration.</p>
          <div className="controls">
            <a href="/prompt-maker"><button className="primary">Open Prompt Maker</button></a>
          </div>
        </article>

        <article className="panel">
          <h2>Website Maker</h2>
          <p>Guided storefront package generation with history retrieval and structured output.</p>
          <div className="controls">
            <a href="/website-maker"><button className="accent">Open Website Maker</button></a>
          </div>
        </article>
      </section>
    </main>
  );
}
