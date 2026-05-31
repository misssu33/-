import type { Job } from "bullmq";
import { ConversionPipeline } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import { publishProgress } from "@motiondot/queue";
import type { ConversionJobData } from "@motiondot/queue";
import type { WorkerConfig } from "../config/worker.config";

/** conversion 큐 잡 — ffmpeg 트랜스코드 + progress 발행 */
export async function processConversionJob(
  job: Job<ConversionJobData>,
  config: WorkerConfig,
): Promise<void> {
  const paths = createStoragePathManager(config.storageRoot);
  const source = job.data.sourcePaths[0];
  const output = `${paths.outputDir(job.data.jobId)}/out.${job.data.outputFormat}`;

  await publishProgress({
    jobId: job.data.jobId,
    batchId: job.data.batchId,
    phase: "transcode",
    percent: 0,
    timestamp: new Date().toISOString(),
  });

  const pipeline = new ConversionPipeline();
  const result = await pipeline.run({
    sourcePath: source,
    outputPath: output,
    presetId: job.data.presetId,
    format: job.data.outputFormat,
    onStderr: () => {
      void job.updateProgress(50);
    },
  });

  if (!result.success) {
    throw new Error(`Conversion failed (exit ${result.exitCode})`);
  }

  await publishProgress({
    jobId: job.data.jobId,
    batchId: job.data.batchId,
    phase: "done",
    percent: 100,
    timestamp: new Date().toISOString(),
  });
}
