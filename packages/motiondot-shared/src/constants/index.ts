/**
 * 앱 전역 상수 — 환경 변수 키, 큐 이름, 제한값
 */
export const QUEUE_NAMES = {
  CONVERSION: "motiondot:conversion",
  PREVIEW: "motiondot:preview",
  EXPORT: "motiondot:export",
  CLEANUP: "motiondot:cleanup",
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
} as const;
