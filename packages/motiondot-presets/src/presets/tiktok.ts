import type { PlatformPreset } from "../types";

/** TikTok 세로 숏폼 (9:16) */
export const tiktokPreset: PlatformPreset = {
  id: "tiktok",
  label: "TikTok",
  description: "1080×1920, 최대 60초, 세로 숏폼",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 60,
  fps: 30,
  defaultFormat: "mp4",
  videoBitrateKbps: 4000,
};
