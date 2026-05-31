import { baseFfmpegArgs } from "../commands/base-args";
import { buildScalePadFilter } from "../filters/scale-pad";
import type { PresetEncodeInput } from "./types";

/** SNS 프리셋 기반 MP4 인코딩 인자 */
export function buildPresetMp4Args(input: PresetEncodeInput): string[] {
  const { preset, inputPath, outputPath } = input;
  const bitrate = preset.videoBitrateKbps ?? 3000;

  return [
    ...baseFfmpegArgs(),
    "-i",
    inputPath,
    "-vf",
    buildScalePadFilter(preset),
    "-r",
    String(preset.fps),
    "-t",
    String(preset.maxDurationSec),
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-b:v",
    `${bitrate}k`,
    "-movflags",
    "+faststart",
    "-an",
    outputPath,
  ];
}

/** 레거시 — 프리셋 없는 단순 MP4 */
export function buildMp4Args(
  inputPath: string,
  outputPath: string,
  bitrateKbps = 3000,
): string[] {
  return [
    ...baseFfmpegArgs(),
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-b:v",
    `${bitrateKbps}k`,
    "-movflags",
    "+faststart",
    outputPath,
  ];
}
