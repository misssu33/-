import type { ExportFormat, PresetId } from "@motiondot/shared";

export interface ConvertMediaInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  ffmpegPath?: string;
  onStderr?: (chunk: string) => void;
}

export interface ConvertMediaResult {
  success: boolean;
  exitCode: number;
  stderr: string;
}
