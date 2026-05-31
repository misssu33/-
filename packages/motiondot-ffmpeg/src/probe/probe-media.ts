import { runFfprobe } from "../client/ffprobe-runner";
import type { MediaProbeResult } from "./types";

/** 소스 파일 duration·해상도·코덱 조회 */
export async function probeMedia(
  filePath: string,
  ffprobePath?: string,
): Promise<MediaProbeResult> {
  const result = await runFfprobe(
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=width,height,codec_name",
      "-of",
      "json",
      filePath,
    ],
    ffprobePath,
  );

  if (result.exitCode !== 0) {
    return { durationSec: null, width: null, height: null, codec: null };
  }

  return parseProbeJson(result.stdout);
}

function parseProbeJson(stdout: string): MediaProbeResult {
  try {
    const data = JSON.parse(stdout) as {
      format?: { duration?: string };
      streams?: { width?: number; height?: number; codec_name?: string }[];
    };
    const video = data.streams?.find((s) => s.width && s.height);
    return {
      durationSec: data.format?.duration ? Number(data.format.duration) : null,
      width: video?.width ?? null,
      height: video?.height ?? null,
      codec: video?.codec_name ?? null,
    };
  } catch {
    return { durationSec: null, width: null, height: null, codec: null };
  }
}
