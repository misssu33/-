import type { PlatformPreset } from "./types";

export interface PresetValidationIssue {
  field: string;
  message: string;
}

/** UI/배치 시작 전 프리셋·오버라이드 검증 */
export function validatePreset(
  preset: PlatformPreset,
): PresetValidationIssue[] {
  const issues: PresetValidationIssue[] = [];

  if (preset.width < 320 || preset.height < 320) {
    issues.push({ field: "size", message: "해상도는 최소 320px 이상이어야 합니다." });
  }
  if (preset.maxDurationSec < 1 || preset.maxDurationSec > 600) {
    issues.push({ field: "duration", message: "길이는 1~600초 사이여야 합니다." });
  }
  if (preset.fps < 1 || preset.fps > 60) {
    issues.push({ field: "fps", message: "FPS는 1~60 사이여야 합니다." });
  }

  return issues;
}
