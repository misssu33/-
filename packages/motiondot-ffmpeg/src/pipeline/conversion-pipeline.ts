import { convertMedia } from "../conversion/convert";
import type { ConversionPipelineInput, ConversionPipelineResult } from "./types";

export type { ConversionPipelineInput, ConversionPipelineResult } from "./types";

/** @deprecated convertMedia() 사용 권장 — 워커 호환용 얇은 래퍼 */
export class ConversionPipeline {
  async run(input: ConversionPipelineInput): Promise<ConversionPipelineResult> {
    const result = await convertMedia(input);
    return { success: result.success, exitCode: result.exitCode };
  }
}
