import { parseFfmpegTime } from "./progress-parser";

/** stderr 청크 + 총 duration(초)로 0–100 진행률 추정 */
export function estimateProgressPercent(
  stderrChunk: string,
  durationSec: number | null,
): number | null {
  if (!durationSec || durationSec <= 0) return null;
  const current = parseFfmpegTime(stderrChunk);
  if (current === null) return null;
  return Math.min(100, Math.round((current / durationSec) * 100));
}
