import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  headline: string;
  subheadline?: string;
  accentColor?: string;
}

export const TextStackScene: React.FC<Props> = ({
  headline,
  subheadline,
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 12], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 48,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <h1
        style={{
          color: "#fafafa",
          fontSize: 64,
          fontWeight: 800,
          textAlign: "center",
          textShadow: `0 0 40px ${accentColor}`,
        }}
      >
        {headline}
      </h1>
      {subheadline && (
        <p style={{ color: "#a1a1aa", fontSize: 28, marginTop: 16, textAlign: "center" }}>
          {subheadline}
        </p>
      )}
    </AbsoluteFill>
  );
};
