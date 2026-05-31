import { defineTemplate } from "../define-template";

export const productHeroTemplate = defineTemplate({
  id: "product_hero",
  label: "Product Hero",
  description: "상품 히어로 샷 + 헤드라인 + CTA",
  category: "product",
  recommendedPresets: ["coupang_product", "instagram_feed", "tiktok"],
  durationSec: 6,
  defaultProps: {
    headline: "New Arrival",
    subheadline: "Limited drop",
    price: "₩29,900",
    ctaText: "Shop Now",
    accentColor: "#6366f1",
    backgroundColor: "#0a0a0a",
  },
  sceneBlueprint: [
    { id: "bg", component: "media_backdrop", durationSec: 6 },
    { id: "card", component: "product_card", durationSec: 5 },
    { id: "cta", component: "cta_bar", durationSec: 3 },
  ],
});
