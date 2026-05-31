import type {
  BatchItemState,
  BatchJobMeta,
  BatchJobPayload,
  BatchStatus,
  JobStatus,
} from "@motiondot/shared";
import { BATCH_STATE_KEYS } from "@motiondot/shared";
import { getRedisConnection } from "../redis/connection";
import { publishProgress } from "../events/progress-publisher";

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

    return this.recomputeBatchProgress(batchId, itemId, current.status, next.status);
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
    itemId: string,
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

    const done = meta.completedItems + meta.failedItems;
    meta.progress =
      meta.totalItems > 0 ? Math.round((done / meta.totalItems) * 100) : 0;

    if (done >= meta.totalItems) {
      meta.status = meta.failedItems > 0 ? "failed" : "completed";
    } else if (done > 0 || nextStatus === "processing") {
      meta.status = "processing";
    }

    meta.updatedAt = new Date().toISOString();
    await this.redis.set(BATCH_STATE_KEYS.meta(batchId), JSON.stringify(meta));

    await publishProgress({
      jobId: batchId,
      batchId,
      phase: meta.status === "completed" ? "done" : "transcode",
      percent: meta.progress,
      timestamp: meta.updatedAt,
    });

    void itemId;
    return this.getBatch(batchId);
  }

  private async getMetaRecord(batchId: string): Promise<BatchMetaRecord | null> {
    const raw = await this.redis.get(BATCH_STATE_KEYS.meta(batchId));
    if (!raw) return null;
    return JSON.parse(raw) as BatchMetaRecord;
  }
}

let store: BatchStateStore | null = null;

export function getBatchStateStore(): BatchStateStore {
  if (!store) store = new BatchStateStore();
  return store;
}
