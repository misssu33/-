import type { Job } from "bullmq";
import { createStoragePathManager } from "@motiondot/shared";
import { publishProgress } from "@motiondot/queue";
import type { PreviewJobData } from "@motiondot/queue";
import type { WorkerConfig } from "../config/worker.config";

/** preview 큐 — 저해상도 프리뷰 MP4 생성 (Remotion/ ffmpeg 연동 예정) */
export async function processPreviewJob(
  job: Job<PreviewJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const previewPath = paths.previewPath(job.data.jobId);

  await publishProgress({
    scope: "item",
    jobId: job.data.jobId,
    batchId: job.data.jobId,
    itemId: job.data.jobId,
    phase: "preview",
    percent: 10,
    timestamp: new Date().toISOString(),
  });

  // TODO: ffmpeg fast preview 또는 Remotion renderStill
  void previewPath;
  await job.updateProgress(100);
}
