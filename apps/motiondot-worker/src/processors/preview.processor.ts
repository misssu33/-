import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Job } from "bullmq";
import { buildFastPreview } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import {
  publishItemProgress,
  getDeliveryStateStore,
} from "@motiondot/queue";
import type { BatchPreviewJobData } from "@motiondot/queue";
import { toDeliveryFile } from "@motiondot/delivery";
import type { WorkerConfig } from "../config/worker.config";

/** 배치 프리뷰 — 파일별 fast MP4 생성 */
export async function processPreviewJob(
  job: Job<BatchPreviewJobData | { jobId: string; sourcePath: string; previewPath: string }>,
  config: WorkerConfig,
): Promise<void> {
  if (!isBatchPreview(job.data)) {
    return processLegacyPreview(job as Job<{ jobId: string; sourcePath: string; previewPath: string }>, config);
  }

  const data = job.data;
  const paths = createStoragePathManager(config.storageRoot);
  const previewDir = join(paths.bucket("previews"), data.batchId);
  await mkdir(previewDir, { recursive: true });

  const store = getDeliveryStateStore();
  await store.updatePreview(data.batchId, { status: "processing", files: [] });

  const files = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const previewPath = join(previewDir, `${item.itemId}.mp4`);

    await publishItemProgress({
      batchId: data.batchId,
      itemId: item.itemId,
      percent: Math.round(((i + 1) / data.items.length) * 100),
      batchPercent: Math.round(((i + 1) / data.items.length) * 50),
      phase: "preview",
      message: item.originalName,
    });

    const result = await buildFastPreview({
      sourcePath: item.sourcePath,
      outputPath: previewPath,
      ffmpegPath: config.ffmpegPath,
    });

    if (!result.success) {
      await store.updatePreview(data.batchId, {
        status: "failed",
        errorMessage: `Preview failed: ${item.originalName}`,
      });
      throw new Error(`Preview failed for ${item.itemId}`);
    }

    const info = await stat(previewPath);
    files.push(
      toDeliveryFile({
        itemId: item.itemId,
        originalName: item.originalName,
        path: previewPath,
        format: "preview",
        sizeBytes: info.size,
      }),
    );
  }

  await store.updatePreview(data.batchId, {
    status: "ready",
    files,
  });

  await publishItemProgress({
    batchId: data.batchId,
    itemId: data.batchId,
    percent: 100,
    batchPercent: 100,
    phase: "preview",
    message: "Preview ready",
  });
}

function isBatchPreview(data: unknown): data is BatchPreviewJobData {
  return (
    typeof data === "object" &&
    data !== null &&
    "batchId" in data &&
    "items" in data
  );
}

async function processLegacyPreview(
  job: Job<{ jobId: string; sourcePath: string; previewPath: string }>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const previewPath = paths.previewPath(job.data.jobId);
  await mkdir(join(previewPath, ".."), { recursive: true }).catch(() => undefined);

  await buildFastPreview({
    sourcePath: job.data.sourcePath,
    outputPath: previewPath,
    ffmpegPath: config.ffmpegPath,
  });
  await job.updateProgress(100);
}
