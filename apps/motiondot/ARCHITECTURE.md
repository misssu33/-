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
| `packages/motiondot-templates` | 광고 모션 템플릿 엔진 |
| `packages/motiondot-remotion` | Remotion 씬·컴포지션 렌더 |

## Data Flow

1. **Upload** → `storage/uploads/{batchId}`
2. **POST /api/batch** → `motiondot:batch` queue
3. **Batch worker** fan-out → `motiondot:conversion` × N
4. **Conversion worker** → `worker_threads` ffmpeg → `storage/output/{batchId}/`
5. **BatchStateStore** (Redis) → `GET /api/batch/[id]` + SSE `/api/progress`
6. **Preview** → `storage/previews` + Remotion
7. **Export** → zip/download URLs (future)

## Rules

- `app/**/page.tsx`는 라우트 조립만 — 비즈니스 로직은 `src/features`
- ffmpeg는 `@motiondot/ffmpeg`만 import
- 프리셋은 `@motiondot/presets`만 import
