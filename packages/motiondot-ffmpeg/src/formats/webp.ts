import { baseFfmpegArgs } from "../commands/base-args";

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
