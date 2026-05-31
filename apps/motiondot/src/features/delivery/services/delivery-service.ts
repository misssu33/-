import {
  enqueueBatchExport,
  enqueueBatchPreview,
  getBatchStateStore,
  getDeliveryStateStore,
} from "@motiondot/queue";
import type {
  DeliverySnapshot,
  ExportFormat,
  PresetId,
  PresetOverrides,
  SourceMediaMeta,
} from "@motiondot/shared";

function downloadUrl(
  batchId: string,
  kind: "preview" | "export" | "zip",
  itemId?: string,
): string {
  const params = new URLSearchParams({ batchId, kind });
  if (itemId) params.set("itemId", itemId);
  return `/api/download?${params.toString()}`;
}

/** API 응답용 — 파일·ZIP 다운로드 URL 부여 */
export function enrichDeliverySnapshot(
  snapshot: DeliverySnapshot,
): DeliverySnapshot {
  const { batchId } = snapshot;
  return {
    ...snapshot,
    preview: {
      ...snapshot.preview,
      files: snapshot.preview.files.map((f) => ({
        ...f,
        url: downloadUrl(batchId, "preview", f.itemId),
      })),
    },
    export: {
      ...snapshot.export,
      zipUrl: snapshot.export.zipPath
        ? downloadUrl(batchId, "zip")
        : undefined,
      files: snapshot.export.files.map((f) => ({
        ...f,
        url: downloadUrl(batchId, "export", f.itemId),
      })),
    },
  };
}

export async function getDeliveryStatus(
  batchId: string,
): Promise<DeliverySnapshot | null> {
  const snap = await getDeliveryStateStore().getSnapshot(batchId);
  if (!snap) return null;
  return enrichDeliverySnapshot(snap);
}

export interface StartDeliveryInput {
  batchId: string;
  files: SourceMediaMeta[];
  presetId: PresetId;
  outputFormat: ExportFormat;
  presetOverrides?: PresetOverrides;
}

/** 배치 fast 프리뷰 큐 등록 */
export async function startBatchPreview(input: {
  batchId: string;
  files: SourceMediaMeta[];
}): Promise<{ jobId: string }> {
  if (input.files.length === 0) {
    throw new Error("No files for preview");
  }

  const jobId = await enqueueBatchPreview({
    batchId: input.batchId,
    items: input.files.map((f) => ({
      itemId: f.id,
      sourcePath: f.storagePath,
      originalName: f.originalName,
    })),
  });

  return { jobId };
}

/** 배치 최종 export — 변환 완료 파일 재사용 가능 */
export async function startBatchExport(
  input: StartDeliveryInput,
): Promise<{ jobId: string }> {
  if (input.files.length === 0) {
    throw new Error("No files for export");
  }

  const batch = await getBatchStateStore().getBatch(input.batchId);
  const outputByItem = new Map(
    batch?.items
      .filter((i) => i.status === "completed" && i.outputPath)
      .map((i) => [i.itemId, i.outputPath!] as const) ?? [],
  );

  const jobId = await enqueueBatchExport({
    batchId: input.batchId,
    presetId: input.presetId,
    outputFormat: input.outputFormat,
    presetOverrides: input.presetOverrides,
    items: input.files.map((f) => ({
      itemId: f.id,
      sourcePath: f.storagePath,
      originalName: f.originalName,
      existingOutputPath: outputByItem.get(f.id),
    })),
  });

  return { jobId };
}
