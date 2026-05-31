import { createExportQueue } from "@motiondot/queue";
import type { ExportFormat, PresetId } from "@motiondot/shared";
import { createStoragePathManager } from "@motiondot/shared";

export interface ExportRequestBody {
  jobId: string;
  batchId?: string;
  presetId: PresetId;
  format: ExportFormat;
  sourcePaths?: string[];
}

export async function startExport(body: ExportRequestBody) {
  const paths = createStoragePathManager();
  const batchId = body.batchId ?? body.jobId;
  const outputDir = paths.outputDir(body.jobId);
  const queue = createExportQueue();
  await queue.add("export", {
    jobId: body.jobId,
    batchId,
    sourcePaths: body.sourcePaths ?? [],
    presetId: body.presetId,
    format: body.format,
    outputDir,
  });
  return { jobId: body.jobId, status: "queued" as const };
}
