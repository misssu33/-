import type { WorkerConfig } from "../config/worker.config";
import { startConversionWorker } from "./conversion.worker";
import { startPreviewWorker } from "./preview.worker";
import { startExportWorker } from "./export.worker";
import { startCleanupWorker } from "./cleanup.worker";

/** 모든 BullMQ Worker 인스턴스 기동 */
export function registerWorkers(config: WorkerConfig): void {
  startConversionWorker(config);
  startPreviewWorker(config);
  startExportWorker(config);
  startCleanupWorker(config);
}
