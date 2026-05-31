import { mkdir } from "node:fs/promises";
import type { Job } from "bullmq";
import { probeMedia } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import { publishItemProgress, getBatchStateStore } from "@motiondot/queue";
import type { ConversionJobData } from "@motiondot/queue";
import type { WorkerConfig } from "../config/worker.config";
import { getFfmpegThreadPool } from "../threads/ffmpeg-thread-pool";

/** conversion 큐 — worker thread ffmpeg + 실시간 item/batch progress */
export async function processConversionJob(
  job: Job<ConversionJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const source = job.data.sourcePath ?? job.data.sourcePaths?.[0];
  if (!source) throw new Error("Missing sourcePath");

  const outputDir = paths.outputDir(job.data.batchId);
  await mkdir(outputDir, { recursive: true });
  const output = `${outputDir}/${job.data.itemId}.${job.data.outputFormat}`;

  const store = getBatchStateStore();
  const probe = await probeMedia(source, config.ffmpegPath);

  await store.updateItem(job.data.batchId, job.data.itemId, {
    status: "processing",
    progress: 0,
  });

  const pool = getFfmpegThreadPool(config.threadPoolSize, config.ffmpegPath);
  const result = await pool.run({
    sourcePath: source,
    outputPath: output,
    presetId: job.data.presetId,
    format: job.data.outputFormat,
    ffmpegPath: config.ffmpegPath,
    durationSec: probe.durationSec,
    presetOverrides: job.data.presetOverrides,
    onProgress: (percent) => {
      void (async () => {
        const batch = await store.updateItem(
          job.data.batchId,
          job.data.itemId,
          { status: "processing", progress: percent },
        );
        await publishItemProgress({
          batchId: job.data.batchId,
          itemId: job.data.itemId,
          percent,
          batchPercent: batch?.progress ?? percent,
          message: job.data.originalName,
        });
      })();
    },
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

  await job.updateProgress(100);
}
