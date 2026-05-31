import { definePreset } from "../define-preset";

export const tiktokPreset = definePreset({
  id: "tiktok",
  label: "TikTok",
  description: "9:16 숏폼 · 최대 60초 · 1080×1920",
  category: "short_form",
  platform: "tiktok",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 60,
  fps: 30,
  defaultFormat: "mp4",
  recommendedFormats: ["mp4", "webp"],
  videoBitrateKbps: 4000,
  tags: ["shorts", "vertical", "social"],
  constraints: { maxFileSizeMb: 287, maxDurationSec: 60 },
});
