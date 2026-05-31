import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { BatchJobPayload } from "@motiondot/shared";
import { convertMedia } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import { getBatchStateStore } from "@motiondot/queue";
import type { WorkerConfig } from "@motiondot/worker/config/worker.config";

/**
 * BullMQ·worker_threads 없이 메인 스레드에서 변환
 * (동일 ffmpeg 파이프라인 + Redis 배치 상태 검증)
 */
export async function runDirectConversion(
  payload: BatchJobPayload,
  item: BatchJobPayload["items"][0],
  config: WorkerConfig,
): Promise<string> {
  const store = getBatchStateStore();
  await store.initBatch(payload);

  const paths = createStoragePathManager(config.storageRoot);
  const outputDir = paths.outputDir(payload.batchId);
  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, `${item.itemId}.${payload.outputFormat}`);

  await store.updateItem(payload.batchId, item.itemId, {
    status: "processing",
    progress: 0,
  });

  const result = await convertMedia({
    sourcePath: item.sourcePath,
    outputPath,
    presetId: payload.presetId,
    format: payload.outputFormat,
    ffmpegPath: config.ffmpegPath,
    presetOverrides: payload.presetOverrides,
  });

  if (!result.success) {
    await store.updateItem(payload.batchId, item.itemId, {
      status: "failed",
      progress: 0,
      errorMessage: `exit ${result.exitCode}`,
    });
    throw new Error(`Conversion failed with exit ${result.exitCode}`);
  }

  await store.updateItem(payload.batchId, item.itemId, {
    status: "completed",
    progress: 100,
    outputPath,
  });

  return outputPath;
}
