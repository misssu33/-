import type { ExportFormat } from "@motiondot/shared";
import { getPreset } from "@motiondot/presets";
import type { PresetId } from "@motiondot/shared";
import { buildPresetGifArgs } from "../formats/gif";
import { buildPresetMp4Args } from "../formats/mp4";
import { buildPresetWebpArgs } from "../formats/webp";

export interface BuildArgsInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
}

/** 포맷·프리셋별 ffmpeg 인자 조립 */
export function buildConversionArgs(input: BuildArgsInput): string[] {
  const preset = getPreset(input.presetId);
  const paths = { inputPath: input.sourcePath, outputPath: input.outputPath, preset };

  switch (input.format) {
    case "gif":
      return buildPresetGifArgs(paths);
    case "webp":
      return buildPresetWebpArgs(paths);
    case "mp4":
    default:
      return buildPresetMp4Args(paths);
  }
}
