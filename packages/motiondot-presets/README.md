# @motiondot/presets

SNS/커머스 출력 스펙 단일 소스 — UI, ffmpeg, Remotion이 동일 프리셋을 참조합니다.

## Presets

| ID | Platform | Category |
|----|----------|----------|
| `tiktok` | TikTok | short_form |
| `instagram_reels` | Instagram | short_form |
| `threads` | Threads | short_form |
| `instagram_feed` | Instagram | feed |
| `coupang_product` | Coupang | commerce |
| `custom` | — | custom |

## API

```ts
import { getPreset, resolvePreset, listPresetGroups, validatePreset } from "@motiondot/presets";

const preset = resolvePreset("custom", { width: 720, height: 1280 });
const issues = validatePreset(preset);
```
