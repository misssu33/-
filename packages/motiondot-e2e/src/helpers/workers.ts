import type { Worker } from "bullmq";
import type { WorkerConfig } from "@motiondot/worker/config/worker.config";
import { startBatchWorker } from "@motiondot/worker/workers/batch.worker";
import { startConversionWorker } from "@motiondot/worker/workers/conversion.worker";

export interface TestWorkerHandles {
  workers: Worker[];
  close: () => Promise<void>;
}

/** E2E — batch·conversion 워커만 기동 */
export function startConversionWorkers(config: WorkerConfig): TestWorkerHandles {
  const workers = [startBatchWorker(config), startConversionWorker(config)];

  return {
    workers,
    close: async () => {
      await Promise.all(workers.map((w) => w.close()));
    },
  };
}
