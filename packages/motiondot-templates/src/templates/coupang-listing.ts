import { defineTemplate } from "../define-template";

export const coupangListingTemplate = defineTemplate({
  id: "coupang_listing",
  label: "Coupang Listing",
  description: "쿠팡 상품 상세용 1:1 루프",
  category: "product",
  recommendedPresets: ["coupang_product"],
  durationSec: 10,
  defaultProps: {
    headline: "Best Seller",
    price: "₩19,900",
    ctaText: "Add to cart",
    accentColor: "#0074e9",
    backgroundColor: "#ffffff",
  },
  sceneBlueprint: [
    { id: "bg", component: "media_backdrop", durationSec: 10 },
    { id: "card", component: "product_card", durationSec: 10 },
  ],
});
