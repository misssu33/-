import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Job } from "bullmq";
import { createStoragePathManager } from "@motiondot/shared";
import { publishBatchProgress, getDeliveryStateStore } from "@motiondot/queue";
import type { BatchExportJobData } from "@motiondot/queue";
import { getFfmpegThreadPool } from "../threads/ffmpeg-thread-pool";
import {
  createExportBundle,
  safeZipEntryName,
  toDeliveryFile,
} from "@motiondot/delivery";
import type { WorkerConfig } from "../config/worker.config";

/** 배치 최종 export — 변환·manifest·ZIP */
export async function processExportJob(
  job: Job<BatchExportJobData>,
  config: WorkerConfig,
): Promise<void> {
  const data = job.data;
  const paths = createStoragePathManager(config.storageRoot);
  const outputDir = paths.outputDir(data.batchId);
  await mkdir(outputDir, { recursive: true });

  const store = getDeliveryStateStore();
  await store.updateExport(data.batchId, {
    status: "processing",
    format: data.outputFormat,
    files: [],
  });

  const pool = getFfmpegThreadPool(config.threadPoolSize, config.ffmpegPath);
  const exported: ReturnType<typeof toDeliveryFile>[] = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const outputPath =
      item.existingOutputPath ??
      join(outputDir, `${item.itemId}.${data.outputFormat}`);

    const percent = Math.round(((i + 1) / data.items.length) * 100);
    await publishBatchProgress({
      batchId: data.batchId,
      phase: "export",
      percent,
      message: item.originalName,
    });

    if (!item.existingOutputPath) {
      const result = await pool.run({
        sourcePath: item.sourcePath,
        outputPath,
        presetId: data.presetId,
        format: data.outputFormat,
        ffmpegPath: config.ffmpegPath,
        presetOverrides: data.presetOverrides,
      });
      if (!result.success) {
        await store.updateExport(data.batchId, {
          status: "failed",
          errorMessage: `Export failed: ${item.originalName}`,
        });
        throw new Error(result.errorMessage ?? "Export failed");
      }
    }

    const info = await stat(outputPath);
    exported.push(
      toDeliveryFile({
        itemId: item.itemId,
        originalName: item.originalName,
        path: outputPath,
        format: data.outputFormat,
        sizeBytes: info.size,
      }),
    );
  }

  const zipPath = join(outputDir, `motiondot-${data.batchId}.zip`);
  const bundle = await createExportBundle({
    zipPath,
    files: exported.map((f) => ({
      path: f.path,
      name: safeZipEntryName(f.originalName, f.itemId, data.outputFormat),
    })),
  });

  await store.updateExport(data.batchId, {
    status: "ready",
    files: exported,
    zipPath: bundle.zipPath,
  });

  await publishBatchProgress({
    batchId: data.batchId,
    phase: "done",
    percent: 100,
    message: "Export package ready",
  });
}
