// Mirrors what batch_generate_walkthrough.py does, but as a server-side
// Node module so the website's backend can queue a job on your ComfyUI pod
// after a customer pays.
//
// IMPORTANT: this assumes your pod is running and reachable at COMFY_URL.
// If your pod is stopped to save cost between customers, jobs submitted
// here will fail. See README.md for the two ways to handle that.

import fs from "fs/promises";
import path from "path";

const COMFY_URL = process.env.COMFY_URL!;

// Load your fixed workflow template once. Keep video_wan2_2_14B_i2v.json
// (the version with the SaveImage node wired to VAE Decode) in this same
// lib/ folder, or point WORKFLOW_PATH elsewhere.
const WORKFLOW_PATH = path.join(process.cwd(), "lib", "video_wan2_2_14B_i2v.json");

const LOAD_IMAGE_CLASS_TYPE = "LoadImage";
const IMAGE_TO_VIDEO_CLASS_TYPE = "WanImageToVideo";
const SAVE_IMAGE_CLASS_TYPE = "SaveImage";

function findNodeByClassType(workflow: Record<string, any>, classType: string): string | null {
  for (const [nodeId, node] of Object.entries(workflow)) {
    if (node?.class_type === classType) return nodeId;
  }
  return null;
}

export async function uploadImageToComfy(fileBuffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const form = new FormData();
  form.append("image", new Blob([fileBuffer], { type: mimeType }), filename);

  const res = await fetch(`${COMFY_URL}/upload/image`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`ComfyUI upload failed: ${res.status}`);
  const data = await res.json();
  return data.name as string;
}

export async function queueVideoJob(uploadedImageName: string): Promise<string> {
  const raw = await fs.readFile(WORKFLOW_PATH, "utf-8");
  const workflow = JSON.parse(raw);

  const loadImageId = findNodeByClassType(workflow, LOAD_IMAGE_CLASS_TYPE);
  const saveImageId = findNodeByClassType(workflow, SAVE_IMAGE_CLASS_TYPE);
  const i2vId = findNodeByClassType(workflow, IMAGE_TO_VIDEO_CLASS_TYPE);

  if (!loadImageId) throw new Error("Workflow is missing a LoadImage node.");
  if (!saveImageId) throw new Error("Workflow is missing a SaveImage node (see project notes).");

  workflow[loadImageId].inputs.image = uploadedImageName;

  // Randomize seeds so repeat customers with similar photos don't get
  // identical motion.
  for (const node of Object.values<any>(workflow)) {
    if (!node?.inputs) continue;
    for (const seedKey of ["noise_seed", "seed"]) {
      if (typeof node.inputs[seedKey] === "number") {
        node.inputs[seedKey] = Math.floor(Math.random() * 2 ** 32);
      }
    }
  }

  const res = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow }),
  });
  if (!res.ok) throw new Error(`ComfyUI queue failed: ${res.status}`);
  const data = await res.json();
  return data.prompt_id as string;
}

export async function checkJobHistory(promptId: string): Promise<any | null> {
  const res = await fetch(`${COMFY_URL}/history/${promptId}`);
  if (!res.ok) throw new Error(`ComfyUI history check failed: ${res.status}`);
  const history = await res.json();
  return history[promptId] ?? null;
}

export async function downloadFrames(historyEntry: any): Promise<{ filename: string; subfolder: string; type: string }[]> {
  const frames: { filename: string; subfolder: string; type: string }[] = [];
  const outputs = historyEntry.outputs ?? {};
  for (const nodeOutput of Object.values<any>(outputs)) {
    for (const item of nodeOutput.images ?? []) {
      frames.push(item);
    }
  }
  return frames;
}

export function comfyViewUrl(item: { filename: string; subfolder: string; type: string }): string {
  const params = new URLSearchParams({
    filename: item.filename,
    subfolder: item.subfolder ?? "",
    type: item.type ?? "output",
  });
  return `${COMFY_URL}/view?${params.toString()}`;
}
