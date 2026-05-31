import { mkdir } from "node:fs/promises";
import type { Job } from "bullmq";
import { createStoragePathManager } from "@motiondot/shared";
import { publishProgress, getBatchStateStore } from "@motiondot/queue";
import type { ConversionJobData } from "@motiondot/queue";
import type { WorkerConfig } from "../config/worker.config";
import { getFfmpegThreadPool } from "../threads/ffmpeg-thread-pool";

/** conversion 큐 — worker thread에서 ffmpeg 실행 */
export async function processConversionJob(
  job: Job<ConversionJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const source =
    job.data.sourcePath ?? job.data.sourcePaths?.[0];
  if (!source) {
    throw new Error("Missing sourcePath");
  }

  const outputDir = paths.outputDir(job.data.batchId);
  await mkdir(outputDir, { recursive: true });
  const output = `${outputDir}/${job.data.itemId}.${job.data.outputFormat}`;

  const store = getBatchStateStore();
  await store.updateItem(job.data.batchId, job.data.itemId, {
    status: "processing",
    progress: 0,
  });

  await publishProgress({
    jobId: job.data.jobId,
    batchId: job.data.batchId,
    phase: "transcode",
    percent: 0,
    message: job.data.originalName,
    timestamp: new Date().toISOString(),
  });

  const pool = getFfmpegThreadPool(config.threadPoolSize, config.ffmpegPath);
  const result = await pool.run({
    sourcePath: source,
    outputPath: output,
    presetId: job.data.presetId,
    format: job.data.outputFormat,
    ffmpegPath: config.ffmpegPath,
  });

  if (!result.success) {
    await store.updateItem(job.data.batchId, job.data.itemId, {
      status: "failed",
      progress: 0,
      errorMessage: result.errorMessage ?? `exit ${result.exitCode}`,
    });
    throw new Error(
      result.errorMessage ?? `Conversion failed (exit ${result.exitCode})`,
    );
  }

  await store.updateItem(job.data.batchId, job.data.itemId, {
    status: "completed",
    progress: 100,
    outputPath: output,
  });

  await publishProgress({
    jobId: job.data.jobId,
    batchId: job.data.batchId,
    phase: "done",
    percent: 100,
    timestamp: new Date().toISOString(),
  });

  await job.updateProgress(100);
}
