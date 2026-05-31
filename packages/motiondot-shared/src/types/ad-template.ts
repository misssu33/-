import type { PresetId } from "./preset";

/** 광고 모션 템플릿 식별자 */
export type AdTemplateId =
  | "product_hero"
  | "flash_sale"
  | "coupon_banner"
  | "brand_intro"
  | "coupang_listing"
  | "tiktok_hook";

/** 템플릿 카테고리 */
export type AdTemplateCategory =
  | "product"
  | "promotion"
  | "brand"
  | "social_hook";

/** 사용자가 채우는 슬롯 값 */
export interface AdTemplateProps {
  headline: string;
  subheadline?: string;
  price?: string;
  ctaText?: string;
  brandName?: string;
  mediaSrc?: string;
  accentColor?: string;
  backgroundColor?: string;
}

/** Remotion/렌더러에 전달되는 해석된 플랜 */
export interface AdCompositionPlan {
  templateId: AdTemplateId;
  presetId: PresetId;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  props: AdTemplateProps;
  scenes: AdScenePlan[];
}

export interface AdScenePlan {
  id: string;
  component: AdSceneComponent;
  durationInFrames: number;
  props: Record<string, unknown>;
}

export type AdSceneComponent =
  | "media_backdrop"
  | "text_stack"
  | "product_card"
  | "cta_bar"
  | "brand_lockup";
