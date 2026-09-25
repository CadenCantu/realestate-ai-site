import { NextRequest, NextResponse } from "next/server";

// Sends each waitlist signup to Formspree, which stores it in your
// dashboard and emails you a notification automatically.
//
// TO SET THIS UP: go to formspree.io, create a free account, create a
// new form, and paste the endpoint URL it gives you below, replacing
// the placeholder. It looks like: https://formspree.io/f/abcd1234
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnpnzopn";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, source: "Can2 waitlist" }),
    });

    if (!res.ok) {
      throw new Error(`Formspree responded with ${res.status}`);
    }
  } catch (err) {
    // Formspree being unreachable shouldn't break the user's experience,
    // but you won't see this signup if it fails. Worth checking your
    // Formspree dashboard occasionally, or adding real error alerting later.
    console.error("Failed to forward waitlist signup to Formspree:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
