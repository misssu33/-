import { mkdir } from "node:fs/promises";
import type { Job } from "bullmq";
import { convertMedia, estimateProgressPercent, probeMedia } from "@motiondot/ffmpeg";
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

  const onProgress = (percent: number) => {
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
  };

  const useInline =
    process.env.MOTIONDOT_INLINE_FFMPEG === "1" ||
    process.env.MOTIONDOT_INLINE_FFMPEG === "true";

  let success: boolean;
  let exitCode: number;
  let errorMessage: string | undefined;

  if (useInline) {
    const inline = await convertMedia({
      sourcePath: source,
      outputPath: output,
      presetId: job.data.presetId,
      format: job.data.outputFormat,
      ffmpegPath: config.ffmpegPath,
      presetOverrides: job.data.presetOverrides,
      onStderr: (chunk) => {
        const percent = estimateProgressPercent(chunk, probe.durationSec ?? null);
        if (percent !== null) onProgress(percent);
      },
    });
    success = inline.success;
    exitCode = inline.exitCode;
  } else {
    const pool = getFfmpegThreadPool(config.threadPoolSize, config.ffmpegPath);
    const result = await pool.run({
      sourcePath: source,
      outputPath: output,
      presetId: job.data.presetId,
      format: job.data.outputFormat,
      ffmpegPath: config.ffmpegPath,
      durationSec: probe.durationSec,
      presetOverrides: job.data.presetOverrides,
      onProgress,
    });
    success = result.success;
    exitCode = result.exitCode;
    errorMessage = result.errorMessage;
  }

  if (!success) {
    await store.updateItem(job.data.batchId, job.data.itemId, {
      status: "failed",
      progress: 0,
      errorMessage: errorMessage ?? `exit ${exitCode}`,
    });
    throw new Error(errorMessage ?? `Conversion failed (exit ${exitCode})`);
  }

  await store.updateItem(job.data.batchId, job.data.itemId, {
    status: "completed",
    progress: 100,
    outputPath: output,
  });

  await job.updateProgress(100);
}
