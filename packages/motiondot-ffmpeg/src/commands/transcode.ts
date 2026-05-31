import type { PlatformPreset } from "@motiondot/presets";
import { baseFfmpegArgs } from "./base-args";
import { buildScalePadFilter } from "../filters/scale-pad";

export interface TranscodeInput {
  inputPath: string;
  outputPath: string;
  preset: PlatformPreset;
  extraArgs?: string[];
}

/** 단일 파일 → MP4 트랜스코드 명령 인자 */
export function buildTranscodeArgs(input: TranscodeInput): string[] {
  const vf = buildScalePadFilter(input.preset);
  return [
    ...baseFfmpegArgs(),
    "-i",
    input.inputPath,
    "-vf",
    vf,
    "-r",
    String(input.preset.fps),
    "-t",
    String(input.preset.maxDurationSec),
    ...(input.extraArgs ?? []),
    input.outputPath,
  ];
}
