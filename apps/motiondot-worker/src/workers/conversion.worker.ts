import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "@motiondot/queue";
import { processConversionJob } from "../processors/conversion.processor";
import type { WorkerConfig } from "../config/worker.config";

export function startConversionWorker(config: WorkerConfig): Worker {
  return new Worker(
    QUEUE_NAMES.CONVERSION,
    async (job) => processConversionJob(job, config),
    {
      connection: getBullMQConnection(),
      concurrency: config.concurrency,
    },
  );
}
