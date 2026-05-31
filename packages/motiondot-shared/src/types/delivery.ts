import type { ExportFormat } from "./media";

export type DeliveryPhase = "idle" | "queued" | "processing" | "ready" | "failed";

/** 단일 파일 전달 아티팩트 */
export interface DeliveryFile {
  itemId: string;
  originalName: string;
  path: string;
  format: ExportFormat | "preview";
  sizeBytes?: number;
  url?: string;
}

/** 배치 프리뷰 상태 */
export interface PreviewManifest {
  batchId: string;
  status: DeliveryPhase;
  files: DeliveryFile[];
  updatedAt: string;
  errorMessage?: string;
}

/** 배치 최종 export + ZIP */
export interface ExportManifest {
  batchId: string;
  status: DeliveryPhase;
  format: ExportFormat;
  files: DeliveryFile[];
  zipPath?: string;
  zipUrl?: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface DeliverySnapshot {
  batchId: string;
  preview: PreviewManifest;
  export: ExportManifest;
}
