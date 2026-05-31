import { defineTemplate } from "../define-template";

export const couponBannerTemplate = defineTemplate({
  id: "coupon_banner",
  label: "Coupon Banner",
  description: "쿠폰 코드·프로모 배너",
  category: "promotion",
  recommendedPresets: ["instagram_feed", "coupang_product"],
  durationSec: 5,
  defaultProps: {
    headline: "WELCOME10",
    subheadline: "10% off your first order",
    ctaText: "Apply at checkout",
    accentColor: "#22c55e",
    backgroundColor: "#052e16",
  },
  sceneBlueprint: [
    { id: "text", component: "text_stack", durationSec: 5 },
    { id: "cta", component: "cta_bar", durationSec: 3 },
  ],
});
