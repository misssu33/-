/** 서버·클라이언트 공통 비디오 MIME 허용 목록 */
export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/x-msvideo",
  "video/mpeg",
  "video/ogg",
] as const;

export function isAllowedVideoMime(mimeType: string): boolean {
  if (!mimeType) return false;
  if (
    ALLOWED_VIDEO_MIME_TYPES.includes(
      mimeType as (typeof ALLOWED_VIDEO_MIME_TYPES)[number],
    )
  ) {
    return true;
  }
  return mimeType.startsWith("video/");
}

const VIDEO_EXTENSIONS = /\.(mp4|mov|webm|mkv|avi|mpeg|mpg|ogv)$/i;

export function hasVideoFileExtension(fileName: string): boolean {
  return VIDEO_EXTENSIONS.test(fileName);
}
