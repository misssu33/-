/** ffmpeg stderr time= 진행률 파싱 (워커 progress 이벤트용) */
export function parseFfmpegTime(stderrLine: string): number | null {
  const match = stderrLine.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (!match) return null;
  const [, h, m, s] = match;
  return (
    Number(h) * 3600 + Number(m) * 60 + Number(s)
  );
}
