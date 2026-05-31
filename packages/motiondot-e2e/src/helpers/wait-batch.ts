import type { BatchJobMeta } from "@motiondot/shared";
import { getBatchStateStore } from "@motiondot/queue";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Redis 배치 스냅샷이 terminal 상태가 될 때까지 대기 */
export async function waitForBatchComplete(
  batchId: string,
  options: { timeoutMs?: number; pollMs?: number } = {},
): Promise<BatchJobMeta> {
  const timeoutMs = options.timeoutMs ?? 120_000;
  const pollMs = options.pollMs ?? 400;
  const store = getBatchStateStore();
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const batch = await store.getBatch(batchId);
    if (!batch) {
      throw new Error(`Batch ${batchId} not found in Redis`);
    }

    if (batch.status === "completed") {
      return batch;
    }

    if (batch.status === "failed") {
      const errors = batch.items
        .filter((i) => i.errorMessage)
        .map((i) => `${i.originalName}: ${i.errorMessage}`)
        .join("; ");
      throw new Error(`Batch failed: ${errors || "unknown"}`);
    }

    await sleep(pollMs);
  }

  throw new Error(`Batch ${batchId} timed out after ${timeoutMs}ms`);
}
