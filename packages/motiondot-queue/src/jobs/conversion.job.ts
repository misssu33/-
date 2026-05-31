import { composeBullJobId, type ConversionJobPayload } from "@motiondot/shared";
import { createConversionQueue } from "../queues/conversion.queue";

export type ConversionJobData = ConversionJobPayload;

export async function enqueueConversion(
  data: ConversionJobData,
): Promise<string> {
  const queue = createConversionQueue();
  const jobId = data.batchId
    ? composeBullJobId(data.batchId, data.itemId)
    : data.jobId;
  const job = await queue.add("convert", data, { jobId });
  return job.id ?? data.jobId;
}
