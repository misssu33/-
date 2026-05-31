import { Composition } from "remotion";
import { PresetPreviewComposition } from "./PresetPreviewComposition";

/** Remotion Studio 진입점 — 모든 컴포지션 등록 */
export const RootComposition: React.FC = () => {
  return (
    <>
      <Composition
        id="PresetPreview"
        component={PresetPreviewComposition}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
