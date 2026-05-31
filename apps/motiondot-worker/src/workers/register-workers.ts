import type { WorkerConfig } from "../config/worker.config";
import { startBatchWorker } from "./batch.worker";
import { startConversionWorker } from "./conversion.worker";
import { startPreviewWorker } from "./preview.worker";
import { startExportWorker } from "./export.worker";
import { startCleanupWorker } from "./cleanup.worker";

/** 모든 BullMQ Worker 인스턴스 기동 */
export function registerWorkers(config: WorkerConfig): void {
  startBatchWorker(config);
  startConversionWorker(config);
  startPreviewWorker(config);
  startExportWorker(config);
  startCleanupWorker(config);
}
