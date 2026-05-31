import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  ctaText: string;
  accentColor?: string;
}

export const CtaBarScene: React.FC<Props> = ({
  ctaText,
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
        opacity,
      }}
    >
      <div
        style={{
          background: accentColor,
          color: "#fff",
          padding: "16px 48px",
          borderRadius: 999,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {ctaText}
      </div>
    </AbsoluteFill>
  );
};
