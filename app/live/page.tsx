// src/app/page.tsx
"use client";

import { useState } from "react";

const CHANNEL_IFRAME =
  "https://www.youtube.com/embed/50IfZsR7l_M?si=Gg1TYUMbYO-fOf38"

export default function Home() {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !location) {
      setMsg("Fill both email and location.");
      return;
    }

    // demo: local fake "register" — in real project, POST to your /register endpoint
    setMsg(`Registered ${email} for alerts at ${location}`);
    setEmail("");
    setLocation("");
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.logo}>🛕</div>
          <div>
            <h1 style={styles.title}>Monastery360 — Live</h1>
            <div style={styles.subtitle}>Live rituals, tours & ceremonies</div>
          </div>
        </div>
        <nav style={styles.nav}>
          <a href="#live" style={styles.navLink}>Live</a>
          <a href="#register" style={styles.navLink}>Alerts</a>
        </nav>
      </header>

      <section id="live" style={styles.liveSection}>
        <div style={styles.iframeWrap}>
          <iframe
            width="100%"
            height="100%"
            src={CHANNEL_IFRAME}
            title="Monastery Live"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 12 }}
          />
        </div>

        <aside style={styles.side}>
          <div style={styles.box}>
            <h3 style={{ margin: 0 }}>Live Now</h3>
            <p style={{ color: "#666", marginTop: 6 }}>
              Watch live spiritual events from Sikkim monasteries.
            </p>
            <div style={{ marginTop: 12 }}>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#e53935" }}>● LIVE</span>
            </div>
          </div>

          <div style={{ ...styles.box, marginTop: 14 }}>
            <h4 style={{ margin: 0 }}>Quick Actions</h4>
            <button style={styles.btn} onClick={() => window.open(window.location.href)}>
              Open in YouTube
            </button>
            <button
              style={{ ...styles.btn, background: "#444", marginTop: 8 }}
              onClick={() => {
                setMsg("Share this URL with your viewers.");
              }}
            >
              Share Stream
            </button>
          </div>
        </aside>
      </section>

      <section id="register" style={styles.registerSection}>
        <div style={styles.registerBox}>
          <h3>Get Emergency Alerts</h3>
          <p style={{ color: "#666" }}>
            Register your email & location to receive SOS / disaster alerts.
          </p>

          <form onSubmit={handleRegister} style={{ marginTop: 12 }}>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              type="email"
              required
            />
            <input
              placeholder="Location (e.g. Gangtok)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.primaryBtn}>
              Register for Alerts
            </button>
          </form>

          {msg && <div style={styles.msg}>{msg}</div>}
        </div>

        <div style={styles.infoBox}>
          <h4 style={{ marginTop: 0 }}>Why register?</h4>
          <ul>
            <li>Receive immediate emails when danger is detected</li>
            <li>Location-specific alerts (Sikkim region)</li>
            <li>Offline-friendly options planned</li>
          </ul>
        </div>
      </section>

      <footer style={styles.footer}>
        © Monastery360 — Demo · Live stream via YouTube/OBS
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f7fb",
    color: "#111",
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid #eee",
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    background: "#fce8d6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
  },
  title: { margin: 0, fontSize: 20 },
  subtitle: { color: "#666", fontSize: 13 },
  nav: { display: "flex", gap: 12 },
  navLink: { color: "#333", textDecoration: "none", fontSize: 14 },
  liveSection: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 24,
    padding: 28,
    alignItems: "start",
  },
  iframeWrap: {
    width: "100%",
    height: 520,
    background: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  side: { display: "flex", flexDirection: "column" },
  box: {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(20,20,40,0.06)",
  },
  btn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    background: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  registerSection: {
    display: "flex",
    gap: 20,
    padding: "0 28px 40px 28px",
  },
  registerBox: {
    flex: 1,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(20,20,40,0.06)",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  primaryBtn: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 8,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  msg: { marginTop: 12, color: "#2e7d32" },
  infoBox: {
    width: 320,
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(20,20,40,0.06)",
    color: "#333",
  },
  footer: {
    padding: 20,
    textAlign: "center",
    color: "#777",
    borderTop: "1px solid #eee",
  },
};