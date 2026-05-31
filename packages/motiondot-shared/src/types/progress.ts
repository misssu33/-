/** 이벤트 범위 — 배치 전체 vs 개별 파일 */
export type ProgressScope = "batch" | "item";

/** 실시간 진행률 이벤트 (SSE/WebSocket 공용) */
export interface ProgressEvent {
  scope: ProgressScope;
  /** scope=batch → batchId, scope=item → itemId */
  jobId: string;
  batchId: string;
  itemId?: string;
  phase: ProgressPhase;
  /** scope=item: 파일 진행률, scope=batch: 배치 전체 진행률 */
  percent: number;
  batchPercent?: number;
  message?: string;
  timestamp: string;
}

export type ProgressPhase =
  | "upload"
  | "validate"
  | "queue"
  | "transcode"
  | "preview"
  | "export"
  | "cleanup"
  | "done";
