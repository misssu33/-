import type { PlatformPreset } from "../types";

/** 사용자 정의 — UI에서 width/height 오버라이드 */
export const customPreset: PlatformPreset = {
  id: "custom",
  label: "Custom",
  description: "직접 해상도·포맷 지정",
  width: 1080,
  height: 1080,
  aspectRatio: "1:1",
  maxDurationSec: 120,
  fps: 30,
  defaultFormat: "mp4",
};
