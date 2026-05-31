import { startBatchExport } from "@/features/delivery/services/delivery-service";
import type {
  ExportFormat,
  PresetId,
  PresetOverrides,
  SourceMediaMeta,
} from "@motiondot/shared";

export interface ExportRequestBody {
  batchId: string;
  presetId: PresetId;
  format: ExportFormat;
  files: SourceMediaMeta[];
  presetOverrides?: PresetOverrides;
}

/** 레거시 /api/export — 배치 export로 위임 */
export async function startExport(body: ExportRequestBody) {
  return startBatchExport({
    batchId: body.batchId,
    files: body.files,
    presetId: body.presetId,
    outputFormat: body.format,
    presetOverrides: body.presetOverrides,
  });
}
