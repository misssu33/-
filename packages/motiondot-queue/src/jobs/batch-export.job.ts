import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";
import { composeBullJobId } from "@motiondot/shared";
import { createExportQueue } from "../queues/export.queue";
import { getDeliveryStateStore } from "../state/delivery-state-store";

export interface BatchExportJobData {
  batchId: string;
  presetId: PresetId;
  outputFormat: ExportFormat;
  presetOverrides?: PresetOverrides;
  items: {
    itemId: string;
    sourcePath: string;
    originalName: string;
    existingOutputPath?: string;
  }[];
}

export async function enqueueBatchExport(
  data: BatchExportJobData,
): Promise<string> {
  await getDeliveryStateStore().initSnapshot(data.batchId, data.outputFormat);
  await getDeliveryStateStore().updateExport(data.batchId, {
    status: "queued",
    format: data.outputFormat,
  });

  const queue = createExportQueue();
  const job = await queue.add("batch-export", data, {
    jobId: composeBullJobId(data.batchId, "export"),
  });
  return job.id ?? composeBullJobId(data.batchId, "export");
}
