import type { ProgressEvent } from "@motiondot/shared";

export interface ProgressFilter {
  batchId: string;
  itemId?: string;
}

/** SSE 구독 필터 — 배치 전체 또는 특정 아이템 */
export function matchesProgressFilter(
  event: ProgressEvent,
  filter: ProgressFilter,
): boolean {
  if (event.batchId !== filter.batchId) return false;
  if (!filter.itemId) return true;
  return event.itemId === filter.itemId || event.jobId === filter.itemId;
}
