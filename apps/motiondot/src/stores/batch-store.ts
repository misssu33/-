import { create } from "zustand";
import type {
  BatchJobMeta,
  ConversionJobMeta,
  SourceMediaMeta,
} from "@motiondot/shared";

interface BatchState {
  batchId?: string;
  uploadedFiles: SourceMediaMeta[];
  activeBatch?: BatchJobMeta;
  jobs: ConversionJobMeta[];
  setBatchId: (id: string) => void;
  setUploadedFiles: (files: SourceMediaMeta[]) => void;
  setActiveBatch: (batch: BatchJobMeta | undefined) => void;
  addJob: (job: ConversionJobMeta) => void;
  clearBatch: () => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  jobs: [],
  uploadedFiles: [],
  activeBatch: undefined,
  setBatchId: (batchId) => set({ batchId }),
  setUploadedFiles: (uploadedFiles) => set({ uploadedFiles }),
  setActiveBatch: (activeBatch) => set({ activeBatch }),
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
  clearBatch: () =>
    set({
      batchId: undefined,
      uploadedFiles: [],
      activeBatch: undefined,
      jobs: [],
    }),
}));
