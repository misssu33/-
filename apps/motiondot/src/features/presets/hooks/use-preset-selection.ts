"use client";

import { resolvePreset, validatePreset } from "@motiondot/presets";
import { useConverterStore } from "@/stores/converter-store";

export function usePresetSelection() {
  const presetId = useConverterStore((s) => s.presetId);
  const overrides = useConverterStore((s) => s.presetOverrides);
  const preset = resolvePreset(presetId, overrides);
  const issues = validatePreset(preset);

  return {
    presetId,
    preset,
    overrides,
    isValid: issues.length === 0,
    issues,
  };
}
