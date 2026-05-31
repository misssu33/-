import type { PlatformPreset } from "../types";

/** Meta Threads */
export const threadsPreset: PlatformPreset = {
  id: "threads",
  label: "Threads",
  description: "1080×1920, 숏폼",
  width: 1080,
  height: 1920,
  aspectRatio: "9:16",
  maxDurationSec: 300,
  fps: 30,
  defaultFormat: "mp4",
  videoBitrateKbps: 3000,
};
