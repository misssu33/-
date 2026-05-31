import { ENV_KEYS } from "@motiondot/shared";

export interface WorkerConfig {
  concurrency: number;
  storageRoot: string;
  ffmpegPath: string;
}

export function loadWorkerConfig(): WorkerConfig {
  return {
    concurrency: Number(process.env[ENV_KEYS.WORKER_CONCURRENCY] ?? 2),
    storageRoot: process.env[ENV_KEYS.STORAGE_ROOT] ?? "./storage",
    ffmpegPath: process.env[ENV_KEYS.FFMPEG_PATH] ?? "ffmpeg",
  };
}
