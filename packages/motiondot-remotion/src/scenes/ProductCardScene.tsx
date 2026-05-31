import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  headline: string;
  price?: string;
  mediaSrc?: string;
  accentColor?: string;
}

export const ProductCardScene: React.FC<Props> = ({
  headline,
  price,
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 15], [0.9, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: 40 }}>
      <div
        style={{
          background: "rgba(0,0,0,0.65)",
          borderRadius: 16,
          padding: 24,
          border: `2px solid ${accentColor}`,
          transform: `scale(${scale})`,
        }}
      >
        <p style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>{headline}</p>
        {price && (
          <p style={{ color: accentColor, fontSize: 28, marginTop: 8 }}>{price}</p>
        )}
      </div>
    </AbsoluteFill>
  );
};
