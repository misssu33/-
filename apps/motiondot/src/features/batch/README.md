# batch feature

BullMQ 배치 오케스트레이션 UI.

- `POST /api/batch` — batch 큐 등록
- `GET /api/batch/[batchId]` — Redis 스냅샷 조회
- `useBatchQueue` — 폴링 + SSE 갱신
- worker: `motiondot:batch` → N × `motiondot:conversion` (worker_threads)
