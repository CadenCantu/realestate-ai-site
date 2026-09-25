import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { checkJobHistory, downloadFrames, comfyViewUrl } from "@/lib/comfyui";

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
  const job = getJob(params.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  if (job.status === "done" || job.status === "failed") {
    return NextResponse.json(job);
  }

  if (job.status === "processing" && job.promptId) {
    try {
      const history = await checkJobHistory(job.promptId);
      if (history) {
        const frames = await downloadFrames(history);
        if (frames.length > 0) {
          // NOTE: this MVP just hands back links to the first frame's PNG
          // rather than the assembled CRF-15 mp4 — wiring the ffmpeg
          // assembly step into the server (or triggering it on the pod
          // itself) is the next piece to build before this is customer-
          // ready. See README.md.
          const frameUrls = frames.map(comfyViewUrl);
          updateJob(params.jobId, { status: "done", videoUrl: frameUrls[0] });
        }
      }
    } catch (err) {
      // Keep polling — pod may just be mid-job.
    }
  }

  return NextResponse.json(getJob(params.jobId));
}
