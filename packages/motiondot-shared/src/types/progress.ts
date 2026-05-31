/** 실시간 진행률 이벤트 (SSE/WebSocket 공용) */
export interface ProgressEvent {
  jobId: string;
  batchId: string;
  phase: ProgressPhase;
  percent: number;
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
