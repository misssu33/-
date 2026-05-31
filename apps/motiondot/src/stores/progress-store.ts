import { create } from "zustand";
import type { ProgressEvent } from "@motiondot/shared";

interface ProgressState {
  byJobId: Record<string, ProgressEvent>;
  upsert: (event: ProgressEvent) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  byJobId: {},
  upsert: (event) =>
    set((s) => ({
      byJobId: { ...s.byJobId, [event.jobId]: event },
    })),
}));
