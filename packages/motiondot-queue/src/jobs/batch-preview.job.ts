import { composeBullJobId } from "@motiondot/shared";
import { createPreviewQueue } from "../queues/preview.queue";
import { getDeliveryStateStore } from "../state/delivery-state-store";

export interface BatchPreviewJobData {
  batchId: string;
  items: { itemId: string; sourcePath: string; originalName: string }[];
}

export async function enqueueBatchPreview(
  data: BatchPreviewJobData,
): Promise<string> {
  await getDeliveryStateStore().updatePreview(data.batchId, {
    status: "queued",
  });
  const queue = createPreviewQueue();
  const job = await queue.add("batch-preview", data, {
    jobId: composeBullJobId(data.batchId, "preview"),
  });
  return job.id ?? composeBullJobId(data.batchId, "preview");
}
