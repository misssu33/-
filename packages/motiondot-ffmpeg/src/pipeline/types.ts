import type { ConvertMediaInput, ConvertMediaResult } from "../conversion/types";

export type ConversionPipelineInput = ConvertMediaInput;
export type ConversionPipelineResult = Pick<
  ConvertMediaResult,
  "success" | "exitCode"
>;
