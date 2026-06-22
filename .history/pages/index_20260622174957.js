import { useState } from "react";
import Head from "next/head";

const TONES = ["Professional", "Friendly", "Casual", "Bold & Direct", "Warm & Empathetic"];

export default function Home() {
  const [type, setType] = useState("email");
  const [form, setForm] = useState({
    yourName: "",
    yourRole: "",
    yourCompany: "",
    prospectName: "",
    prospectRole: "",
    prospectCompany: "",
    goal: "",
    tone: "Professional",
    context: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.yourName || !form.prospectName || !form.goal) {
      setError("Please fill in your name, prospect name, and goal.");
      return;
    }
    setError("");
    setResult("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...form }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResult("");
    setError("");
    setForm({
      yourName: "",
      yourRole: "",
      yourCompany: "",
      prospectName: "",
      prospectRole: "",
      prospectCompany: "",
      goal: "",
      tone: "Professional",
      context: "",
    });
  };

  return (
    <>
      <Head>
        <title>Cold Email & LinkedIn DM Writer</title>
        <meta name="description" content="Generate personalized cold emails and LinkedIn DMs instantly using AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>✉</span>
              <span style={styles.logoText}>OutreachAI</span>
            </div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.dhButton}
            >
              Built for Digital Heroes
            </a>
          </div>
        </header>

        {/* Hero */}
        <section style={styles.hero}>
          <p style={styles.heroEyebrow}>AI-Powered Outreach</p>
          <h1 style={styles.heroTitle}>
            Cold Emails & LinkedIn DMs<br />
            that actually get replies
          </h1>
          <p style={styles.heroSub}>
            Fill in a few details. Get a personalized, human-sounding message in seconds.
          </p>
        </section>

        {/* Main card */}
        <main style={styles.main}>
          <div style={styles.card}>

            {/* Type toggle */}
            <div style={styles.toggle}>
              <button
                style={{ ...styles.toggleBtn, ...(type === "email" ? styles.toggleActive : {}) }}
                onClick={() => { setType("email"); setResult(""); setError(""); }}
              >
                ✉ Cold Email
              </button>
              <button
                style={{ ...styles.toggleBtn, ...(type === "linkedin" ? styles.toggleActive : {}) }}
                onClick={() => { setType("linkedin"); setResult(""); setError(""); }}
              >
                💼 LinkedIn DM
              </button>
            </div>

            {/* Form grid */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About You</h2>
              <div style={styles.grid}>
                <Field label="Your Name *" name="yourName" value={form.yourName} onChange={handleChange} placeholder="Alex Johnson" />
                <Field label="Your Role" name="yourRole" value={form.yourRole} onChange={handleChange} placeholder="Founder, Sales Lead…" />
                <Field label="Your Company" name="yourCompany" value={form.yourCompany} onChange={handleChange} placeholder="Acme Inc." />
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About Your Prospect</h2>
              <div style={styles.grid}>
                <Field label="Prospect's Name *" name="prospectName" value={form.prospectName} onChange={handleChange} placeholder="Sarah Chen" />
                <Field label="Their Role" name="prospectRole" value={form.prospectRole} onChange={handleChange} placeholder="Head of Marketing…" />
                <Field label="Their Company" name="prospectCompany" value={form.prospectCompany} onChange={handleChange} placeholder="TechCorp" />
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Message Details</h2>
              <div style={styles.fullField}>
                <label style={styles.label}>Goal / What you want to achieve *</label>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  placeholder="Book a 15-min demo call, get feedback on our product, explore a partnership…"
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.toneRow}>
                <label style={styles.label}>Tone</label>
                <div style={styles.toneOptions}>
                  {TONES.map((t) => (
                    <button
                      key={t}
                      style={{ ...styles.toneChip, ...(form.tone === t ? styles.toneChipActive : {}) }}
                      onClick={() => setForm((p) => ({ ...p, tone: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.fullField}>
                <label style={styles.label}>Extra context <span style={styles.optional}>(optional)</span></label>
                <textarea
                  name="context"
                  value={form.context}
                  onChange={handleChange}
                  placeholder="Mutual connection, recent company news, shared interest, trigger event…"
                  style={styles.textarea}
                  rows={2}
                />
              </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button
              style={{ ...styles.generateBtn, ...(loading ? styles.generateBtnLoading : {}) }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.spinner}>Generating…</span>
              ) : (
                `Generate ${type === "email" ? "Cold Email" : "LinkedIn DM"} →`
              )}
            </button>

            {/* Result */}
            {result && (
              <div style={styles.resultBox}>
                <div style={styles.resultHeader}>
                  <span style={styles.resultLabel}>
                    {type === "email" ? "✉ Your Cold Email" : "💼 Your LinkedIn DM"}
                  </span>
                  <div style={styles.resultActions}>
                    <button style={styles.actionBtn} onClick={handleCopy}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                    <button style={styles.actionBtnGhost} onClick={handleClear}>
                      Clear
                    </button>
                  </div>
                </div>
                <pre style={styles.resultText}>{result}</pre>
                <button
                  style={styles.regenBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  ↺ Regenerate
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <div style={styles.footerCredit}>
              <span>Built by</span>
              <strong style={{ margin: "0 4px" }}>Your Full Name</strong>
              <span>·</span>
              <a href="mailto:your@email.com" style={styles.footerEmail}>your@email.com</a>
            </div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerDH}
            >
              Built for Digital Heroes →
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--surface-2)",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 20px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: "var(--ink)",
    letterSpacing: "-0.5px",
  },
  dhButton: {
    background: "var(--accent)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
  hero: {
    textAlign: "center",
    padding: "56px 20px 36px",
    maxWidth: 700,
    margin: "0 auto",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 5vw, 46px)",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    lineHeight: 1.12,
    color: "var(--ink)",
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 16,
    color: "var(--ink-soft)",
    maxWidth: 480,
    margin: "0 auto",
    lineHeight: 1.7,
  },
  main: {
    flex: 1,
    padding: "0 20px 60px",
  },
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)",
    maxWidth: 860,
    margin: "0 auto",
    padding: "32px",
  },
  toggle: {
    display: "flex",
    background: "var(--surface-2)",
    borderRadius: 10,
    padding: 4,
    gap: 4,
    marginBottom: 28,
    width: "fit-content",
  },
  toggleBtn: {
    padding: "9px 20px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "var(--ink-soft)",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  toggleActive: {
    background: "var(--surface)",
    color: "var(--ink)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
    fontWeight: 600,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--ink-muted)",
    marginBottom: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  divider: {
    height: 1,
    background: "var(--border)",
    margin: "22px 0",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--ink-soft)",
  },
  optional: {
    fontWeight: 400,
    color: "var(--ink-muted)",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid var(--border)",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: "var(--ink)",
    background: "var(--surface)",
    outline: "none",
    transition: "border-color 0.15s",
  },
  fullField: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 16,
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid var(--border)",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: "var(--ink)",
    background: "var(--surface)",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
    transition: "border-color 0.15s",
  },
  toneRow: {
    marginBottom: 16,
  },
  toneOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  toneChip: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1.5px solid var(--border)",
    background: "transparent",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  },
  toneChipActive: {
    borderColor: "var(--accent)",
    background: "var(--accent-soft)",
    color: "var(--accent)",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "background 0.15s, opacity 0.15s",
    letterSpacing: "-0.2px",
  },
  generateBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  resultBox: {
    marginTop: 24,
    border: "1.5px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--border)",
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink-soft)",
  },
  resultActions: {
    display: "flex",
    gap: 8,
  },
  actionBtn: {
    padding: "5px 14px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  actionBtnGhost: {
    padding: "5px 14px",
    background: "transparent",
    color: "var(--ink-soft)",
    border: "1.5px solid var(--border)",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  resultText: {
    padding: "20px",
    fontSize: 14,
    lineHeight: 1.75,
    color: "var(--ink)",
    whiteSpace: "pre-wrap",
    fontFamily: "'Inter', sans-serif",
    background: "var(--surface)",
  },
  regenBtn: {
    width: "100%",
    padding: "10px",
    background: "var(--surface-2)",
    border: "none",
    borderTop: "1px solid var(--border)",
    color: "var(--ink-soft)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "background 0.15s",
  },
  footer: {
    borderTop: "1px solid var(--border)",
    background: "var(--surface)",
    padding: "20px",
  },
  footerInner: {
    maxWidth: 900,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  footerCredit: {
    fontSize: 13,
    color: "var(--ink-soft)",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  footerEmail: {
    color: "var(--accent)",
    fontWeight: 500,
    textDecoration: "none",
  },
  footerDH: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--accent)",
    textDecoration: "none",
  },
};


