"use client";

import { getPreset } from "@motiondot/presets";
import { useConverterStore } from "@/stores/converter-store";

export function usePresetSelection() {
  const presetId = useConverterStore((s) => s.presetId);
  const preset = getPreset(presetId);
  return { presetId, preset };
}
