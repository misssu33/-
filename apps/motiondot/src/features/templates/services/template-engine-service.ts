import {
  buildCompositionPlan,
  getAdTemplate,
  listAdTemplates,
  validateTemplateProps,
  resolveTemplateProps,
} from "@motiondot/templates";
import type { AdCompositionPlan, AdTemplateId, AdTemplateProps } from "@motiondot/shared";
import type { PresetId } from "@motiondot/shared";

export function listTemplates() {
  return listAdTemplates();
}

export function buildPlan(input: {
  templateId: AdTemplateId;
  presetId: PresetId;
  props?: Partial<AdTemplateProps>;
}): { plan: AdCompositionPlan; issues: ReturnType<typeof validateTemplateProps> } {
  const template = getAdTemplate(input.templateId);
  const resolved = resolveTemplateProps(template, input.props);
  const issues = validateTemplateProps(resolved);
  const plan = buildCompositionPlan({
    templateId: input.templateId,
    presetId: input.presetId,
    props: input.props,
  });
  return { plan, issues };
}
