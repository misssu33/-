import type { PlatformPreset } from "../types";

/** Coupang 상품 상세 — 정사각/가로 혼용, 기본 1:1 */
export const coupangProductPreset: PlatformPreset = {
  id: "coupang_product",
  label: "Coupang Product",
  description: "1000×1000, 상품 GIF/WebP 루프",
  width: 1000,
  height: 1000,
  aspectRatio: "1:1",
  maxDurationSec: 15,
  fps: 24,
  defaultFormat: "webp",
  videoBitrateKbps: 2000,
};
