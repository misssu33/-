import { FlowProducer } from "bullmq";
import type { BatchJobPayload } from "@motiondot/shared";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "../redis/connection";

let flowProducer: FlowProducer | null = null;

function getFlowProducer(): FlowProducer {
  if (!flowProducer) {
    flowProducer = new FlowProducer({ connection: getBullMQConnection() });
  }
  return flowProducer;
}

/**
 * BullMQ Flow — 자식 conversion 잡 완료 후 부모 batch 잡 실행
 * (대안 오케스트레이션; 기본 경로는 BatchOrchestrator fan-out)
 */
export async function enqueueBatchFlow(payload: BatchJobPayload): Promise<void> {
  const producer = getFlowProducer();

  await producer.add({
    name: "batch-complete",
    queueName: QUEUE_NAMES.BATCH,
    data: { ...payload, phase: "finalize" },
    opts: { jobId: `${payload.batchId}:finalize` },
    children: payload.items.map((item) => ({
      name: "convert",
      queueName: QUEUE_NAMES.CONVERSION,
      data: {
        jobId: item.itemId,
        itemId: item.itemId,
        batchId: payload.batchId,
        sourcePath: item.sourcePath,
        originalName: item.originalName,
        presetId: payload.presetId,
        outputFormat: payload.outputFormat,
        createdAt: payload.createdAt,
      },
      opts: { jobId: `${payload.batchId}:${item.itemId}` },
    })),
  });
}
