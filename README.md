# AI Listing Video — starter site

## Current state (right now)

The live homepage (`app/page.tsx`) is a **marketing/waitlist site**: hero,
how-it-works, pricing, FAQ, and an email capture form. No payment, no pod
connection required — this part works standalone today.

Emails submitted through the waitlist form are appended to
`waitlist.local.txt` (see `app/api/waitlist/route.ts`). That's fine for
local testing, but **won't persist once deployed to Vercel** (serverless
filesystems reset), so before real launch swap it for something durable —
a Google Sheet via API, Airtable, or a simple database table.

## Already scaffolded, not yet wired in (for later)

These files exist from the earlier planning pass and are ready for when
you're ready to connect the pod — nothing on the live homepage calls them
right now:

- `app/api/checkout/route.ts` + `.env` Stripe keys — creates a Stripe
  Checkout session
- `app/api/webhook/route.ts` — handles successful payment, queues a job
  on your ComfyUI pod
- `app/api/status/[jobId]/route.ts` + `app/status/[jobId]/page.tsx` —
  polls job status and shows the customer their finished video
- `lib/comfyui.ts` — mirrors `batch_generate_walkthrough.py`'s job
  submission logic in Node, for the backend to call directly

When you're ready to turn the waitlist CTA into a real "pay & generate"
flow, swap the `<form>` in `app/page.tsx`'s `Hero()` to submit to
`/api/checkout` (as it did in the previous version) instead of
`/api/waitlist`.

## Setup (for the site as it stands now)

1. `npm install`
2. `npm run dev` to test locally at http://localhost:3000
3. No `.env.local` is required yet — the waitlist flow has no external
   dependencies. `.env.example` still lists the Stripe/pod variables
   you'll need once you reconnect the backend.

## Deploying

Push this to a GitHub repo, then import it into Vercel (vercel.com — free
tier is fine to start). No environment variables are needed for the
current waitlist-only version. Once you're ready for the full flow, add
the Stripe and `COMFY_URL` variables from `.env.example` into Vercel's
project settings, and point a Stripe webhook at
`https://yourdomain.com/api/webhook`.

## What's simplified — fix these before real launch (once you reconnect the pod)

1. **No database.** Jobs would live in an in-memory Map
   (`lib/jobStore.ts`) that resets on every deploy/restart. Swap in a
   real database (Vercel Postgres, Supabase, etc.) before relying on
   this for paying customers.

2. **No ffmpeg assembly step in the server.** The status route currently
   hands back a link to the first raw PNG frame, not the finished CRF-15
   mp4 that `batch_generate_walkthrough.py` produces. You'll want to
   either (a) run the frame-download + ffmpeg-encode step on a small
   always-on worker/server process, or (b) trigger it as a follow-up job
   on the pod itself.

3. **Pod uptime.** Your pod isn't always running. Two realistic options:
   - Keep it running during "business hours" and only accept orders then
   - Accept orders any time, queue them, and auto-start the pod when a
     job comes in

4. **No email notifications yet** for finished videos, once that flow is
   live — wire up something like Resend or Postmark.

5. **Long-running serverless functions.** Vercel's default functions have
   execution time limits — move actual video generation into a proper
   background worker/queue rather than a serverless function.

6. **No auth/rate limiting** on the API routes.
