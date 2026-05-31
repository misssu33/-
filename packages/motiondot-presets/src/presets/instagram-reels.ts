import type { PlatformPreset } from "../types";

/** Instagram Reels */
export const instagramReelsPreset: PlatformPreset = {
  id: "instagram_reels",
  label: "Instagram Reels",
  description: "1080×1920, 최대 90초",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 90,
  fps: 30,
  defaultFormat: "mp4",
  videoBitrateKbps: 3500,
};
