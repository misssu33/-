/**
 * @motiondot/shared UPLOAD_LIMITS 와 동기화
 * (클라이언트 번들에서 Node 전용 shared 엔트리 import 방지)
 */
export const UPLOAD_CONFIG = {
  maxFiles: 50,
  maxSizeBytes: 100 * 1024 * 1024,
} as const;

/** react-dropzone accept — 비디오 전용 */
export const VIDEO_DROPZONE_ACCEPT = {
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov", ".qt"],
  "video/webm": [".webm"],
  "video/x-matroska": [".mkv"],
  "video/x-msvideo": [".avi"],
  "video/mpeg": [".mpeg", ".mpg"],
  "video/ogg": [".ogv"],
} as const;
