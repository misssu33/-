import type { DeliveryFile, ExportManifest, PreviewManifest } from "@motiondot/shared";

export function createEmptyPreviewManifest(batchId: string): PreviewManifest {
  return {
    batchId,
    status: "idle",
    files: [],
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyExportManifest(
  batchId: string,
  format: ExportManifest["format"],
): ExportManifest {
  return {
    batchId,
    status: "idle",
    format,
    files: [],
    updatedAt: new Date().toISOString(),
  };
}

export function toDeliveryFile(input: {
  itemId: string;
  originalName: string;
  path: string;
  format: DeliveryFile["format"];
  sizeBytes?: number;
}): DeliveryFile {
  return {
    itemId: input.itemId,
    originalName: input.originalName,
    path: input.path,
    format: input.format,
    sizeBytes: input.sizeBytes,
  };
}
