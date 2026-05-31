/**
 * 워커 진입점 — conversion / preview / export / cleanup Worker 등록
 */
import { loadWorkerConfig } from "./config/worker.config";
import { registerWorkers } from "./workers/register-workers";
import { shutdownFfmpegThreadPool } from "./threads/ffmpeg-thread-pool";

async function main(): Promise<void> {
  const config = loadWorkerConfig();
  console.info(
    `[motiondot-worker] starting (concurrency=${config.concurrency}, threads=${config.threadPoolSize})`,
  );
  registerWorkers(config);

  const shutdown = async () => {
    await shutdownFfmpegThreadPool();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

main().catch((err) => {
  console.error("[motiondot-worker] fatal", err);
  process.exit(1);
});
