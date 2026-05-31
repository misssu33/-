"use client";

import { useCallback, useEffect, useRef } from "react";
import type { BatchJobMeta, ProgressEvent } from "@motiondot/shared";
import { useProgressStore } from "@/stores/progress-store";
import { useBatchStore } from "@/stores/batch-store";

interface SsePayload {
  type: "snapshot" | "event";
  batch?: BatchJobMeta;
  event?: ProgressEvent;
}

/** 배치 실시간 진행률 — SSE + Zustand 동기화 */
export function useBatchProgress(batchId?: string) {
  const id = batchId ?? useBatchStore((s) => s.batchId);
  const activeBatch = useProgressStore((s) => s.activeBatch);
  const batchPercent = useProgressStore((s) => s.batchPercent);
  const itemProgress = useProgressStore((s) => s.itemProgress);
  const applyEvent = useProgressStore((s) => s.applyEvent);
  const setActiveBatch = useProgressStore((s) => s.setActiveBatch);
  const setStoreBatch = useBatchStore((s) => s.setActiveBatch);
  const esRef = useRef<EventSource | null>(null);

  const refreshSnapshot = useCallback(async () => {
    if (!id) return;
    const res = await fetch(`/api/batch/${id}`);
    if (!res.ok) return;
    const batch = (await res.json()) as BatchJobMeta;
    setActiveBatch(batch);
    setStoreBatch(batch);
  }, [id, setActiveBatch, setStoreBatch]);

  const connect = useCallback(() => {
    if (!id) return;
    esRef.current?.close();

    const es = new EventSource(`/api/progress?batchId=${id}`);
    es.onmessage = (msg) => {
      const payload = JSON.parse(msg.data) as SsePayload;
      if (payload.type === "snapshot" && payload.batch) {
        setActiveBatch(payload.batch);
        setStoreBatch(payload.batch);
        return;
      }
      if (payload.type === "event" && payload.event) {
        applyEvent(payload.event);
        if (payload.event.scope === "batch") {
          void refreshSnapshot();
        }
      }
    };
    esRef.current = es;
  }, [id, applyEvent, setActiveBatch, setStoreBatch, refreshSnapshot]);

  useEffect(() => {
    connect();
    return () => esRef.current?.close();
  }, [connect]);

  const isLive =
    activeBatch?.status === "processing" || activeBatch?.status === "queued";

  return {
    batchId: id,
    activeBatch,
    batchPercent,
    itemProgress,
    isLive,
    refreshSnapshot,
  };
}
