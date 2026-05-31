import type { PresetId } from "@motiondot/shared";
import type { PlatformPreset, PresetOverrides } from "./types";
import { getPreset } from "./registry";

const MIN_EDGE = 320;
const MAX_EDGE = 4096;

/** 오버라이드 병합 + Custom 프리셋 치수 적용 */
export function resolvePreset(
  id: PresetId,
  overrides?: PresetOverrides,
): PlatformPreset {
  const base = getPreset(id);
  if (!overrides) return base;

  return {
    ...base,
    width: clampEdge(overrides.width ?? base.width),
    height: clampEdge(overrides.height ?? base.height),
    maxDurationSec: overrides.maxDurationSec ?? base.maxDurationSec,
    fps: overrides.fps ?? base.fps,
    aspectRatio:
      overrides.width && overrides.height
        ? simplifyRatio(overrides.width, overrides.height)
        : base.aspectRatio,
  };
}

function clampEdge(n: number): number {
  return Math.min(MAX_EDGE, Math.max(MIN_EDGE, Math.round(n)));
}

function simplifyRatio(w: number, h: number): string {
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
