/** ffprobe로 읽은 미디어 메타 */
export interface MediaProbeResult {
  durationSec: number | null;
  width: number | null;
  height: number | null;
  codec: string | null;
}
