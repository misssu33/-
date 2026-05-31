import { create } from "zustand";
import type { ConversionJobMeta, SourceMediaMeta } from "@motiondot/shared";

interface BatchState {
  batchId?: string;
  uploadedFiles: SourceMediaMeta[];
  jobs: ConversionJobMeta[];
  setBatchId: (id: string) => void;
  setUploadedFiles: (files: SourceMediaMeta[]) => void;
  addJob: (job: ConversionJobMeta) => void;
  clearBatch: () => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  jobs: [],
  uploadedFiles: [],
  setBatchId: (batchId) => set({ batchId }),
  setUploadedFiles: (uploadedFiles) => set({ uploadedFiles }),
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
  clearBatch: () => set({ batchId: undefined, uploadedFiles: [], jobs: [] }),
}));
