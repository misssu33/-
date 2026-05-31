import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";
import { resolvePreset } from "@motiondot/presets";
import { buildPresetGifArgs } from "../formats/gif";
import { buildPresetMp4Args } from "../formats/mp4";
import { buildPresetWebpArgs } from "../formats/webp";

export interface BuildArgsInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  presetOverrides?: PresetOverrides;
}

/** 포맷·프리셋별 ffmpeg 인자 조립 */
export function buildConversionArgs(input: BuildArgsInput): string[] {
  const preset = resolvePreset(input.presetId, input.presetOverrides);
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
