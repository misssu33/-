import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createStoragePathManager } from "@motiondot/shared";

const execFileAsync = promisify(execFile);

/** lavfi 테스트 패턴 1초 MP4 생성 */
export async function createTestMp4(
  outputPath: string,
  ffmpegPath = "ffmpeg",
): Promise<void> {
  await mkdir(join(outputPath, ".."), { recursive: true });
  await execFileAsync(
    ffmpegPath,
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "testsrc=duration=1:size=320x240:rate=30",
      "-pix_fmt",
      "yuv420p",
      "-c:v",
      "libx264",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { timeout: 60_000 },
  );
}

export interface UploadedFixture {
  batchId: string;
  fileId: string;
  sourcePath: string;
  originalName: string;
}

/** 업로드 디렉터리에 테스트 영상 배치 */
export async function seedUploadFixture(
  storageRoot: string,
  ffmpegPath: string,
): Promise<UploadedFixture> {
  const batchId = randomUUID();
  const fileId = randomUUID();
  const paths = createStoragePathManager(storageRoot);
  const uploadDir = paths.uploadDir(batchId);
  await mkdir(uploadDir, { recursive: true });

  const originalName = "e2e-test.mp4";
  const sourcePath = join(uploadDir, `${fileId}.mp4`);
  await createTestMp4(sourcePath, ffmpegPath);

  return { batchId, fileId, sourcePath, originalName };
}
