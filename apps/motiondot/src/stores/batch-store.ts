import { create } from "zustand";
import type { ConversionJobMeta } from "@motiondot/shared";

interface BatchState {
  batchId?: string;
  jobs: ConversionJobMeta[];
  setBatchId: (id: string) => void;
  addJob: (job: ConversionJobMeta) => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  jobs: [],
  setBatchId: (batchId) => set({ batchId }),
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
}));
