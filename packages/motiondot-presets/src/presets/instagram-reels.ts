import { definePreset } from "../define-preset";

export const instagramReelsPreset = definePreset({
  id: "instagram_reels",
  label: "Instagram Reels",
  description: "9:16 Reels · 최대 90초 · 1080×1920",
  category: "short_form",
  platform: "instagram",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 90,
  fps: 30,
  defaultFormat: "mp4",
  recommendedFormats: ["mp4"],
  videoBitrateKbps: 3500,
  tags: ["reels", "vertical", "meta"],
  constraints: { maxFileSizeMb: 100, maxDurationSec: 90 },
});
