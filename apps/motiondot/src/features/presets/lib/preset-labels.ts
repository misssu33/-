import type { PresetCategory } from "@motiondot/presets";
import { PRESET_CATEGORY_LABELS } from "@motiondot/presets";

export function categoryLabel(category: PresetCategory): string {
  return PRESET_CATEGORY_LABELS[category];
}
