import { createPreviewQueue } from "@motiondot/queue";
import { createStoragePathManager } from "@motiondot/shared";

export interface PreviewRequestBody {
  jobId: string;
  sourcePath: string;
}

export async function requestPreview(body: PreviewRequestBody) {
  const paths = createStoragePathManager();
  const previewPath = paths.previewPath(body.jobId);
  const queue = createPreviewQueue();
  await queue.add("preview", {
    jobId: body.jobId,
    sourcePath: body.sourcePath,
    previewPath,
  });
  return { jobId: body.jobId, previewPath };
}
