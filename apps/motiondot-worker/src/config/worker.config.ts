import { ENV_KEYS, resolveStorageRoot } from "@motiondot/shared";

export interface WorkerConfig {
  /** BullMQ conversion 워커 동시 잡 수 */
  concurrency: number;
  /** ffmpeg worker_threads 풀 크기 */
  threadPoolSize: number;
  storageRoot: string;
  ffmpegPath: string;
  ffprobePath: string;
}

export function loadWorkerConfig(): WorkerConfig {
  const concurrency = Number(process.env[ENV_KEYS.WORKER_CONCURRENCY] ?? 2);
  return {
    concurrency,
    threadPoolSize: Number(
      process.env[ENV_KEYS.THREAD_POOL_SIZE] ?? concurrency,
    ),
    storageRoot: resolveStorageRoot(),
    ffmpegPath: process.env[ENV_KEYS.FFMPEG_PATH] ?? "ffmpeg",
    ffprobePath: process.env[ENV_KEYS.FFPROBE_PATH] ?? "ffprobe",
  };
}
