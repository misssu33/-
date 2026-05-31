import type { Job } from "bullmq";
import type { BatchJobPayload } from "@motiondot/shared";
import { getBatchStateStore } from "@motiondot/queue";
import type { ConversionJobData } from "@motiondot/queue";
import { processConversionJob } from "@motiondot/worker/processors/conversion.processor";
import type { WorkerConfig } from "@motiondot/worker/config/worker.config";

function mockJob<T>(data: T): Job<T> {
  return {
    data,
    updateProgress: async () => undefined,
  } as Job<T>;
}

/** 실제 conversion.processor 경로 (BullMQ 없음) */
export async function runProcessorConversion(
  payload: BatchJobPayload,
  item: BatchJobPayload["items"][0],
  config: WorkerConfig,
  options?: { skipInit?: boolean },
): Promise<string> {
  const store = getBatchStateStore();
  if (!options?.skipInit) {
    await store.initBatch(payload);
  }

  const jobData: ConversionJobData = {
    jobId: item.itemId,
    itemId: item.itemId,
    batchId: payload.batchId,
    sourcePath: item.sourcePath,
    originalName: item.originalName,
    presetId: payload.presetId,
    outputFormat: payload.outputFormat,
    presetOverrides: payload.presetOverrides,
    createdAt: payload.createdAt,
  };

  await processConversionJob(mockJob(jobData), config);

  const batch = await store.getBatch(payload.batchId);
  const row = batch?.items.find((i) => i.itemId === item.itemId);
  if (!row?.outputPath) {
    throw new Error(row?.errorMessage ?? "Conversion produced no output path");
  }
  return row.outputPath;
}
