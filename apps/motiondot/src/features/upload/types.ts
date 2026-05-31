import type { SourceMediaMeta } from "@motiondot/shared";

export interface UploadResult {
  batchId: string;
  files: SourceMediaMeta[];
}
