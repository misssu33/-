import {
  BatchOrchestrator,
  enqueueBatch,
  getBatchStateStore,
} from "@motiondot/queue";
import type { BatchJobMeta, ExportFormat, PresetId } from "@motiondot/shared";
import type { SourceMediaMeta } from "@motiondot/shared";

export interface StartBatchInput {
  batchId: string;
  presetId: PresetId;
  outputFormat: ExportFormat;
  files: SourceMediaMeta[];
}

/** 배치 큐 등록 — BullMQ batch → conversion fan-out */
export async function startBatchQueue(
  input: StartBatchInput,
): Promise<BatchJobMeta> {
  if (input.files.length === 0) {
    throw new Error("No uploaded files in batch");
  }

  const payload = BatchOrchestrator.buildPayload({
    batchId: input.batchId,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    files: input.files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      storagePath: f.storagePath,
    })),
  });

  await enqueueBatch(payload);

  const snapshot = await getBatchStateStore().getBatch(input.batchId);
  if (!snapshot) {
    throw new Error("Failed to initialize batch state");
  }
  return snapshot;
}

export async function getBatchQueueStatus(
  batchId: string,
): Promise<BatchJobMeta | null> {
  return getBatchStateStore().getBatch(batchId);
}
