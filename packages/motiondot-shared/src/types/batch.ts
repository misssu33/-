import type { ExportFormat } from "./media";
import type { PresetId } from "./preset";
import type { JobStatus } from "./job";

/** 배치 내 단일 파일 작업 */
export interface BatchItemPayload {
  itemId: string;
  sourcePath: string;
  originalName: string;
}

/** BullMQ batch 큐 페이로드 */
export interface BatchJobPayload {
  batchId: string;
  presetId: PresetId;
  outputFormat: ExportFormat;
  items: BatchItemPayload[];
  createdAt: string;
}

/** Redis에 저장되는 배치 단위 상태 */
export type BatchStatus = JobStatus;

export interface BatchItemState {
  itemId: string;
  jobId: string;
  originalName: string;
  status: JobStatus;
  progress: number;
  outputPath?: string;
  errorMessage?: string;
}

/** API 응답용 배치 스냅샷 */
export interface BatchJobMeta {
  batchId: string;
  status: BatchStatus;
  presetId: PresetId;
  outputFormat: ExportFormat;
  progress: number;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  items: BatchItemState[];
  updatedAt: string;
}
