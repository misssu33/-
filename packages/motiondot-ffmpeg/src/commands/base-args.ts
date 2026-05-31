/** 공통 ffmpeg 인자 — 덮어쓰기·로그 레벨 */
export function baseFfmpegArgs(): string[] {
  return ["-y", "-hide_banner", "-loglevel", "warning"];
}
