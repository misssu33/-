# Worker & Batch Queue Architecture

## Layer 1 — BullMQ (process-level)

- **Batch queue**: one job per user batch → orchestrates fan-out
- **Conversion queue**: one job per video file
- **Preview / Export / Cleanup**: auxiliary pipelines

Redis (`BatchStateStore`) holds aggregate progress for API polling & SSE.

## Layer 2 — worker_threads (CPU-level)

BullMQ `conversion` workers stay responsive by delegating ffmpeg to `FfmpegThreadPool`:

```
BullMQ Worker (main thread)
  → conversion.processor
      → FfmpegThreadPool.run()
          → ffmpeg-worker.thread.ts
              → ConversionPipeline (@motiondot/ffmpeg)
```

Pool size defaults to `MOTIONDOT_THREAD_POOL_SIZE` (falls back to `MOTIONDOT_WORKER_CONCURRENCY`).

## Layer 3 — Optional FlowProducer

`@motiondot/queue` → `enqueueBatchFlow()` builds a parent/child graph for finalize-after-children semantics. Default path uses `BatchOrchestrator.dispatch()` for explicit control.
