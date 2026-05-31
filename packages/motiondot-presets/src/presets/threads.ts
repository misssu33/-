import { definePreset } from "../define-preset";

export const threadsPreset = definePreset({
  id: "threads",
  label: "Threads",
  description: "9:16 숏폼 · 최대 5분 · 1080×1920",
  category: "short_form",
  platform: "meta",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 300,
  fps: 30,
  defaultFormat: "mp4",
  recommendedFormats: ["mp4"],
  videoBitrateKbps: 3000,
  tags: ["threads", "vertical", "meta"],
  constraints: { maxFileSizeMb: 100, maxDurationSec: 300 },
});
