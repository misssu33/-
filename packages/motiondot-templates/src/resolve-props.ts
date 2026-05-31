import type { AdTemplateProps } from "@motiondot/shared";
import type { AdTemplateDefinition } from "./types";

const DEFAULT_COLORS = {
  accent: "#6366f1",
  background: "#0a0a0a",
};

/** 템플릿 기본값 + 사용자 입력 병합 */
export function resolveTemplateProps(
  template: AdTemplateDefinition,
  input?: Partial<AdTemplateProps>,
): AdTemplateProps {
  return {
    ...template.defaultProps,
    ...input,
    accentColor: input?.accentColor ?? template.defaultProps.accentColor ?? DEFAULT_COLORS.accent,
    backgroundColor:
      input?.backgroundColor ??
      template.defaultProps.backgroundColor ??
      DEFAULT_COLORS.background,
  };
}
