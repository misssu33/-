# @motiondot/templates

광고 모션 템플릿 엔진 — 템플릿 정의·프롭 해석·Remotion 컴포지션 플랜 생성.

## Usage

```ts
import { getAdTemplate, buildCompositionPlan } from "@motiondot/templates";

const plan = buildCompositionPlan({
  templateId: "flash_sale",
  presetId: "tiktok",
  props: { headline: "50% OFF", ctaText: "Shop Now" },
});
```
