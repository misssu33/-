import type { AdCompositionPlan, AdScenePlan } from "@motiondot/shared";
import { resolvePreset } from "@motiondot/presets";
import { getAdTemplate } from "../registry";
import { resolveTemplateProps } from "../resolve-props";
import type { BuildPlanInput } from "../types";

/** 템플릿 + 프리셋 → Remotion 렌더 플랜 */
export function buildCompositionPlan(input: BuildPlanInput): AdCompositionPlan {
  const template = getAdTemplate(input.templateId);
  const preset = resolvePreset(input.presetId);
  const props = resolveTemplateProps(template, input.props);
  const fps = preset.fps;
  const durationInFrames = Math.round(template.durationSec * fps);

  const scenes: AdScenePlan[] = template.sceneBlueprint.map((scene) => ({
    id: scene.id,
    component: scene.component,
    durationInFrames: Math.round(scene.durationSec * fps),
    props: {
      ...scene.defaultSceneProps,
      ...mapSceneProps(scene.component, props),
    },
  }));

  return {
    templateId: template.id,
    presetId: input.presetId,
    width: preset.width,
    height: preset.height,
    fps,
    durationInFrames,
    props,
    scenes,
  };
}

function mapSceneProps(
  component: AdScenePlan["component"],
  props: import("@motiondot/shared").AdTemplateProps,
): Record<string, unknown> {
  switch (component) {
    case "media_backdrop":
      return { mediaSrc: props.mediaSrc, backgroundColor: props.backgroundColor };
    case "text_stack":
      return {
        headline: props.headline,
        subheadline: props.subheadline,
        accentColor: props.accentColor,
      };
    case "product_card":
      return {
        headline: props.headline,
        price: props.price,
        mediaSrc: props.mediaSrc,
        accentColor: props.accentColor,
      };
    case "cta_bar":
      return { ctaText: props.ctaText ?? "Buy Now", accentColor: props.accentColor };
    case "brand_lockup":
      return { brandName: props.brandName, accentColor: props.accentColor };
    default:
      return {};
  }
}
