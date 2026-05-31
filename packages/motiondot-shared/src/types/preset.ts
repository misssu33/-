/** SNS/커머스 플랫폼 프리셋 식별자 */
export type PresetId =
  | "tiktok"
  | "instagram_reels"
  | "instagram_feed"
  | "threads"
  | "coupang_product"
  | "custom";

/** 프리셋에 정의된 출력 스펙 (패키지 motiondot-presets와 동기화) */
export interface PresetSpec {
  id: PresetId;
  label: string;
  width: number;
  height: number;
  maxDurationSec: number;
  fps: number;
  defaultFormat: import("./media").ExportFormat;
}

/** Custom 프리셋 런타임 오버라이드 */
export interface PresetOverrides {
  width?: number;
  height?: number;
  maxDurationSec?: number;
  fps?: number;
}
