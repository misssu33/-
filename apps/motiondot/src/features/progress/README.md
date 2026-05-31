# progress feature

실시간 배치 변환 진행률.

- `GET /api/progress?batchId=` — SSE (snapshot + events + heartbeat)
- `useBatchProgress` — 클라이언트 구독
- `BatchProgressLive` — 배치·파일별 프로그레스 바
- Worker: `publishItemProgress` / `publishBatchProgress` → Redis pub/sub
