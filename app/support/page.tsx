"use client";

import { useState } from "react";

export default function Support() {
  return (
    <main style={styles.main}>
      <div style={styles.section}>
        <a href="/" style={styles.backLink}>← Back to Can2</a>
        <h1 style={styles.h1}>Customer Support</h1>
        <p style={styles.sub}>
          Questions about your video, a photo that didn't upload, or anything
          else — send us a message and we'll get back to you.
        </p>

        <ContactForm />
        <HelpTopics />
      </div>
    </main>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (!message.trim()) {
      setError("Enter a message.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong — try again.");
    }
  }

  if (submitted) {
    return (
      <div style={styles.card}>
        <p style={styles.successMsg}>
          Thanks — your message was sent. We'll reply to your email soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <label style={styles.label}>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          placeholder="Your name"
        />
      </label>

      <label style={styles.label}>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="you@youragency.com"
        />
      </label>

      <label style={styles.label}>
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
          placeholder="How can we help?"
          rows={5}
        />
      </label>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" style={styles.button}>
        Send message
      </button>
    </form>
  );
}

function HelpTopics() {
  const topics = [
    { q: "My video hasn't arrived yet", a: "Videos are usually delivered within a few minutes to an hour. If it's been longer than that, send us a message above with the email you used to order and we'll check on it." },
    { q: "My photo didn't upload correctly", a: "Make sure it's a JPG, PNG, or WEBP file under a reasonable size. If it still fails, try a different photo or contact us and we'll help sort it out." },
    { q: "I want a refund", a: "If your video didn't turn out right, message us with your order email and we'll make it right — either a redo or a refund." },
    { q: "Can I request changes to a video?", a: "Right now each order produces one video per photo. If something looks off, reach out and we'll take a look." },
  ];

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2 style={styles.h2}>Common questions</h2>
      <div style={styles.faqList}>
        {topics.map((t) => (
          <div key={t.q} style={styles.faqItem}>
            <p style={styles.faqQ}>{t.q}</p>
            <p style={styles.faqA}>{t.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    background: "#0b0b0f",
    color: "#f5f5f7",
  },
  section: { maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem" },
  backLink: { color: "#a1a1aa", fontSize: "0.9rem", textDecoration: "none" },
  h1: { fontSize: "2rem", margin: "1rem 0 0.5rem" },
  h2: { fontSize: "1.4rem", marginBottom: "1.25rem" },
  sub: { fontSize: "1rem", color: "#a1a1aa", lineHeight: 1.6, marginBottom: "2rem" },
  card: {
    background: "#161619",
    border: "1px solid #27272a",
    borderRadius: 12,
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  label: { display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.9rem", color: "#d4d4d8" },
  input: {
    padding: "0.7rem 0.9rem",
    borderRadius: 8,
    border: "1px solid #3f3f46",
    background: "#0b0b0f",
    color: "#f5f5f7",
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.7rem 0.9rem",
    borderRadius: 8,
    border: "1px solid #3f3f46",
    background: "#0b0b0f",
    color: "#f5f5f7",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    padding: "0.85rem 1.5rem",
    borderRadius: 8,
    border: "none",
    background: "#ff5a1f",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
  },
  successMsg: { color: "#4ade80", fontWeight: 500 },
  error: { color: "#f87171", fontSize: "0.9rem" },
  faqList: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  faqItem: { borderBottom: "1px solid #27272a", paddingBottom: "1.25rem" },
  faqQ: { fontWeight: 600, marginBottom: "0.35rem" },
  faqA: { color: "#a1a1aa", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 },
};
