"use client";

import { useEffect, useState } from "react";

export default function StatusPage({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status/${params.jobId}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(interval);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [params.jobId]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", background: "#0b0b0f", color: "#f5f5f7", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        {!job && "Payment confirmed — starting your video..."}
        {job?.status === "processing" && "Generating your video..."}
        {job?.status === "done" && "Your video is ready!"}
        {job?.status === "failed" && "Something went wrong."}
      </h1>

      {job?.status === "done" && job.videoUrl && (
        <a href={job.videoUrl} style={{ color: "#ff5a1f" }} target="_blank" rel="noreferrer">
          Download your video
        </a>
      )}

      {job?.status === "failed" && (
        <p style={{ color: "#f87171" }}>{job.error ?? "Please contact support."}</p>
      )}

      {(!job || job.status === "processing") && (
        <p style={{ color: "#a1a1aa", marginTop: "0.5rem" }}>
          This usually takes 5-15 minutes. You can close this tab — we'll also email you.
        </p>
      )}
    </main>
  );
}
