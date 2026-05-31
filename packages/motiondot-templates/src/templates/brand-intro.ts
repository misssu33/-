import { defineTemplate } from "../define-template";

export const brandIntroTemplate = defineTemplate({
  id: "brand_intro",
  label: "Brand Intro",
  description: "브랜드 로고·슬로건 인트로",
  category: "brand",
  recommendedPresets: ["instagram_reels", "tiktok"],
  durationSec: 4,
  defaultProps: {
    headline: "MotionDot",
    subheadline: "Create. Convert. Ship.",
    brandName: "MotionDot",
    accentColor: "#6366f1",
    backgroundColor: "#09090b",
  },
  sceneBlueprint: [
    { id: "brand", component: "brand_lockup", durationSec: 4 },
    { id: "text", component: "text_stack", durationSec: 3 },
  ],
});
