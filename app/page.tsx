"use client";

import { useState } from "react";

export default function Home() {
  return (
    <main style={styles.main}>
      <Nav />
      <Hero />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav style={styles.nav} className="nav">
      <img src="/logo-white.jpg" alt="Can2" style={{ maxWidth: 400, width: "100%", height: "auto" }} />
      <p style={styles.tagline} className="tagline">Because you can too</p>
    </nav>
  );
}

function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong — try again.");
    }
  }

  return (
    <section style={{ ...styles.section, textAlign: "center", paddingTop: "1.5rem", paddingBottom: "0" }} className="section">
      <span style={styles.eyebrow}>CAN2 Serives</span>
      <h1 style={styles.h1} className="h1">Turn house photos into a high resolution video in minutes</h1>
      <p style={styles.sub} className="sub">
        Upload a room photo, and get back a smooth, professional AI-animated
        video — no camera crew, no editing software, no expensive videos,
        ready to post same day.
      </p>

      {!submitted ? (
        <>
          <div style={styles.emailRow} className="email-row">
            <div style={styles.stepBadge}>1</div>
            <form onSubmit={handleSubmit} style={styles.waitlistForm} className="waitlist-form">
              <input
                type="email"
                placeholder="you@youragency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.emailInput} className="email-input"
              />
              <button type="submit" style={styles.button}>
                It starts here
              </button>
            </form>
          </div>
           <div style={styles.emailRow} className="email-row">
              <div style={styles.stepBadge}>2</div>
          <label style={styles.dropzone}>
            {photo ? (
               <span>
                {photo.name}{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setPhoto(null); }}
                  style={{ marginLeft: "0.5rem", background: "none", border: "none", color: "#f87171", cursor: "pointer", textDecoration: "underline" }}
                >
                  remove
                </button>
              </span>
            ) : (
              <span>Click to upload a room photo (JPG, PNG, or WEBP)</span>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
          </div>
        </>
      ) : (
        <p style={styles.successMsg}>You're on the list — we'll email you when it opens.</p>
      )}
      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.fineprint}>No spam. One email when we launch.</p>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Add email", desc: "Enter your email so we can send you your finished video." },
    { title: "Upload photos", desc: "Any room photos from your listing — phone shots work fine." },
    { title: "We animate it", desc: "Our AI generates a smooth, realistic camera pan through the space." },
    { title: "Download & post", desc: "Get a ready-to-share clip back in your inbox, usually within minutes." },
  ];
  return (
    <section style={{ ...styles.section, paddingTop: "1rem" }} className="section">
      <h2 style={styles.h2}>How it works</h2>
      <div style={styles.stepsGrid} className="steps-grid">
        {steps.map((s, i) => (
          <div key={s.title} style={styles.stepCard}>
            <div style={styles.stepNumber}>{i + 1}</div>
            <h3 style={styles.stepTitle}>{s.title}</h3>
            <p style={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section style={styles.section} className="section">
      <h2 style={styles.h2}>Simple pricing</h2>
      <div style={styles.pricingCard} className="pricing-card">
        <p style={styles.price} className="price">$50</p>
        <p style={styles.priceUnit}>per video</p>
        <ul style={styles.priceList}>
          <li>Upload as many photos as you need — $50 per video</li>
          <li>Delivered in minutes</li>
          <li>Full resolution download</li>
          <li>No subscription required</li>
        </ul>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What kind of photos work best?", a: "Well-lit interior shots of empty or lightly furnished rooms work best. Very cluttered or dark photos may generate lower-quality results." },
    { q: "How long is each video?", a: "Around 3 seconds per clip — designed to be a punchy addition to a listing reel, not a full walkthrough replacement." },
    { q: "Can I use this for a whole listing?", a: "Yes — once we're out of early access, you'll be able to submit multiple photos from the same listing and get a clip for each." },
  ];
  return (
    <section style={styles.section} className="section">
      <h2 style={styles.h2}>Questions</h2>
      <div style={styles.faqList}>
        {faqs.map((f) => (
          <div key={f.q} style={styles.faqItem}>
            <p style={styles.faqQ}>{f.q}</p>
            <p style={styles.faqA}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={{ color: "#71717a", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} Can2 — built for real estate agents who want video without the video crew.
      </p>
      <a href="/support" style={{ color: "#a1a1aa", fontSize: "0.85rem", textDecoration: "underline" }}>
        Need help? Contact support
      </a>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    background: "#0b0b0f",
    color: "#f5f5f7",
  },
  section: { maxWidth: 720, margin: "0 auto", padding: "4rem 1.5rem" },
  nav: { maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 0", textAlign: "center" },
  logo: { fontSize: "4.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  tagline: { fontSize: "1.4rem", color: "#f5f5f7", fontStyle: "italic", marginTop: "0.5rem" },
  eyebrow: { fontSize: "0.75rem", letterSpacing: "0.08em", color: "#ff5a1f", fontWeight: 700 },
  h1: { fontSize: "2.5rem", margin: "0.75rem 0", lineHeight: 1.15 },
  h2: { fontSize: "1.75rem", marginBottom: "1.5rem", textAlign: "center" },
  sub: { fontSize: "1.1rem", color: "#a1a1aa", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 2rem" },
  emailRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#ff5a1f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    flexShrink: 0,
  },
  waitlistForm: { display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" },
  emailInput: {
    padding: "0.75rem 1rem",
    borderRadius: 8,
    border: "1px solid #3f3f46",
    background: "#161619",
    color: "#f5f5f7",
    fontSize: "1rem",
    minWidth: 260,
  },
  dropzone: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 120,
    border: "1px dashed #3f3f46",
    borderRadius: 8,
    marginTop: "1rem",
    cursor: "pointer",
    color: "#a1a1aa",
    padding: "0 1rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: 8,
    border: "none",
    background: "#ff5a1f",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
  },
  successMsg: { color: "#4ade80", fontWeight: 500 },
  error: { color: "#f87171", fontSize: "0.9rem", marginTop: "0.5rem" },
  fineprint: { fontSize: "0.8rem", color: "#71717a", marginTop: "1rem" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" },
  stepCard: { background: "#161619", border: "1px solid #27272a", borderRadius: 12, padding: "1.5rem" },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#ff5a1f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    marginBottom: "0.75rem",
  },
  stepTitle: { fontSize: "1.05rem", marginBottom: "0.35rem" },
  stepDesc: { fontSize: "0.9rem", color: "#a1a1aa", lineHeight: 1.5 },
  pricingCard: {
    background: "#161619",
    border: "1px solid #27272a",
    borderRadius: 12,
    padding: "2rem",
    textAlign: "center",
    maxWidth: 320,
    margin: "0 auto",
  },
  price: { fontSize: "2.5rem", fontWeight: 700, margin: 0 },
  priceUnit: { color: "#a1a1aa", marginBottom: "1.25rem" },
  priceList: { listStyle: "none", padding: 0, color: "#d4d4d8", lineHeight: 2, fontSize: "0.95rem" },
  faqList: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  faqItem: { borderBottom: "1px solid #27272a", paddingBottom: "1.25rem" },
  faqQ: { fontWeight: 600, marginBottom: "0.35rem" },
  faqA: { color: "#a1a1aa", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 },
  footer: { textAlign: "center", padding: "2rem 1.5rem" },
};
