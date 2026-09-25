// Extremely simple in-memory store so the MVP works without a database.
// WARNING: this resets whenever your server restarts or redeploys, and
// won't work correctly if you're running multiple server instances.
// Swap this for a real database (e.g. Postgres via Vercel, or Supabase)
// before you take real customer money at any volume.

type Job = {
  id: string;
  status: "awaiting_payment" | "paid" | "processing" | "done" | "failed";
  photoBuffer?: Buffer;
  photoFilename?: string;
  photoMimeType?: string;
  promptId?: string;
  videoUrl?: string;
  error?: string;
  customerEmail?: string;
};

const jobs = new Map<string, Job>();

export function createJob(job: Job) {
  jobs.set(job.id, job);
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<Job>) {
  const existing = jobs.get(id);
  if (!existing) return;
  jobs.set(id, { ...existing, ...patch });
}
