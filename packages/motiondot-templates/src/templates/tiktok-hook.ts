import { defineTemplate } from "../define-template";

export const tiktokHookTemplate = defineTemplate({
  id: "tiktok_hook",
  label: "TikTok Hook",
  description: "첫 3초 훅 + 빠른 텍스트 펀치",
  category: "social_hook",
  recommendedPresets: ["tiktok", "instagram_reels"],
  durationSec: 6,
  defaultProps: {
    headline: "Wait for it…",
    subheadline: "You need this",
    ctaText: "Link in bio",
    accentColor: "#f472b6",
    backgroundColor: "#0f0f0f",
  },
  sceneBlueprint: [
    { id: "hook", component: "text_stack", durationSec: 2 },
    { id: "bg", component: "media_backdrop", durationSec: 6 },
    { id: "cta", component: "cta_bar", durationSec: 2 },
  ],
});
