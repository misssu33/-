import type { BatchJobPayload } from "@motiondot/shared";
import { createBatchQueue } from "../queues/batch.queue";
import { getBatchStateStore } from "../state/batch-state-store";

export type BatchJobData = BatchJobPayload;

export async function enqueueBatch(data: BatchJobData): Promise<string> {
  await getBatchStateStore().initBatch(data);
  const queue = createBatchQueue();
  const job = await queue.add("orchestrate", data, { jobId: data.batchId });
  return job.id ?? data.batchId;
}
