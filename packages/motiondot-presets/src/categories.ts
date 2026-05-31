import type { PresetCategory } from "./types";

export const PRESET_CATEGORY_LABELS: Record<PresetCategory, string> = {
  short_form: "숏폼 / Reels",
  feed: "피드",
  commerce: "커머스",
  custom: "커스텀",
};

export const PRESET_CATEGORY_ORDER: PresetCategory[] = [
  "short_form",
  "feed",
  "commerce",
  "custom",
];
