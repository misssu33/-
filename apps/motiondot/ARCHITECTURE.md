# MotionDot Architecture

배치 GIF/MP4/WebP 변환기 — 기능(feature) 단위 모듈 + 별도 워커 + 공유 패키지 구조입니다.

## Monorepo Layout

| Path | Role |
|------|------|
| `apps/motiondot` | Next.js App Router UI + Route Handlers |
| `apps/motiondot-worker` | BullMQ consumers (ffmpeg, export, cleanup) |
| `packages/motiondot-shared` | Types, constants, storage paths |
| `packages/motiondot-presets` | SNS/커머스 프리셋 |
| `packages/motiondot-ffmpeg` | ffmpeg CLI & pipelines |
| `packages/motiondot-queue` | BullMQ queues & Redis |
| `packages/motiondot-remotion` | Preview compositions |

## Data Flow

1. **Upload** → `storage/uploads/{batchId}`
2. **API** enqueues → Redis/BullMQ
3. **Worker** transcodes → `storage/output/{jobId}`
4. **Preview** → `storage/previews` + Remotion
5. **Progress** → Redis pub → SSE `/api/progress`
6. **Export** → zip/download URLs (future)

## Rules

- `app/**/page.tsx`는 라우트 조립만 — 비즈니스 로직은 `src/features`
- ffmpeg는 `@motiondot/ffmpeg`만 import
- 프리셋은 `@motiondot/presets`만 import
