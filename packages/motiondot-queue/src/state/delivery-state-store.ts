import type {
  DeliverySnapshot,
  ExportManifest,
  PreviewManifest,
} from "@motiondot/shared";
import { DELIVERY_STATE_KEYS } from "@motiondot/shared";
import {
  createEmptyExportManifest,
  createEmptyPreviewManifest,
} from "@motiondot/delivery";
import { getRedisConnection } from "../redis/connection";

export class DeliveryStateStore {
  constructor(private readonly redis = getRedisConnection()) {}

  async getSnapshot(batchId: string): Promise<DeliverySnapshot | null> {
    const raw = await this.redis.get(DELIVERY_STATE_KEYS.snapshot(batchId));
    if (!raw) return null;
    return JSON.parse(raw) as DeliverySnapshot;
  }

  async initSnapshot(
    batchId: string,
    format: ExportManifest["format"],
  ): Promise<DeliverySnapshot> {
    const snapshot: DeliverySnapshot = {
      batchId,
      preview: createEmptyPreviewManifest(batchId),
      export: createEmptyExportManifest(batchId, format),
    };
    await this.save(snapshot);
    return snapshot;
  }

  async updatePreview(
    batchId: string,
    patch: Partial<PreviewManifest>,
  ): Promise<PreviewManifest | null> {
    const snap = await this.getOrInit(batchId, "mp4");
    snap.preview = { ...snap.preview, ...patch, updatedAt: new Date().toISOString() };
    await this.save(snap);
    return snap.preview;
  }

  async updateExport(
    batchId: string,
    patch: Partial<ExportManifest>,
  ): Promise<ExportManifest | null> {
    const snap = await this.getOrInit(batchId, patch.format ?? "mp4");
    snap.export = { ...snap.export, ...patch, updatedAt: new Date().toISOString() };
    await this.save(snap);
    return snap.export;
  }

  private async getOrInit(
    batchId: string,
    format: ExportManifest["format"],
  ): Promise<DeliverySnapshot> {
    return (await this.getSnapshot(batchId)) ?? (await this.initSnapshot(batchId, format));
  }

  private async save(snapshot: DeliverySnapshot): Promise<void> {
    await this.redis.set(
      DELIVERY_STATE_KEYS.snapshot(snapshot.batchId),
      JSON.stringify(snapshot),
    );
  }
}

let store: DeliveryStateStore | null = null;

export function getDeliveryStateStore(): DeliveryStateStore {
  if (!store) store = new DeliveryStateStore();
  return store;
}
