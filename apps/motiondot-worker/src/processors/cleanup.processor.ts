import type { Job } from "bullmq";
import { createStoragePathManager, isExpired } from "@motiondot/shared";
import type { WorkerConfig } from "../config/worker.config";

export interface CleanupJobData {
  paths: { path: string; createdAt: string }[];
}

/** cleanup 큐 — temp/previews 만료 파일 삭제 */
export async function processCleanupJob(
  job: Job<CleanupJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  void paths;

  for (const target of job.data.paths) {
    if (
      isExpired({
        path: target.path,
        createdAt: new Date(target.createdAt),
        bucket: "temp",
      })
    ) {
      // TODO: fs.rm(target.path, { recursive: true })
    }
  }
}
