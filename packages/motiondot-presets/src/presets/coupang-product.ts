import { definePreset } from "../define-preset";

export const coupangProductPreset = definePreset({
  id: "coupang_product",
  label: "Coupang Product",
  description: "1:1 상품 루프 · 최대 15초 · 1000×1000",
  category: "commerce",
  platform: "coupang",
  width: 1000,
  height: 1000,
  aspectRatio: "1:1",
  maxDurationSec: 15,
  fps: 24,
  defaultFormat: "webp",
  recommendedFormats: ["webp", "gif", "mp4"],
  videoBitrateKbps: 2000,
  tags: ["ecommerce", "product", "loop"],
  constraints: { maxFileSizeMb: 20, maxDurationSec: 15 },
});
