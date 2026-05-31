import type { ExportFormat, PresetId } from "@motiondot/shared";

/** 프리셋별 ffmpeg/Remotion 공통 출력 규칙 */
export interface PlatformPreset {
  id: PresetId;
  label: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: string;
  maxDurationSec: number;
  fps: number;
  defaultFormat: ExportFormat;
  /** 비트레이트 힌트 (kbps) — ffmpeg 인코더에서 참조 */
  videoBitrateKbps?: number;
}
