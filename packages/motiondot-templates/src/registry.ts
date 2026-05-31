import type { AdTemplateId } from "@motiondot/shared";
import type { AdTemplateDefinition } from "./types";
import { productHeroTemplate } from "./templates/product-hero";
import { flashSaleTemplate } from "./templates/flash-sale";
import { couponBannerTemplate } from "./templates/coupon-banner";
import { brandIntroTemplate } from "./templates/brand-intro";
import { coupangListingTemplate } from "./templates/coupang-listing";
import { tiktokHookTemplate } from "./templates/tiktok-hook";

const TEMPLATES: AdTemplateDefinition[] = [
  productHeroTemplate,
  flashSaleTemplate,
  couponBannerTemplate,
  brandIntroTemplate,
  coupangListingTemplate,
  tiktokHookTemplate,
];

const byId = new Map<AdTemplateId, AdTemplateDefinition>(
  TEMPLATES.map((t) => [t.id, t]),
);

export function getAdTemplate(id: AdTemplateId): AdTemplateDefinition {
  const template = byId.get(id);
  if (!template) throw new Error(`Unknown ad template: ${id}`);
  return template;
}

export function listAdTemplates(): AdTemplateDefinition[] {
  return [...TEMPLATES];
}

export function listTemplatesByCategory(
  category: AdTemplateDefinition["category"],
): AdTemplateDefinition[] {
  return TEMPLATES.filter((t) => t.category === category);
}
