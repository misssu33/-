import { parentPort } from "node:worker_threads";
import { convertMedia, estimateProgressPercent } from "@motiondot/ffmpeg";
import type {
  FfmpegWorkerRequest,
  FfmpegWorkerResponse,
} from "./types";

parentPort?.on("message", async (raw: FfmpegWorkerRequest) => {
  if (raw.type !== "convert") return;

  let response: FfmpegWorkerResponse;

  try {
    const result = await convertMedia({
      sourcePath: raw.sourcePath,
      outputPath: raw.outputPath,
      presetId: raw.presetId,
      format: raw.format,
      ffmpegPath: raw.ffmpegPath,
      presetOverrides: raw.presetOverrides,
      onStderr: (chunk) => {
        const percent = estimateProgressPercent(chunk, raw.durationSec ?? null);
        if (percent !== null) {
          parentPort?.postMessage({
            type: "progress",
            requestId: raw.requestId,
            percent,
          });
        }
      },
    });

    response = {
      type: "done",
      requestId: raw.requestId,
      success: result.success,
      exitCode: result.exitCode,
    };
  } catch (err) {
    response = {
      type: "done",
      requestId: raw.requestId,
      success: false,
      exitCode: 1,
      errorMessage:
        err instanceof Error ? err.message : "Thread conversion failed",
    };
  }

  parentPort?.postMessage(response);
});
