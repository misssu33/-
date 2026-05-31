# MotionDot Worker

BullMQ 워커 프로세스 + **worker_threads** ffmpeg 풀.

## Architecture

```
motiondot:batch (orchestrator)
    └─ fan-out → motiondot:conversion × N
                      └─ FfmpegThreadPool (worker_threads)
```

| Component | Path | Role |
|-----------|------|------|
| Batch worker | `workers/batch.worker.ts` | 오케스트레이션 잡 소비 |
| Conversion worker | `workers/conversion.worker.ts` | 파일별 변환 잡 소비 |
| Batch processor | `processors/batch.processor.ts` | conversion 큐에 fan-out |
| Conversion processor | `processors/conversion.processor.ts` | thread pool 호출 |
| Thread pool | `threads/ffmpeg-thread-pool.ts` | CPU 바운드 격리 |
| Thread entry | `threads/ffmpeg-worker.thread.ts` | ffmpeg 실행 |

## Env

```bash
REDIS_URL=redis://127.0.0.1:6379
MOTIONDOT_STORAGE_ROOT=./storage
MOTIONDOT_WORKER_CONCURRENCY=2    # BullMQ conversion 동시성
MOTIONDOT_THREAD_POOL_SIZE=2      # worker_threads 풀 크기
FFMPEG_PATH=ffmpeg
```

## Run

```bash
pnpm --filter @motiondot/worker dev
```
