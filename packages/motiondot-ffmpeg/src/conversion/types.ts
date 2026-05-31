import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";

export interface ConvertMediaInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  presetOverrides?: PresetOverrides;
  ffmpegPath?: string;
  onStderr?: (chunk: string) => void;
}

export interface ConvertMediaResult {
  success: boolean;
  exitCode: number;
  stderr: string;
}
