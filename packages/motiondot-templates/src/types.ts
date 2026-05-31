import type {
  AdTemplateCategory,
  AdTemplateId,
  AdTemplateProps,
  PresetId,
} from "@motiondot/shared";

export interface AdTemplateDefinition {
  id: AdTemplateId;
  label: string;
  description: string;
  category: AdTemplateCategory;
  /** 권장 SNS 프리셋 */
  recommendedPresets: PresetId[];
  durationSec: number;
  defaultProps: AdTemplateProps;
  sceneBlueprint: SceneBlueprint[];
}

export interface SceneBlueprint {
  id: string;
  component: import("@motiondot/shared").AdSceneComponent;
  durationSec: number;
  defaultSceneProps?: Record<string, unknown>;
}

export interface BuildPlanInput {
  templateId: AdTemplateId;
  presetId: PresetId;
  props?: Partial<AdTemplateProps>;
}
