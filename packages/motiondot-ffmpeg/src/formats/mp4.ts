import { baseFfmpegArgs } from "../commands/base-args";

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
