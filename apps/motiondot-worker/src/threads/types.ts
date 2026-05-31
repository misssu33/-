import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";

/** 메인 스레드 → worker thread 메시지 */
export interface FfmpegWorkerRequest {
  type: "convert";
  requestId: string;
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  ffmpegPath?: string;
  durationSec?: number | null;
  presetOverrides?: PresetOverrides;
}

export interface FfmpegWorkerProgressMessage {
  type: "progress";
  requestId: string;
  percent: number;
}

export interface FfmpegWorkerResponse {
  type: "done";
  requestId: string;
  success: boolean;
  exitCode: number;
  errorMessage?: string;
}

export type FfmpegWorkerOutbound =
  | FfmpegWorkerProgressMessage
  | FfmpegWorkerResponse;
