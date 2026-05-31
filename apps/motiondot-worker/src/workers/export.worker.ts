import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "@motiondot/queue";
import { processExportJob } from "../processors/export.processor";
import type { WorkerConfig } from "../config/worker.config";

export function startExportWorker(config: WorkerConfig): Worker {
  return new Worker(
    QUEUE_NAMES.EXPORT,
    async (job) => processExportJob(job, config),
    { connection: getBullMQConnection(), concurrency: config.concurrency },
  );
}
