import type { BatchJobPayload } from "@motiondot/shared";
import { getBatchStateStore } from "@motiondot/queue";
import type { WorkerConfig } from "@motiondot/worker/config/worker.config";
import { runProcessorConversion } from "./processor-conversion";

/**
 * BullMQ 없이 배치 init → processing → 파일별 conversion.processor
 * (batch.processor의 dispatch 결과와 동일한 최종 상태)
 */
export async function runBatchPipelineWithoutQueue(
  payload: BatchJobPayload,
  config: WorkerConfig,
): Promise<string[]> {
  const store = getBatchStateStore();
  await store.initBatch(payload);
  await store.setBatchStatus(payload.batchId, "processing");

  const outputs: string[] = [];
  for (const item of payload.items) {
    outputs.push(
      await runProcessorConversion(payload, item, config, { skipInit: true }),
    );
  }
  return outputs;
}
