import type { ExportFormat, PresetId } from "@motiondot/shared";

export type PresetCategory = "short_form" | "feed" | "commerce" | "custom";

export type PresetPlatform =
  | "tiktok"
  | "instagram"
  | "meta"
  | "coupang"
  | "generic";

export interface PresetConstraints {
  maxFileSizeMb: number;
  maxDurationSec: number;
}

/** 프리셋별 ffmpeg/Remotion/UI 공통 출력 규칙 */
export interface PlatformPreset {
  id: PresetId;
  label: string;
  description: string;
  category: PresetCategory;
  platform: PresetPlatform;
  width: number;
  height: number;
  aspectRatio: string;
  maxDurationSec: number;
  fps: number;
  defaultFormat: ExportFormat;
  recommendedFormats: ExportFormat[];
  videoBitrateKbps?: number;
  tags: string[];
  constraints: PresetConstraints;
}

export type { PresetOverrides } from "@motiondot/shared";
