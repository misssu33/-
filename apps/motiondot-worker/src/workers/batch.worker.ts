import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "@motiondot/queue";
import { processBatchJob } from "../processors/batch.processor";
import type { WorkerConfig } from "../config/worker.config";

export function startBatchWorker(config: WorkerConfig): Worker {
  return new Worker(
    QUEUE_NAMES.BATCH,
    async (job) => processBatchJob(job),
    {
      connection: getBullMQConnection(),
      concurrency: 2,
    },
  );
}
