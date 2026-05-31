import type { Job } from "bullmq";
import { ConversionPipeline } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import { publishProgress } from "@motiondot/queue";
import type { ExportJobData } from "@motiondot/queue";
import type { WorkerConfig } from "../config/worker.config";

/** export 큐 — 배치 최종 포맷(GIF/MP4/WebP) 일괄 출력 */
export async function processExportJob(
  job: Job<ExportJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const pipeline = new ConversionPipeline();

  for (let i = 0; i < job.data.sourcePaths.length; i++) {
    const source = job.data.sourcePaths[i];
    const output = `${paths.outputDir(job.data.jobId)}/${i}.${job.data.format}`;

    await publishProgress({
      scope: "batch",
      jobId: job.data.batchId,
      batchId: job.data.batchId,
      phase: "export",
      percent: Math.round(((i + 1) / job.data.sourcePaths.length) * 100),
      batchPercent: Math.round(((i + 1) / job.data.sourcePaths.length) * 100),
      timestamp: new Date().toISOString(),
    });

    const result = await pipeline.run({
      sourcePath: source,
      outputPath: output,
      presetId: job.data.presetId,
      format: job.data.format,
    });

    if (!result.success) {
      throw new Error(`Export failed for ${source}`);
    }
  }
}
