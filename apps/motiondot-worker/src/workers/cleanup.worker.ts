import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "@motiondot/queue";
import { processCleanupJob } from "../processors/cleanup.processor";
import type { WorkerConfig } from "../config/worker.config";

export function startCleanupWorker(config: WorkerConfig): Worker {
  return new Worker(
    QUEUE_NAMES.CLEANUP,
    async (job) => processCleanupJob(job, config),
    { connection: getBullMQConnection(), concurrency: 1 },
  );
}
