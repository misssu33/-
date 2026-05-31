import { baseFfmpegArgs } from "../commands/base-args";
import { buildScalePadFilter } from "../filters/scale-pad";
import type { PresetEncodeInput } from "./types";

/** 프리셋 기반 애니메이션 WebP (상품 루프용) */
export function buildPresetWebpArgs(input: PresetEncodeInput): string[] {
  return [
    ...baseFfmpegArgs(),
    "-i",
    input.inputPath,
    "-vf",
    buildScalePadFilter(input.preset),
    "-r",
    String(input.preset.fps),
    "-t",
    String(input.preset.maxDurationSec),
    "-loop",
    "0",
    "-c:v",
    "libwebp",
    "-quality",
    "80",
    input.outputPath,
  ];
}

export function buildWebpArgs(inputPath: string, outputPath: string): string[] {
  return [
    ...baseFfmpegArgs(),
    "-i",
    inputPath,
    "-loop",
    "0",
    "-c:v",
    "libwebp",
    "-quality",
    "80",
    outputPath,
  ];
}
