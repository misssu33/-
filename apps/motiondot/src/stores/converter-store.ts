import { create } from "zustand";
import type { ExportFormat, PresetId } from "@motiondot/shared";
import { getPreset } from "@motiondot/presets";

interface ConverterState {
  presetId: PresetId;
  format: ExportFormat;
  jobId?: string;
  setPresetId: (id: PresetId) => void;
  setFormat: (format: ExportFormat) => void;
  setJobId: (id: string) => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  presetId: "tiktok",
  format: getPreset("tiktok").defaultFormat,
  setPresetId: (presetId) =>
    set({
      presetId,
      format: getPreset(presetId).defaultFormat,
    }),
  setFormat: (format) => set({ format }),
  setJobId: (jobId) => set({ jobId }),
}));
