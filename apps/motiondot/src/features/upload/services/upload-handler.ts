import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  createStoragePathManager,
  UPLOAD_LIMITS,
  isAllowedVideoMime,
  hasVideoFileExtension,
} from "@motiondot/shared";
import type { UploadResult } from "../types";

function assertVideoFile(file: File): void {
  const mimeOk = file.type ? isAllowedVideoMime(file.type) : false;
  const extOk = hasVideoFileExtension(file.name);
  if (!mimeOk && !extOk) {
    throw new Error(`Not a video file: ${file.name}`);
  }
}

/**
 * 서버 업로드 핸들러 — 비디오 검증 후 disk writes
 * (프로덕션: S3/R2 presigned URL로 대체 가능)
 */
export async function handleUpload(request: Request): Promise<UploadResult> {
  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    throw new Error("No files provided");
  }
  if (files.length > UPLOAD_LIMITS.maxBatchFiles) {
    throw new Error("Too many files in batch");
  }

  const batchId = randomUUID();
  const paths = createStoragePathManager();
  const uploadDir = paths.uploadDir(batchId);
  await mkdir(uploadDir, { recursive: true });

  const metas: UploadResult["files"] = [];

  for (const file of files) {
    assertVideoFile(file);

    if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
      throw new Error(`File too large: ${file.name}`);
    }

    const id = randomUUID();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const dest = join(uploadDir, `${id}.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(dest, buffer);
    metas.push({
      id,
      originalName: file.name,
      storagePath: dest,
      mimeType: file.type || `video/${ext}`,
      sizeBytes: file.size,
    });
  }

  return { batchId, files: metas };
}
