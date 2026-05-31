import type { ExportFormat } from "@motiondot/shared";
import { getPreset } from "@motiondot/presets";
import type { PresetId } from "@motiondot/shared";
import { runFfmpeg } from "../client/ffmpeg-runner";
import { buildTranscodeArgs } from "../commands/transcode";
import { buildGifArgs, buildWebpArgs } from "../formats/index";

export interface ConversionPipelineInput {
  sourcePath: string;
  outputPath: string;
  presetId: PresetId;
  format: ExportFormat;
  onStderr?: (chunk: string) => void;
}

export interface ConversionPipelineResult {
  success: boolean;
  exitCode: number;
}

/**
 * 프리셋 + 포맷에 따라 ffmpeg 인자를 조립하고 실행합니다.
 * 워커 processor에서 호출합니다.
 */
export class ConversionPipeline {
  async run(input: ConversionPipelineInput): Promise<ConversionPipelineResult> {
    const preset = getPreset(input.presetId);
    let args: string[];

    switch (input.format) {
      case "gif":
        args = buildGifArgs(input.sourcePath, input.outputPath);
        break;
      case "webp":
        args = buildWebpArgs(input.sourcePath, input.outputPath);
        break;
      case "mp4":
      default:
        args = buildTranscodeArgs({
          inputPath: input.sourcePath,
          outputPath: input.outputPath,
          preset,
        });
        break;
    }

    const result = await runFfmpeg({ args, onStderr: input.onStderr });
    return {
      success: result.exitCode === 0,
      exitCode: result.exitCode,
    };
  }
}
