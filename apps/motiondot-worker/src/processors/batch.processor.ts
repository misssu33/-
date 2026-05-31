import type { Job } from "bullmq";
import { BatchOrchestrator } from "@motiondot/queue";
import type { BatchJobData } from "@motiondot/queue";
import { getBatchStateStore } from "@motiondot/queue";

/** batch 큐 — conversion 잡 fan-out 오케스트레이션 */
export async function processBatchJob(job: Job<BatchJobData>): Promise<void> {
  const orchestrator = new BatchOrchestrator();

  if ("phase" in job.data && (job.data as { phase?: string }).phase === "finalize") {
    const store = getBatchStateStore();
    const batch = await store.getBatch(job.data.batchId);
    if (batch && batch.status !== "completed" && batch.status !== "failed") {
      await store.setBatchStatus(job.data.batchId, "completed");
    }
    return;
  }

  await orchestrator.dispatch(job.data);
  await job.updateProgress(100);
}
