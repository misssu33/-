import { siteConfig } from "@/shared/config/site";

export const DASHBOARD_NAV_ITEMS = [
  { href: siteConfig.links.converter, label: "변환", mobileLabel: "변환" },
  { href: siteConfig.links.batch, label: "배치 큐", mobileLabel: "배치" },
  { href: siteConfig.links.templates, label: "템플릿", mobileLabel: "템플릿" },
  { href: siteConfig.links.welcome, label: "가이드", mobileLabel: "가이드" },
] as const;
