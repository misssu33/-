import type { ExportFormat } from "@motiondot/shared";

/** 변환 결과 파일 경로 생성 */
export function buildConversionOutputPath(
  outputDir: string,
  itemId: string,
  format: ExportFormat,
): string {
  return `${outputDir}/${itemId}.${format}`;
}
