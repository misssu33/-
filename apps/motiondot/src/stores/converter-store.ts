import { create } from "zustand";
import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";
import { getPreset, resolvePreset } from "@motiondot/presets";

interface ConverterState {
  presetId: PresetId;
  format: ExportFormat;
  presetOverrides?: PresetOverrides;
  jobId?: string;
  setPresetId: (id: PresetId) => void;
  setPresetOverrides: (overrides: PresetOverrides | undefined) => void;
  setFormat: (format: ExportFormat) => void;
  setJobId: (id: string) => void;
  getResolvedPreset: () => ReturnType<typeof resolvePreset>;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  presetId: "tiktok",
  format: getPreset("tiktok").defaultFormat,
  presetOverrides: undefined,
  setPresetId: (presetId) =>
    set({
      presetId,
      format: getPreset(presetId).defaultFormat,
      presetOverrides: presetId === "custom" ? get().presetOverrides ?? {
        width: 1080,
        height: 1080,
        maxDurationSec: 120,
        fps: 30,
      } : undefined,
    }),
  setPresetOverrides: (presetOverrides) => set({ presetOverrides }),
  setFormat: (format) => set({ format }),
  setJobId: (jobId) => set({ jobId }),
  getResolvedPreset: () =>
    resolvePreset(get().presetId, get().presetOverrides),
}));
