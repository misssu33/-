import type {
  BatchItemState,
  BatchJobMeta,
  BatchJobPayload,
  BatchStatus,
  JobStatus,
} from "@motiondot/shared";
import { BATCH_STATE_KEYS } from "@motiondot/shared";
import { getRedisConnection } from "../redis/connection";
import {
  publishBatchProgress,
  publishItemProgress,
} from "../events/publish-batch-progress";

interface BatchMetaRecord {
  batchId: string;
  status: BatchStatus;
  presetId: string;
  outputFormat: string;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  progress: number;
  updatedAt: string;
}

/** Redis 기반 배치·아이템 상태 저장소 */
export class BatchStateStore {
  constructor(private readonly redis = getRedisConnection()) {}

  async initBatch(payload: BatchJobPayload): Promise<void> {
    const meta: BatchMetaRecord = {
      batchId: payload.batchId,
      status: "queued",
      presetId: payload.presetId,
      outputFormat: payload.outputFormat,
      totalItems: payload.items.length,
      completedItems: 0,
      failedItems: 0,
      progress: 0,
      updatedAt: payload.createdAt,
    };

    const pipeline = this.redis.pipeline();
    pipeline.set(BATCH_STATE_KEYS.meta(payload.batchId), JSON.stringify(meta));

    for (const item of payload.items) {
      const state: BatchItemState = {
        itemId: item.itemId,
        jobId: item.itemId,
        originalName: item.originalName,
        status: "queued",
        progress: 0,
      };
      pipeline.hset(
        BATCH_STATE_KEYS.items(payload.batchId),
        item.itemId,
        JSON.stringify(state),
      );
    }

    await pipeline.exec();
  }

  async setBatchStatus(batchId: string, status: BatchStatus): Promise<void> {
    const meta = await this.getMetaRecord(batchId);
    if (!meta) return;
    meta.status = status;
    meta.updatedAt = new Date().toISOString();
    await this.redis.set(BATCH_STATE_KEYS.meta(batchId), JSON.stringify(meta));
  }

  async updateItem(
    batchId: string,
    itemId: string,
    patch: Partial<BatchItemState>,
  ): Promise<BatchJobMeta | null> {
    const raw = await this.redis.hget(BATCH_STATE_KEYS.items(batchId), itemId);
    if (!raw) return null;

    const current = JSON.parse(raw) as BatchItemState;
    const next = { ...current, ...patch };
    await this.redis.hset(
      BATCH_STATE_KEYS.items(batchId),
      itemId,
      JSON.stringify(next),
    );

    const batch = await this.recomputeBatchProgress(
      batchId,
      current.status,
      next.status,
    );

    if (patch.progress !== undefined) {
      await publishItemProgress({
        batchId,
        itemId,
        percent: next.progress,
        batchPercent: batch?.progress ?? 0,
        message: next.originalName,
        phase: next.status === "completed" ? "done" : "transcode",
      });
    }

    return batch;
  }

  async getBatch(batchId: string): Promise<BatchJobMeta | null> {
    const meta = await this.getMetaRecord(batchId);
    if (!meta) return null;

    const itemsRaw = await this.redis.hgetall(BATCH_STATE_KEYS.items(batchId));
    const items = Object.values(itemsRaw).map(
      (v) => JSON.parse(v) as BatchItemState,
    );

    return {
      batchId: meta.batchId,
      status: meta.status,
      presetId: meta.presetId as BatchJobMeta["presetId"],
      outputFormat: meta.outputFormat as BatchJobMeta["outputFormat"],
      progress: meta.progress,
      totalItems: meta.totalItems,
      completedItems: meta.completedItems,
      failedItems: meta.failedItems,
      items,
      updatedAt: meta.updatedAt,
    };
  }

  private async recomputeBatchProgress(
    batchId: string,
    prevStatus: JobStatus,
    nextStatus: JobStatus,
  ): Promise<BatchJobMeta | null> {
    const meta = await this.getMetaRecord(batchId);
    if (!meta) return null;

    const terminal: JobStatus[] = ["completed", "failed", "cancelled"];
    if (!terminal.includes(prevStatus) && terminal.includes(nextStatus)) {
      if (nextStatus === "completed") meta.completedItems += 1;
      if (nextStatus === "failed") meta.failedItems += 1;
    }

    const items = await this.loadItems(batchId);
    meta.progress = computeAggregatePercent(items);

    const done = meta.completedItems + meta.failedItems;
    if (done >= meta.totalItems && meta.totalItems > 0) {
      meta.status = meta.failedItems > 0 ? "failed" : "completed";
    } else if (done > 0 || items.some((i) => i.status === "processing")) {
      meta.status = "processing";
    }

    meta.updatedAt = new Date().toISOString();
    await this.redis.set(BATCH_STATE_KEYS.meta(batchId), JSON.stringify(meta));

    await publishBatchProgress({
      batchId,
      phase:
        meta.status === "completed" || meta.status === "failed"
          ? "done"
          : "transcode",
      percent: meta.progress,
      message: `${meta.completedItems}/${meta.totalItems} files`,
    });

    return this.getBatch(batchId);
  }

  private async loadItems(batchId: string): Promise<BatchItemState[]> {
    const itemsRaw = await this.redis.hgetall(BATCH_STATE_KEYS.items(batchId));
    return Object.values(itemsRaw).map((v) => JSON.parse(v) as BatchItemState);
  }

  private async getMetaRecord(batchId: string): Promise<BatchMetaRecord | null> {
    const raw = await this.redis.get(BATCH_STATE_KEYS.meta(batchId));
    if (!raw) return null;
    return JSON.parse(raw) as BatchMetaRecord;
  }
}

function computeAggregatePercent(items: BatchItemState[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => {
    if (item.status === "completed") return acc + 100;
    if (item.status === "failed") return acc + 0;
    return acc + item.progress;
  }, 0);
  return Math.round(sum / items.length);
}

let store: BatchStateStore | null = null;

export function getBatchStateStore(): BatchStateStore {
  if (!store) store = new BatchStateStore();
  return store;
}

/** 테스트 간 Redis 클라이언트 교체 시 스토어 재생성 */
export function resetBatchStateStore(): void {
  store = null;
}
