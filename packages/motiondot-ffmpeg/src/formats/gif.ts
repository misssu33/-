import { baseFfmpegArgs } from "../commands/base-args";

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
