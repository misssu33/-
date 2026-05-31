import { randomUUID } from "node:crypto";
import type { BatchJobPayload, ConversionJobPayload } from "@motiondot/shared";
import { createConversionQueue } from "../queues/conversion.queue";
import { getBatchStateStore } from "../state/batch-state-store";

/**
 * 배치 작업을 N개의 conversion 큐 잡으로 fan-out
 */
export class BatchOrchestrator {
  async dispatch(payload: BatchJobPayload): Promise<void> {
    const store = getBatchStateStore();
    await store.setBatchStatus(payload.batchId, "processing");

    const conversionQueue = createConversionQueue();

    for (const item of payload.items) {
      const conversionPayload: ConversionJobPayload = {
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

      await conversionQueue.add("convert", conversionPayload, {
        jobId: `${payload.batchId}:${item.itemId}`,
      });
    }
  }

  /** 업로드 메타에서 배치 페이로드 조립 */
  static buildPayload(input: {
    batchId: string;
    presetId: BatchJobPayload["presetId"];
    outputFormat: BatchJobPayload["outputFormat"];
    presetOverrides?: BatchJobPayload["presetOverrides"];
    files: { id: string; originalName: string; storagePath: string }[];
  }): BatchJobPayload {
    return {
      batchId: input.batchId,
      presetId: input.presetId,
      outputFormat: input.outputFormat,
      presetOverrides: input.presetOverrides,
      createdAt: new Date().toISOString(),
      items: input.files.map((f) => ({
        itemId: f.id,
        sourcePath: f.storagePath,
        originalName: f.originalName,
      })),
    };
  }

  static newBatchId(): string {
    return randomUUID();
  }
}
