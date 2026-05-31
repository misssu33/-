import type { PresetCategory } from "./types";
import type { PlatformPreset } from "./types";
import { PRESET_CATEGORY_ORDER } from "./categories";
import { listPresets } from "./registry";

export interface PresetGroup {
  category: PresetCategory;
  presets: PlatformPreset[];
}

/** 카테고리별 프리셋 그룹 (UI 섹션용) */
export function listPresetGroups(): PresetGroup[] {
  const all = listPresets();
  return PRESET_CATEGORY_ORDER.map((category) => ({
    category,
    presets: all.filter((p) => p.category === category),
  })).filter((g) => g.presets.length > 0);
}
