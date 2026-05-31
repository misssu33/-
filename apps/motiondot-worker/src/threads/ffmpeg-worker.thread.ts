import { parentPort } from "node:worker_threads";
import { ConversionPipeline } from "@motiondot/ffmpeg";
import type { FfmpegWorkerRequest, FfmpegWorkerResponse } from "./types";

/**
 * worker thread 진입점 — ffmpeg CPU 작업을 메인 BullMQ 루프와 분리
 */
parentPort?.on("message", async (raw: FfmpegWorkerRequest) => {
  if (raw.type !== "convert") return;

  const pipeline = new ConversionPipeline();
  let response: FfmpegWorkerResponse;

  try {
    if (raw.ffmpegPath) {
      process.env.FFMPEG_PATH = raw.ffmpegPath;
    }

    const result = await pipeline.run({
      sourcePath: raw.sourcePath,
      outputPath: raw.outputPath,
      presetId: raw.presetId,
      format: raw.format,
    });

    response = {
      requestId: raw.requestId,
      success: result.success,
      exitCode: result.exitCode,
    };
  } catch (err) {
    response = {
      requestId: raw.requestId,
      success: false,
      exitCode: 1,
      errorMessage: err instanceof Error ? err.message : "Thread conversion failed",
    };
  }

  parentPort?.postMessage(response);
});
