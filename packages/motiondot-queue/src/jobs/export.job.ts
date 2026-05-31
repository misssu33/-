import type { ExportFormat, PresetId } from "@motiondot/shared";

export interface ExportJobData {
  jobId: string;
  batchId: string;
  sourcePaths: string[];
  presetId: PresetId;
  format: ExportFormat;
  outputDir: string;
}
