import { startBatchQueue } from "@/features/batch/services/batch-queue-service";
import type { ConversionJobMeta, PresetId, ExportFormat } from "@motiondot/shared";
import type { SourceMediaMeta } from "@motiondot/shared";

export interface CreateJobInput {
  batchId: string;
  files: SourceMediaMeta[];
  presetId: PresetId;
  outputFormat: ExportFormat;
}

const jobStore = new Map<string, ConversionJobMeta>();

/** @deprecated 배치는 POST /api/batch 사용 — 단일 잡 메타 조회용 stub 유지 */
export async function createBatchJob(
  input: CreateJobInput,
): Promise<ConversionJobMeta> {
  const batch = await startBatchQueue({
    batchId: input.batchId,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    files: input.files,
  });

  const first = batch.items[0];
  const meta: ConversionJobMeta = {
    jobId: first?.jobId ?? input.batchId,
    batchId: input.batchId,
    status: batch.status,
    progress: batch.progress,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    updatedAt: batch.updatedAt,
  };
  jobStore.set(meta.jobId, meta);
  return meta;
}

export async function getJobMeta(
  jobId: string,
): Promise<ConversionJobMeta | null> {
  return jobStore.get(jobId) ?? null;
}
