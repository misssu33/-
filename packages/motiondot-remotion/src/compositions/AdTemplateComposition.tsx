import { AbsoluteFill, Sequence } from "remotion";
import type { AdCompositionPlan } from "@motiondot/shared";
import { getSceneComponent } from "../render/scene-registry";

export interface AdTemplateCompositionProps {
  plan: AdCompositionPlan;
}

/** 광고 템플릿 엔진 플랜을 Remotion 시퀀스로 렌더 */
export const AdTemplateComposition: React.FC<AdTemplateCompositionProps> = ({
  plan,
}) => {
  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: plan.props.backgroundColor ?? "#0a0a0a" }}>
      {plan.scenes.map((scene) => {
        const from = offset;
        offset += scene.durationInFrames;
        const Scene = getSceneComponent(scene.component);
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={scene.durationInFrames}
          >
            <Scene {...scene.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
