const cardStyle: React.CSSProperties = {
  background: "#0f1a36",
  border: "1px solid #22345f",
  borderRadius: 12,
  padding: 20,
  marginBottom: 16
};

const codeStyle: React.CSSProperties = {
  display: "block",
  whiteSpace: "pre-wrap",
  color: "#b8d4ff",
  marginTop: 8
};

export default function PromptMakerTestPage() {
  return (
    <main style={{ padding: 30, maxWidth: 980, margin: "0 auto" }}>
      <h1>Prompt Maker Test View</h1>
      <p>Use these endpoints to test Phase 1A flows.</p>

      <section style={cardStyle}>
        <h2>Blueprint Endpoint</h2>
        <code style={codeStyle}>POST /api/v1/prompt-maker/blueprint/generations</code>
      </section>

      <section style={cardStyle}>
        <h2>Digital Product Endpoint</h2>
        <code style={codeStyle}>POST /api/v1/prompt-maker/digital-product/generations</code>
      </section>

      <section style={cardStyle}>
        <h2>Auth Header</h2>
        <code style={codeStyle}>x-user-id: {'{your-user-uuid}'}</code>
      </section>
    </main>
  );
}
