export default function HomePage() {
  return (
    <main style={{ padding: "40px", maxWidth: 980, margin: "0 auto" }}>
      <h1>CraftFlow Studio</h1>
      <p>Active: Phase 1A + 1B execution workspace.</p>
      <ul>
        <li><a href="/prompt-maker" style={{ color: "#6fb0ff" }}>Prompt Maker</a></li>
        <li><a href="/website-maker" style={{ color: "#6fb0ff" }}>Website Maker</a></li>
      </ul>
    </main>
  );
}
