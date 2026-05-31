import type { PlatformPreset } from "../types";

/** Instagram Feed (1:1 / 4:5 호환 — 기본 4:5) */
export const instagramFeedPreset: PlatformPreset = {
  id: "instagram_feed",
  label: "Instagram Feed",
  description: "1080×1350, 피드용 세로",
  width: 1080,
  height: 1350,
  aspectRatio: "4:5",
  maxDurationSec: 60,
  fps: 30,
  defaultFormat: "mp4",
  videoBitrateKbps: 3000,
};
