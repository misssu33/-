import { startBatchPreview } from "@/features/delivery/services/delivery-service";
import type { SourceMediaMeta } from "@motiondot/shared";

export interface PreviewRequestBody {
  batchId: string;
  files: SourceMediaMeta[];
}

/** 레거시 /api/preview — 배치 fast 프리뷰로 위임 */
export async function requestPreview(body: PreviewRequestBody) {
  return startBatchPreview({
    batchId: body.batchId,
    files: body.files,
  });
}
