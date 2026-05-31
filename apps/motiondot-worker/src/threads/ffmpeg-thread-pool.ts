import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { FfmpegWorkerRequest, FfmpegWorkerResponse } from "./types";
import type { ExportFormat, PresetId } from "@motiondot/shared";

export interface ThreadPoolConvertInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  ffmpegPath?: string;
}

interface PoolTask {
  input: ThreadPoolConvertInput;
  resolve: (value: FfmpegWorkerResponse) => void;
  reject: (reason: Error) => void;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_SCRIPT = join(__dirname, "ffmpeg-worker.thread.ts");

/**
 * ffmpeg 전용 worker_threads 풀 — BullMQ concurrency와 별도로 CPU 바운드 작업 격리
 */
export class FfmpegThreadPool {
  private readonly workers: Worker[] = [];
  private readonly idle: Worker[] = [];
  private readonly pending: PoolTask[] = [];

  constructor(
    private readonly size: number,
    private readonly ffmpegPath?: string,
  ) {
    for (let i = 0; i < size; i++) {
      this.spawnWorker();
    }
  }

  run(input: ThreadPoolConvertInput): Promise<FfmpegWorkerResponse> {
    return new Promise((resolve, reject) => {
      this.pending.push({ input, resolve, reject });
      this.dispatch();
    });
  }

  async shutdown(): Promise<void> {
    await Promise.all(this.workers.map((w) => w.terminate()));
    this.workers.length = 0;
    this.idle.length = 0;
  }

  private spawnWorker(): void {
    const worker = new Worker(WORKER_SCRIPT, {
      execArgv: ["--import", "tsx"],
    });

    worker.on("message", (msg: FfmpegWorkerResponse) => {
      const task = (worker as Worker & { __task?: PoolTask }).__task;
      if (task) {
        task.resolve(msg);
        (worker as Worker & { __task?: PoolTask }).__task = undefined;
      }
      this.idle.push(worker);
      this.dispatch();
    });

    worker.on("error", (err) => {
      const task = (worker as Worker & { __task?: PoolTask }).__task;
      if (task) {
        task.reject(err);
        (worker as Worker & { __task?: PoolTask }).__task = undefined;
      }
      this.idle.push(worker);
      this.dispatch();
    });

    this.workers.push(worker);
    this.idle.push(worker);
  }

  private dispatch(): void {
    while (this.pending.length > 0 && this.idle.length > 0) {
      const task = this.pending.shift()!;
      const worker = this.idle.pop()!;

      const request: FfmpegWorkerRequest = {
        type: "convert",
        requestId: randomUUID(),
        sourcePath: task.input.sourcePath,
        outputPath: task.input.outputPath,
        presetId: task.input.presetId,
        format: task.input.format,
        ffmpegPath: task.input.ffmpegPath ?? this.ffmpegPath,
      };

      (worker as Worker & { __task?: PoolTask }).__task = task;
      worker.postMessage(request);
    }
  }
}

let pool: FfmpegThreadPool | null = null;

export function getFfmpegThreadPool(
  size: number,
  ffmpegPath?: string,
): FfmpegThreadPool {
  if (!pool) {
    pool = new FfmpegThreadPool(size, ffmpegPath);
  }
  return pool;
}

export async function shutdownFfmpegThreadPool(): Promise<void> {
  if (pool) {
    await pool.shutdown();
    pool = null;
  }
}
