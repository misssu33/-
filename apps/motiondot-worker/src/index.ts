/**
 * 워커 진입점 — conversion / preview / export / cleanup Worker 등록
 */
import { loadWorkerConfig } from "./config/worker.config";
import { registerWorkers } from "./workers/register-workers";

async function main(): Promise<void> {
  const config = loadWorkerConfig();
  console.info(`[motiondot-worker] starting (concurrency=${config.concurrency})`);
  registerWorkers(config);
}

main().catch((err) => {
  console.error("[motiondot-worker] fatal", err);
  process.exit(1);
});
