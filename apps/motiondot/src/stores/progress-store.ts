import { create } from "zustand";
import type { BatchJobMeta, ProgressEvent } from "@motiondot/shared";

interface ProgressState {
  eventsByBatch: Record<string, ProgressEvent[]>;
  itemProgress: Record<string, number>;
  batchPercent: number;
  lastEvent?: ProgressEvent;
  activeBatch?: BatchJobMeta;
  applyEvent: (event: ProgressEvent) => void;
  setActiveBatch: (batch: BatchJobMeta | undefined) => void;
  reset: (batchId?: string) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  eventsByBatch: {},
  itemProgress: {},
  batchPercent: 0,
  applyEvent: (event) =>
    set((s) => {
      const key = event.batchId;
      const list = [...(s.eventsByBatch[key] ?? []), event].slice(-50);
      const itemProgress = { ...s.itemProgress };
      if (event.scope === "item" && event.itemId) {
        itemProgress[event.itemId] = event.percent;
      }
      return {
        eventsByBatch: { ...s.eventsByBatch, [key]: list },
        itemProgress,
        batchPercent:
          event.batchPercent ??
          (event.scope === "batch" ? event.percent : s.batchPercent),
        lastEvent: event,
      };
    }),
  setActiveBatch: (activeBatch) =>
    set({
      activeBatch,
      batchPercent: activeBatch?.progress ?? 0,
      itemProgress: Object.fromEntries(
        (activeBatch?.items ?? []).map((i) => [i.itemId, i.progress]),
      ),
    }),
  reset: (batchId) =>
    set((s) => {
      if (!batchId) {
        return {
          eventsByBatch: {},
          itemProgress: {},
          batchPercent: 0,
          lastEvent: undefined,
          activeBatch: undefined,
        };
      }
      const { [batchId]: _, ...rest } = s.eventsByBatch;
      return { eventsByBatch: rest, batchPercent: 0, itemProgress: {} };
    }),
}));
