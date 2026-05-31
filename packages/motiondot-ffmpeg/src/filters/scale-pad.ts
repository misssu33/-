import type { PlatformPreset } from "@motiondot/presets";

/** 프리셋 해상도에 맞춘 scale+pad vf 문자열 생성 */
export function buildScalePadFilter(preset: PlatformPreset): string {
  const { width, height } = preset;
  return [
    `scale=${width}:${height}:force_original_aspect_ratio=decrease`,
    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
  ].join(",");
}
