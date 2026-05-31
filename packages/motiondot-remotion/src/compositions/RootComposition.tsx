import { Composition } from "remotion";
import { buildCompositionPlan } from "@motiondot/templates";
import { AdTemplateComposition } from "./AdTemplateComposition";

const defaultPlan = buildCompositionPlan({
  templateId: "product_hero",
  presetId: "tiktok",
});

export const RootComposition: React.FC = () => (
  <>
    <Composition
      id="AdTemplate"
      component={AdTemplateComposition}
      durationInFrames={defaultPlan.durationInFrames}
      fps={defaultPlan.fps}
      width={defaultPlan.width}
      height={defaultPlan.height}
      defaultProps={{ plan: defaultPlan }}
    />
    <Composition
      id="PresetPreview"
      component={AdTemplateComposition}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ plan: defaultPlan }}
    />
  </>
);
