import { UPLOAD_CONFIG } from "../constants";

export interface VideoValidationError {
  fileName: string;
  message: string;
}

/** 클라이언트 업로드 전 비디오 파일 검증 */
export function validateVideoFiles(files: File[]): VideoValidationError[] {
  const errors: VideoValidationError[] = [];

  if (files.length > UPLOAD_CONFIG.maxFiles) {
    errors.push({
      fileName: "(batch)",
      message: `한 번에 최대 ${UPLOAD_CONFIG.maxFiles}개까지 업로드할 수 있습니다.`,
    });
    return errors;
  }

  for (const file of files) {
    if (!file.type.startsWith("video/") && !hasVideoExtension(file.name)) {
      errors.push({
        fileName: file.name,
        message: "비디오 파일만 업로드할 수 있습니다.",
      });
    }
    if (file.size > UPLOAD_CONFIG.maxSizeBytes) {
      errors.push({
        fileName: file.name,
        message: `파일 크기는 ${UPLOAD_CONFIG.maxSizeBytes / (1024 * 1024)}MB 이하여야 합니다.`,
      });
    }
  }

  return errors;
}

function hasVideoExtension(name: string): boolean {
  return /\.(mp4|mov|webm|mkv|avi|mpeg|mpg|ogv)$/i.test(name);
}
