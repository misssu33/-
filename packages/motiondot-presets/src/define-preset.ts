import type { PlatformPreset } from "./types";

/** 프리셋 정의 헬퍼 — 공통 필드 누락 방지 */
export function definePreset(
  preset: PlatformPreset,
): PlatformPreset {
  return preset;
}
