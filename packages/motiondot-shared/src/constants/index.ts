/**
 * 앱 전역 상수 — 환경 변수 키, 큐 이름, 제한값
 */
export const QUEUE_NAMES = {
  BATCH: "motiondot:batch",
  CONVERSION: "motiondot:conversion",
  PREVIEW: "motiondot:preview",
  EXPORT: "motiondot:export",
  CLEANUP: "motiondot:cleanup",
} as const;

/** Redis 배치 상태 키 */
export const BATCH_STATE_KEYS = {
  meta: (batchId: string) => `${REDIS_KEY_PREFIX}batch:${batchId}:meta`,
  items: (batchId: string) => `${REDIS_KEY_PREFIX}batch:${batchId}:items`,
} as const;

export const DELIVERY_STATE_KEYS = {
  snapshot: (batchId: string) => `${REDIS_KEY_PREFIX}delivery:${batchId}`,
} as const;

export const REDIS_KEY_PREFIX = "motiondot:";

export const UPLOAD_LIMITS = {
  maxFileSizeBytes: 100 * 1024 * 1024,
  maxBatchFiles: 50,
  allowedMimePrefixes: ["image/", "video/"] as const,
} as const;

export * from "./upload";

export const ENV_KEYS = {
  REDIS_URL: "REDIS_URL",
  STORAGE_ROOT: "MOTIONDOT_STORAGE_ROOT",
  FFMPEG_PATH: "FFMPEG_PATH",
  WORKER_CONCURRENCY: "MOTIONDOT_WORKER_CONCURRENCY",
  THREAD_POOL_SIZE: "MOTIONDOT_THREAD_POOL_SIZE",
} as const;
