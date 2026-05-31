import { spawn } from "node:child_process";
import { resolveFfprobePath } from "../utils/ffmpeg-bin";

export interface FfprobeRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runFfprobe(
  args: string[],
  ffprobePath?: string,
): Promise<FfprobeRunResult> {
  const bin = resolveFfprobePath(ffprobePath);
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });

    child.stdout?.on("data", (buf: Buffer) => stdoutChunks.push(buf.toString()));
    child.stderr?.on("data", (buf: Buffer) => stderrChunks.push(buf.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout: stdoutChunks.join(""),
        stderr: stderrChunks.join(""),
      });
    });
  });
}
