import { runFfmpeg } from "../client/ffmpeg-runner";
import { baseFfmpegArgs } from "../commands/base-args";

/** 저해상도·빠른 MP4 프리뷰 (브라우저 스트리밍용) */
export async function buildFastPreview(input: {
  sourcePath: string;
  outputPath: string;
  maxWidth?: number;
  ffmpegPath?: string;
}): Promise<{ success: boolean; exitCode: number }> {
  const w = input.maxWidth ?? 480;
  const args = [
    ...baseFfmpegArgs(),
    "-i",
    input.sourcePath,
    "-vf",
    `scale=${w}:-2`,
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "28",
    "-movflags",
    "+faststart",
    "-an",
    "-t",
    "30",
    input.outputPath,
  ];

  const result = await runFfmpeg({
    args,
    ffmpegPath: input.ffmpegPath,
  });

  return { success: result.exitCode === 0, exitCode: result.exitCode };
}
