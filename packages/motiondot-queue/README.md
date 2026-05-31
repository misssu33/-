# @motiondot/queue

BullMQ 큐·잡·Redis 배치 상태·오케스트레이션.

## Batch pipeline

```
POST /api/batch
    → enqueueBatch (motiondot-batch)
    → BatchOrchestrator.dispatch
            → N × conversion jobs (motiondot-conversion)
                → worker thread ffmpeg
            → BatchStateStore (Redis progress)
```

## Queues

| Queue | Role |
|-------|------|
| `motiondot-batch` | Fan-out orchestrator |
| `motiondot-conversion` | Per-file transcode (worker threads) |
| `motiondot-preview` | Low-res preview |
| `motiondot-export` | Final export bundle |
| `motiondot-cleanup` | Temp file TTL |

## Optional FlowProducer

`enqueueBatchFlow()` — parent/child dependency graph (see `src/flows/batch-flow.ts`).
