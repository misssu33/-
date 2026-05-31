import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "@motiondot/queue";
import { processPreviewJob } from "../processors/preview.processor";
import type { WorkerConfig } from "../config/worker.config";

export function startPreviewWorker(config: WorkerConfig): Worker {
  return new Worker(
    QUEUE_NAMES.PREVIEW,
    async (job) => processPreviewJob(job, config),
    { connection: getBullMQConnection(), concurrency: 1 },
  );
}
