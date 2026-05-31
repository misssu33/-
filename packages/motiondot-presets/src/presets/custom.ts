import { definePreset } from "../define-preset";

export const customPreset = definePreset({
  id: "custom",
  label: "Custom",
  description: "직접 해상도·길이·FPS 지정",
  category: "custom",
  platform: "generic",
  width: 1080,
  height: 1080,
  aspectRatio: "1:1",
  maxDurationSec: 120,
  fps: 30,
  defaultFormat: "mp4",
  recommendedFormats: ["mp4", "gif", "webp"],
  tags: ["custom"],
  constraints: { maxFileSizeMb: 100, maxDurationSec: 120 },
});
