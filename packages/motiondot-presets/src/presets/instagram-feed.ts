import { definePreset } from "../define-preset";

export const instagramFeedPreset = definePreset({
  id: "instagram_feed",
  label: "Instagram Feed",
  description: "4:5 피드 · 최대 60초 · 1080×1350",
  category: "feed",
  platform: "instagram",
  width: 1080,
  height: 1350,
  aspectRatio: "4:5",
  maxDurationSec: 60,
  fps: 30,
  defaultFormat: "mp4",
  recommendedFormats: ["mp4", "gif"],
  videoBitrateKbps: 3000,
  tags: ["feed", "portrait", "meta"],
  constraints: { maxFileSizeMb: 100, maxDurationSec: 60 },
});
