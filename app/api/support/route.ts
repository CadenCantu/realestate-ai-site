import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// MVP storage: appends to a local file, same approach as the waitlist route.
// Won't persist once deployed to Vercel (serverless filesystems are
// ephemeral) — swap for email delivery (e.g. Resend) or a database before
// relying on this for real customer support.

const SUPPORT_FILE = path.join(process.cwd(), "support-messages.local.txt");

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const entry = `[${new Date().toISOString()}] ${name || "(no name)"} <${email}>: ${message.replace(/\n/g, " ")}\n`;

  try {
    await fs.appendFile(SUPPORT_FILE, entry);
  } catch {
    // Non-fatal for the MVP.
  }

  return NextResponse.json({ ok: true });
}
