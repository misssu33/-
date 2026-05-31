import { randomUUID } from "node:crypto";
import { enqueueConversion } from "@motiondot/queue";
import type { ConversionJobMeta, PresetId, ExportFormat } from "@motiondot/shared";

export interface CreateJobInput {
  batchId: string;
  sourcePaths: string[];
  presetId: PresetId;
  outputFormat: ExportFormat;
}

const jobStore = new Map<string, ConversionJobMeta>();

export async function createBatchJob(
  input: CreateJobInput,
): Promise<ConversionJobMeta> {
  const jobId = randomUUID();
  const now = new Date().toISOString();

  await enqueueConversion({
    jobId,
    batchId: input.batchId,
    sourcePaths: input.sourcePaths,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    createdAt: now,
  });

  const meta: ConversionJobMeta = {
    jobId,
    batchId: input.batchId,
    status: "queued",
    progress: 0,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    updatedAt: now,
  };
  jobStore.set(jobId, meta);
  return meta;
}

export async function getJobMeta(
  jobId: string,
): Promise<ConversionJobMeta | null> {
  return jobStore.get(jobId) ?? null;
}
