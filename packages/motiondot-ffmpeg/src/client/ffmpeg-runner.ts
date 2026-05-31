import { spawn } from "node:child_process";

export interface FfmpegRunOptions {
  args: string[];
  ffmpegPath?: string;
  onStderr?: (chunk: string) => void;
}

export interface FfmpegRunResult {
  exitCode: number;
  stderr: string;
}

/**
 * ffmpeg 프로세스 실행 — progress 파싱은 별도 parser에서 처리
 */
export function runFfmpeg(options: FfmpegRunOptions): Promise<FfmpegRunResult> {
  const bin = options.ffmpegPath ?? process.env.FFMPEG_PATH ?? "ffmpeg";
  const stderrChunks: string[] = [];

  return new Promise((resolve, reject) => {
    const child = spawn(bin, options.args, { stdio: ["ignore", "ignore", "pipe"] });

    child.stderr?.on("data", (buf: Buffer) => {
      const text = buf.toString();
      stderrChunks.push(text);
      options.onStderr?.(text);
    });

    child.on("error", reject);
    child.on("close", (code: number | null) => {
      resolve({
        exitCode: code ?? 1,
        stderr: stderrChunks.join(""),
      });
    });
  });
}
