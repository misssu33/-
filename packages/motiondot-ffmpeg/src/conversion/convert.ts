import { runFfmpeg } from "../client/ffmpeg-runner";
import { buildConversionArgs } from "./build-args";
import type { ConvertMediaInput, ConvertMediaResult } from "./types";

/** 단일 미디어 변환 — 인자 조립 + ffmpeg 실행 */
export async function convertMedia(
  input: ConvertMediaInput,
): Promise<ConvertMediaResult> {
  const args = buildConversionArgs({
    sourcePath: input.sourcePath,
    outputPath: input.outputPath,
    presetId: input.presetId,
    format: input.format,
  });

  const result = await runFfmpeg({
    args,
    ffmpegPath: input.ffmpegPath,
    onStderr: input.onStderr,
  });

  return {
    success: result.exitCode === 0,
    exitCode: result.exitCode,
    stderr: result.stderr,
  };
}
