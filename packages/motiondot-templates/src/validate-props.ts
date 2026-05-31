import type { AdTemplateProps } from "@motiondot/shared";

export interface TemplateValidationIssue {
  field: string;
  message: string;
}

export function validateTemplateProps(
  props: AdTemplateProps,
): TemplateValidationIssue[] {
  const issues: TemplateValidationIssue[] = [];
  if (!props.headline?.trim()) {
    issues.push({ field: "headline", message: "헤드라인은 필수입니다." });
  }
  if (props.headline && props.headline.length > 80) {
    issues.push({ field: "headline", message: "헤드라인은 80자 이하로 입력하세요." });
  }
  return issues;
}
