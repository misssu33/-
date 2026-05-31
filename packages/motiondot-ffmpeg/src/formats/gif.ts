import { baseFfmpegArgs } from "../commands/base-args";
import { buildScalePadFilter } from "../filters/scale-pad";
import type { PresetEncodeInput } from "./types";

/** 프리셋 해상도 + 팔레트 최적화 GIF */
export function buildPresetGifArgs(input: PresetEncodeInput): string[] {
  const vf = [
    `fps=${Math.min(input.preset.fps, 15)}`,
    buildScalePadFilter(input.preset),
    "split[s0][s1]",
    "[s0]palettegen[p]",
    "[s1][p]paletteuse",
  ].join(",");

  return [
    ...baseFfmpegArgs(),
    "-i",
    input.inputPath,
    "-t",
    String(input.preset.maxDurationSec),
    "-vf",
    vf,
    input.outputPath,
  ];
}

export function buildGifArgs(inputPath: string, outputPath: string): string[] {
  return [
    ...baseFfmpegArgs(),
    "-i",
    inputPath,
    "-vf",
    "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
    outputPath,
  ];
}
