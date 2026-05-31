import { defineTemplate } from "../define-template";

export const flashSaleTemplate = defineTemplate({
  id: "flash_sale",
  label: "Flash Sale",
  description: "할인 강조 · 긴급 CTA · 숏폼 최적화",
  category: "promotion",
  recommendedPresets: ["tiktok", "instagram_reels", "threads"],
  durationSec: 8,
  defaultProps: {
    headline: "FLASH SALE",
    subheadline: "Ends tonight",
    price: "50% OFF",
    ctaText: "Grab it",
    accentColor: "#ef4444",
    backgroundColor: "#1a0505",
  },
  sceneBlueprint: [
    { id: "bg", component: "media_backdrop", durationSec: 8 },
    { id: "text", component: "text_stack", durationSec: 6 },
    { id: "cta", component: "cta_bar", durationSec: 4 },
  ],
});
