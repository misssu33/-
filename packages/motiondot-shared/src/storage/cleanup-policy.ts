/** temp 디렉터리 TTL (밀리초) — 실패·완료 후 정리 기준 */
export const TEMP_TTL_MS = 24 * 60 * 60 * 1000;

/** output 보관 기간 — 다운로드 링크 만료와 연동 예정 */
export const OUTPUT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

export interface CleanupTarget {
  path: string;
  createdAt: Date;
  bucket: "temp" | "previews";
}

/** 만료 대상 여부 판별 (워커 cleanup 프로세서에서 사용) */
export function isExpired(
  target: CleanupTarget,
  now = Date.now(),
): boolean {
  const ttl =
    target.bucket === "temp" ? TEMP_TTL_MS : TEMP_TTL_MS;
  return now - target.createdAt.getTime() > ttl;
}
