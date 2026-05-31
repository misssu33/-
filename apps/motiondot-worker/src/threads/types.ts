import type { ExportFormat, PresetId } from "@motiondot/shared";

/** 메인 스레드 → worker thread 메시지 */
export interface FfmpegWorkerRequest {
  type: "convert";
  requestId: string;
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  ffmpegPath?: string;
}

export interface FfmpegWorkerResponse {
  requestId: string;
  success: boolean;
  exitCode: number;
  errorMessage?: string;
}
