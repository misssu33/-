import type { ProgressEvent, ProgressPhase } from "@motiondot/shared";
import { publishProgress } from "./progress-publisher";

interface ItemProgressInput {
  batchId: string;
  itemId: string;
  percent: number;
  batchPercent: number;
  phase?: ProgressPhase;
  message?: string;
}

interface BatchProgressInput {
  batchId: string;
  percent: number;
  phase: ProgressPhase;
  message?: string;
}

/** 파일 단위 진행률 이벤트 */
export async function publishItemProgress(
  input: ItemProgressInput,
): Promise<void> {
  const event: ProgressEvent = {
    scope: "item",
    jobId: input.itemId,
    batchId: input.batchId,
    itemId: input.itemId,
    phase: input.phase ?? "transcode",
    percent: input.percent,
    batchPercent: input.batchPercent,
    message: input.message,
    timestamp: new Date().toISOString(),
  };
  await publishProgress(event);
}

/** 배치 전체 진행률 이벤트 */
export async function publishBatchProgress(
  input: BatchProgressInput,
): Promise<void> {
  const event: ProgressEvent = {
    scope: "batch",
    jobId: input.batchId,
    batchId: input.batchId,
    phase: input.phase,
    percent: input.percent,
    batchPercent: input.percent,
    message: input.message,
    timestamp: new Date().toISOString(),
  };
  await publishProgress(event);
}
