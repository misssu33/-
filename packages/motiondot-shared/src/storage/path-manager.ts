import { join } from "node:path";
import { resolveStorageRoot } from "./resolve-storage-root";

/** 스토리지 루트 하위 디렉터리 역할 */
export type StorageBucket = "temp" | "uploads" | "output" | "previews";

/**
 * 배치·작업 단위로 격리된 파일 경로를 생성합니다.
 * 워커와 API가 동일한 규칙으로 읽기/쓰기합니다.
 */
export class StoragePathManager {
  constructor(private readonly root: string) {}

  bucket(bucket: StorageBucket): string {
    return join(this.root, bucket);
  }

  uploadDir(batchId: string): string {
    return join(this.bucket("uploads"), batchId);
  }

  tempDir(jobId: string): string {
    return join(this.bucket("temp"), jobId);
  }

  outputDir(jobId: string): string {
    return join(this.bucket("output"), jobId);
  }

  previewPath(jobId: string, ext = "mp4"): string {
    return join(this.bucket("previews"), `${jobId}.${ext}`);
  }

  sourceFile(batchId: string, fileId: string, ext: string): string {
    return join(this.uploadDir(batchId), `${fileId}.${ext}`);
  }
}

/** 환경 변수 또는 기본 로컬 경로로 매니저 인스턴스 생성 */
export function createStoragePathManager(storageRoot?: string): StoragePathManager {
  return new StoragePathManager(resolveStorageRoot(storageRoot));
}
