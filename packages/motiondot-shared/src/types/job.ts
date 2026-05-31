import type { ExportFormat } from "./media";
import type { PresetId } from "./preset";

/** BullMQ 배치 작업 상태 */
export type JobStatus =
  | "queued"
  | "processing"
  | "preview_ready"
  | "completed"
  | "failed"
  | "cancelled";

/** 큐에 등록되는 단일 파일 변환 작업 페이로드 */
export interface ConversionJobPayload {
  jobId: string;
  itemId: string;
  userId?: string;
  batchId: string;
  sourcePath: string;
  originalName: string;
  /** @deprecated 배치 오케스트레이션은 sourcePath 단일 필드 사용 */
  sourcePaths?: string[];
  presetId: PresetId;
  outputFormat: ExportFormat;
  createdAt: string;
}

/** API/클라이언트에 노출되는 작업 메타데이터 */
export interface ConversionJobMeta {
  jobId: string;
  batchId: string;
  status: JobStatus;
  progress: number;
  presetId: PresetId;
  outputFormat: ExportFormat;
  errorMessage?: string;
  outputUrls?: string[];
  updatedAt: string;
}
