import { AbsoluteFill } from "remotion";

/** 업로드 전·후 프리셋 프레임 미리보기 플레이스홀더 */
export const PresetPreviewComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      MotionDot Preview
    </AbsoluteFill>
  );
};
