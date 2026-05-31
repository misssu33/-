import type { PresetId } from "@motiondot/shared";
import type { PlatformPreset } from "./types";
import { tiktokPreset } from "./presets/tiktok";
import { instagramReelsPreset } from "./presets/instagram-reels";
import { instagramFeedPreset } from "./presets/instagram-feed";
import { threadsPreset } from "./presets/threads";
import { coupangProductPreset } from "./presets/coupang-product";
import { customPreset } from "./presets/custom";

const PRESETS: PlatformPreset[] = [
  tiktokPreset,
  instagramReelsPreset,
  instagramFeedPreset,
  threadsPreset,
  coupangProductPreset,
  customPreset,
];

const byId = new Map<PresetId, PlatformPreset>(
  PRESETS.map((p) => [p.id, p]),
);

export function getPreset(id: PresetId): PlatformPreset {
  const preset = byId.get(id);
  if (!preset) {
    throw new Error(`Unknown preset: ${id}`);
  }
  return preset;
}

export function listPresets(): PlatformPreset[] {
  return [...PRESETS];
}
