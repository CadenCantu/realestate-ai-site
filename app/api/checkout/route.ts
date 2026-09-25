import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { createJob } from "@/lib/jobStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const photo = formData.get("photo") as File | null;

  if (!photo) {
    return NextResponse.json({ error: "No photo provided." }, { status: 400 });
  }

  const jobId = randomUUID();
  const buffer = Buffer.from(await photo.arrayBuffer());

  createJob({
    id: jobId,
    status: "awaiting_payment",
    photoBuffer: buffer,
    photoFilename: photo.name,
    photoMimeType: photo.type || "image/png",
  });

  const priceCents = Number(process.env.VIDEO_PRICE_CENTS ?? "2500");
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "AI listing walkthrough video" },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: { jobId },
    success_url: `${origin}/status/${jobId}`,
    cancel_url: `${origin}/`,
  });

  return NextResponse.json({ url: session.url });
}
