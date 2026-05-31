/** 지원하는 export 포맷 */
export type ExportFormat = "gif" | "mp4" | "webp";

/** 업로드된 원본 미디어 메타 */
export interface SourceMediaMeta {
  id: string;
  originalName: string;
  /** 워커·ffmpeg가 읽는 절대/상대 디스크 경로 */
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  durationMs?: number;
  width?: number;
  height?: number;
}

/** 변환 결과 파일 메타 */
export interface OutputMediaMeta {
  id: string;
  format: ExportFormat;
  path: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationMs?: number;
}
