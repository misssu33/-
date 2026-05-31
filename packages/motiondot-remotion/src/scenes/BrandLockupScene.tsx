import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  brandName?: string;
  accentColor?: string;
}

export const BrandLockupScene: React.FC<Props> = ({
  brandName = "Brand",
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 24,
          background: accentColor,
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          fontWeight: 800,
          color: "#fff",
        }}
      >
        {brandName.charAt(0)}
      </div>
      <p style={{ color: "#fafafa", fontSize: 32, marginTop: 24, fontWeight: 600 }}>
        {brandName}
      </p>
    </AbsoluteFill>
  );
};
