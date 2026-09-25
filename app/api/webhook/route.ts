import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getJob, updateJob } from "@/lib/jobStore";
import { uploadImageToComfy, queueVideoJob } from "@/lib/comfyui";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const jobId = session.metadata?.jobId;
    if (jobId) {
      const job = getJob(jobId);
      if (job) {
        updateJob(jobId, { status: "processing", customerEmail: session.customer_details?.email ?? undefined });

        // Fire off generation without blocking the webhook response.
        // NOTE: on serverless platforms (Vercel), a function can be killed
        // once the response is sent. For anything beyond a quick test,
        // move this into a background job/queue (e.g. a cron-polled queue,
        // or a separate always-on worker) rather than relying on this
        // running to completion in the webhook handler.
        generateVideo(jobId).catch((err) => {
          updateJob(jobId, { status: "failed", error: String(err) });
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function generateVideo(jobId: string) {
  const job = getJob(jobId);
  if (!job || !job.photoBuffer) throw new Error("Job or photo missing.");

  const uploadedName = await uploadImageToComfy(job.photoBuffer, job.photoFilename!, job.photoMimeType!);
  const promptId = await queueVideoJob(uploadedName);
  updateJob(jobId, { promptId });
  // Actual completion/download is handled by /api/status polling, which
  // the status page calls periodically.
}
