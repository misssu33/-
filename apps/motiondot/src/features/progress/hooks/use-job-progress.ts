"use client";

import { useProgressStore } from "@/stores/progress-store";
import { useBatchProgress } from "./use-batch-progress";

/** @deprecated useBatchProgress 권장 — 배치 ID 기준 진행률 */
export function useJobProgress(batchId?: string) {
  const { batchPercent, activeBatch } = useBatchProgress(batchId);
  const lastEvent = useProgressStore((s) => s.lastEvent);

  return {
    percent: batchPercent,
    phase: lastEvent?.phase,
    message: lastEvent?.message,
    activeBatch,
  };
}
