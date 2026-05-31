/** ffmpeg / ffprobe 실행 파일 경로 */
export function resolveFfmpegPath(override?: string): string {
  return override ?? process.env.FFMPEG_PATH ?? "ffmpeg";
}

export function resolveFfprobePath(override?: string): string {
  return override ?? process.env.FFPROBE_PATH ?? "ffprobe";
}
